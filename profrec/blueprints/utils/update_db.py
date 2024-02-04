from concurrent.futures import ThreadPoolExecutor
import aiohttp
from flask import jsonify
from json import dumps
from .scrape_dir import get_professor_profiles
from .prof_info import handle_multiple_user_inputs
import os, logging, psycopg2, requests, asyncio, json
from requests.exceptions import ConnectTimeout
from dotenv import load_dotenv
import psycopg2.extras
load_dotenv()  

url = "https://anex.us/grades/getData/"
db_user = os.getenv('PGUSER')  # Railway provides this as 'postgres'
db_password = os.getenv('PGPASSWORD')  # Your password
db_host = os.getenv('PGHOST')  # Railway provides this host
db_port = os.getenv('PGPORT')  # The port Railway provides
db_name = os.getenv('PGDATABASE')

logging.basicConfig(level=logging.INFO)

json_file_path = os.path.join(os.path.dirname(__file__), 'shortened_classes.json')

async def get_all_profs_async(session, userInput, sem):
    BAD_NAMES = ['HATFIELD L', 'RAHM JR', 'SHELDON M']
    async with sem:
        async with session.post("https://anex.us/grades/getData/", data=userInput) as response:
            if response.status == 200:
                try:
                    # Attempt to decode JSON even if the mimetype is unexpected
                    text = await response.text()
                    data = json.loads(text)  # Manually parse the response body
                    filtered_classes = [class_data for class_data in data["classes"] if int(class_data["year"]) >= 2021]
                    profs = {class_data["prof"] for class_data in filtered_classes if class_data["prof"] not in BAD_NAMES}
                    return list(profs)
                except json.JSONDecodeError as e:
                    logging.error(f"Failed to decode JSON: {e}")
                    return None
            else:
                logging.error(f"API request failed with status code {response.status}")
                return None
    

async def get_prof_data_async(session, userInput, profs):
    prof_data = []
    errors = []

    # Prepare payloads for asynchronous processing
    payloads = []
    professors_full_names = []
    for i, prof in enumerate(profs):
        try:
            professor = get_professor_profiles(prof.split(" ")[0], prof.split(" ")[1][0], userInput["dept"])
            try:
                conn = psycopg2.connect(
                    dbname=db_name,
                    user=db_user,
                    password=db_password,
                    host=db_host,
                    port=db_port
                )
                cur = conn.cursor()
                # Concatenate the department and number to match the course format in the database
                full_course_code = f"{userInput['dept']} {userInput['number']}"
                query = "SELECT EXISTS(SELECT 1 FROM professor_data WHERE professor=%s AND course=%s)"
                # Use the full_course_code in the query instead of just userInput["number"]
                cur.execute(query, (professor[0], full_course_code))
                exists = cur.fetchone()[0]
                if exists:
                    logging.info(f"SKIPPING NAME: Professor {professor[0]} for course {full_course_code} already exists in the database.")
                    continue  # Skip to the next professor
            except Exception as e:
                logging.error(f"Database query failed: {e}")
                continue
            finally:
                cur.close()
                conn.close()
        except IndexError:
            errors.append({
                "prof": prof,
                "class": userInput,
                "error": "List index out of range when getting name. Scrape_dir probably can't handle this name."
            })
            continue
        except Exception as e:
            errors.append({
                "prof": prof,
                "class": userInput,
                "error": f"Error: {e}"
            })
            continue

        if not professor:
            errors.append({"prof": prof, "class": userInput, "error": "Name parsing error"})
            continue

        elif "error" in professor:
            errors.append({
                "prof": prof,
                "class": userInput,
                "error": f"Error: {professor['error']}"
            })
            continue

        professors_full_names.append(professor[0])
        payload = dumps({
            "dept": userInput["dept"],
            "number": userInput["number"],
            "professor": professor[0]
        })
        payloads.append(payload)

    # Call the asynchronous process function
    logging.info(f"Processing {len(payloads)} payloads...")
    processed_data = await handle_multiple_user_inputs(payloads)

    # Process the results
    for data, professor, i in zip(processed_data, professors_full_names, range(len(professors_full_names))):
        schema = {
            "id": i, 
            "prof_name": None,
            "course": None,
            # "sem_one": None,
            # "gpa_one": None,
            # "sem_two": None,
            # "gpa_two": None,
            # "sem_three": None,
            # "gpa_three": None,
            "A_percent": None,
            "B_percent": None,
            "C_percent": None,
            "D_percent": None,
            "F_percent": None,
            "rating": None,
            "difficulty": None,
            "again": None,
            "num_reviews": None,
            "RMP": None
        }
        
        # TODO: Explore why data processing error for Aitor Cruzado Garcia && Richard Malak Jr, ENGR 102
        if data and "Professor" in data: 
            prof_info = data["Professor"]
            schema["prof_name"] = prof_info["Name"]
            schema["course"] = prof_info["Course"]
            schema["RMP"] = "RMP_data" not in prof_info or prof_info["RMP_data"] != "N/A"

            # Fill in GPA, GradesPercentage, and RMP data if available
            if schema["RMP"]:
                schema["rating"] = prof_info.get("Rating")
                schema["difficulty"] = prof_info.get("Difficulty")
                schema["again"] = prof_info.get("Would Take Again")
                schema["num_reviews"] = prof_info.get("Num_Ratings")

            if "GPA" in data:
                semesters = list(data["GPA"].keys())
                for j, sem in enumerate(semesters[:3]):
                    schema[f"sem_{j + 1}"] = sem
                    schema[f"gpa_{j + 1}"] = data["GPA"][sem]

            if "GradesPercentage" in data:
                grades = data["GradesPercentage"]
                schema["A_percent"] = grades.get("A")
                schema["B_percent"] = grades.get("B")
                schema["C_percent"] = grades.get("C")
                schema["D_percent"] = grades.get("D")
                schema["F_percent"] = grades.get("F")
        else:
            error_msg = data.get('error') if isinstance(data, dict) and 'error' in data else "Data processing error"
            errors.append({"prof": professor, "class": userInput, "error": error_msg})

        prof_data.append(schema)

    return prof_data, errors

def insert_professor_data(all_prof_data):
    try:
        conn = psycopg2.connect(
            dbname=db_name,
            user=db_user,
            password=db_password,
            host=db_host,
            port=db_port
        )
        cur = conn.cursor()

        # Assuming 'professor' and 'course' form a unique pair. If not, you'll need to adjust your table schema.
        # Notice the ON CONFLICT clause to avoid inserting duplicate professor-course pairs
        insert_query = """
            INSERT INTO professor_data (
                professor, course, sem1, gpa1, sem2, gpa2, sem3, gpa3, 
                a_percent, b_percent, c_percent, d_percent, f_percent, 
                rmp_rating, difficulty, would_take_again, num_reviews, has_rmp_data
            ) VALUES %s ON CONFLICT (professor, course) DO NOTHING
        """

        records_list_template = []
        for prof in all_prof_data:
            # for prof in class_data:
            record = (
                prof['prof_name'], prof['course'], prof.get('sem_1'), prof.get('gpa_1'),
                prof.get('sem_2'), prof.get('gpa_2'), prof.get('sem_3'), prof.get('gpa_3'),
                prof['A_percent'], prof['B_percent'], prof['C_percent'],
                prof['D_percent'], prof['F_percent'], prof['rating'], 
                prof['difficulty'], prof['again'], prof['num_reviews'],
                prof['RMP']
            )
            records_list_template.append(record)

        psycopg2.extras.execute_values(
            cur, insert_query, records_list_template, template=None, page_size=100
        )

        conn.commit()
        cur.close()
        conn.close()

    except Exception as e:
        logging.exception("Database operation failed")

def calculate_time_remaining(total_classes, classes_processed):
    seconds_per_class = 15
    classes_left = total_classes - classes_processed
    total_seconds = classes_left * seconds_per_class
    hours = total_seconds // 3600
    minutes = (total_seconds % 3600) // 60
    return f"{hours:02d}.{minutes:02d}"

async def update_async():

   async with aiohttp.ClientSession() as session:
        sem = asyncio.Semaphore(10)
        # classes = [{"dept": "CHEM", "number": "107"}, {"dept": "MATH", "number": "221"}]  # Example class list
        classes = []
        with open(json_file_path, 'r') as f:
            classes = json.load(f)
        all_prof_data = []
        total_errors = []

        for fclass in classes:
            print(f"{len(all_prof_data)}/{len(classes)} classes processed || TIME REMAINING: {calculate_time_remaining(len(classes), len(all_prof_data))} HOURS")
            profs = await get_all_profs_async(session, fclass, sem)
            if not profs:
                logging.info(f"No data for {fclass}, skipping...")
                continue

            prof_data, errors = await get_prof_data_async(session, fclass, profs)
            all_prof_data.extend(prof_data)
            total_errors.extend(errors)

        insert_professor_data(all_prof_data)

        # Compile the report
        report = {
            "total_classes": len(classes),
            "total_profs": len(all_prof_data),
            "success_count": len(all_prof_data) - len(total_errors),
            "failure_count": len(total_errors),
            "errors": total_errors
        }
        return report

# last time got to 77/5129 classes
   
def run_async_in_background(loop, coroutine):
    """
    Run a coroutine in the background with the provided event loop.
    """
    asyncio.set_event_loop(loop)
    return loop.run_until_complete(coroutine)

def update():
    # Create a new event loop for running asyncio tasks in the background
    new_loop = asyncio.new_event_loop()
    with ThreadPoolExecutor(max_workers=10) as executor:
        # Schedule the coroutine to be run in the background
        future = executor.submit(run_async_in_background, new_loop, update_async())
        report = future.result()  # Wait for the coroutine to finish and get its result
    return jsonify(report), 200