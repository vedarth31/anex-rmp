from flask import jsonify
import requests
from json import dumps
from profrec.blueprints.utils.scrape_dir import get_professor_profiles
from profrec.blueprints.utils.prof_info import process
import psycopg2
import ratemyprofessor
import logging

url = "https://anex.us/grades/getData/"

def get_all_profs(userInput):
    response = requests.post(url, data=userInput)
    data = response.json()
    classes = data["classes"]
    filtered_classes = []

    for class_data in classes:
        # determines cutoff point for data
        if int(class_data["year"]) < 2021:
            continue
        
        filtered_classes.append(class_data)

    profs = []

    # gets all professors for a class
    for class_data in filtered_classes:
        prof = class_data["prof"]
        if prof not in profs:
            profs.append(prof)
    
    return profs

def get_prof_data(userInput, profs):
    prof_data = []
    for i, prof in enumerate(profs):
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
        
        # Gets prof full name
        professor = get_professor_profiles(prof.split(" ")[0], prof.split(" ")[1][0], userInput["dept"])

        print(f"Getting {professor}: {i}")

        payload = dumps({
            "dept": userInput["dept"],
            "number": userInput["number"],
            "professor": professor
        })
        data = process(payload)

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

        prof_data.append(schema)
        print(f"Added {professor}: {i}")

    return prof_data

def insert_professor_data(prof_data):
    try:
        # Connect to your postgres DB
        conn = psycopg2.connect("dbname=profdb user=YOURUSERNAME password=YOURPASSWORD")

        # Open a cursor to perform database operations
        cur = conn.cursor()

        # Optional: Clear existing data in the table
        cur.execute("DELETE FROM professor_data")

        # Insert data
        for prof in prof_data:
            cur.execute("""
                INSERT INTO professor_data (
                    professor, course, sem1, gpa1, sem2, gpa2, sem3, gpa3, a_percent, b_percent, c_percent, d_percent, f_percent, rmp_rating, difficulty, would_take_again, num_reviews, has_rmp_data
                ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (
                prof['prof_name'], prof['course'], prof.get('sem_1'), prof.get('gpa_1'),
                prof.get('sem_2'), prof.get('gpa_2'), prof.get('sem_3'), prof.get('gpa_3'),
                prof['A_percent'], prof['B_percent'], prof['C_percent'],
                prof['D_percent'], prof['F_percent'], prof['rating'], 
                prof['difficulty'], prof['again'], prof['num_reviews'],
                prof['RMP']
            ))

        # Commit changes
        conn.commit()

        # Close communication with the database
        cur.close()
        conn.close()

    except Exception as e:
        print("Database operation failed: ", e)


def update():
    userInput = {"dept": "MATH", "number": "221"}
    profs = get_all_profs(userInput)

    prof_data = get_prof_data(userInput, profs)
    insert_professor_data(prof_data)
    return jsonify("Success!"), 200