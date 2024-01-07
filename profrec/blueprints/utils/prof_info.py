import requests
from json import loads
import ratemyprofessor

url = "https://anex.us/grades/getData/"

def changeProfName(old_name):
    try:
        name_list = old_name.split()
        new_name = name_list[1] + " " + name_list[0][0]
        return new_name.upper()
    except: 
        return False
    
def parseData(data, prof_input):
    name = changeProfName(prof_input)
    
    if(not name):
        return {}
    
    parsed_data = {}
    for class_info in data['classes']:
        prof = class_info['prof']
        if(prof == name):
            
            sem = f"{class_info['semester']} {class_info['year']}"
            if(sem not in parsed_data):
                parsed_data[sem] = []
            
            total = int(class_info['A']) + int(class_info['B']) + int(class_info['C']) + int(class_info['D']) + int(class_info['F']) + int(class_info['Q']) 
            parsed_data[sem].append({"GPA": round(float(class_info['gpa']), 2),
                                     "As": int(class_info['A']),
                                     "Bs": int(class_info['B']),
                                     "Cs": int(class_info['C']),
                                     "Ds": int(class_info['D']),
                                     "Fs": int(class_info['F']),
                                     "total": total})
    
    return parsed_data


def calculate_average_gpa(data, semester):
    
    sections = data[semester]

    total_students = sum(section["As"] + section["Bs"] + section["Cs"] + section["Ds"] + section["Fs"] for section in sections)
    weighted_sum = sum(section["GPA"] * (section["As"] + section["Bs"] + section["Cs"] + section["Ds"] + section["Fs"]) for section in sections)

    return round(weighted_sum/total_students, 2)


def percent_letter_grades(data, semester):
    
    sections = data[semester]
    total_students = sum(section["As"] + section["Bs"] + section["Cs"] + section["Ds"] + section["Fs"] for section in sections)
    total_as = sum(section["As"] for section in sections)
    total_bs = sum(section["Bs"] for section in sections)
    total_cs = sum(section["Cs"] for section in sections)
    total_ds = sum(section["Ds"] for section in sections)
    total_fs = sum(section["Fs"] for section in sections)
    
    grades = [total_as, total_bs, total_cs, total_ds, total_fs]
    
    return [round(grade/total_students * 100, 2) for grade in grades]

def get_professor_info(user_input):

    prof_name = user_input['professor']

    professor = ratemyprofessor.get_professor_by_school_and_name(
        ratemyprofessor.get_school_by_name("Texas A&M University"), prof_name)

    if professor is not None:
        if (professor.school.name == "Texas A&M University" or professor.school.name == "Texas A&M University at College Station"):
            response_data = {
                "rating": professor.rating,
                "difficulty": professor.difficulty,
                "num_ratings": professor.num_ratings,
                "would_take_again": round(professor.would_take_again, 1) if professor.would_take_again is not None else None
            }
            return response_data
        else:
            print("Could not find professor")
            return False
    else:
        return {"error": "Professor not found"}

def outputData(data, userInput):
    
    parsed_data = parseData(data, userInput['professor'])
    
    if(not bool(parsed_data)):
        return parsed_data
    
    recent_sems = dict(list(parsed_data.items())[-3:])
    
    gpa_output = []
    letter_percent = []
    for sem in recent_sems:
        gpa = calculate_average_gpa(recent_sems, sem)
        gpa_output.append(f"{gpa}")
        letter_percent.append(percent_letter_grades(recent_sems,sem))
    
    combined_lists = zip(*letter_percent)
    averages = [round(sum(values)/len(values), 2) for values in combined_lists]

    output_dict = {
        "Professor": {},
        "GradesPercentage": {},
        "GPA": {}
    }
    output_dict["Professor"]["Course"] = f"{userInput['dept']} {userInput['number']}"
    output_dict["Professor"]["Name"] = userInput['professor']
    
    i = 0
    for sem in recent_sems:
        output_dict["GPA"][f"{sem}"] = gpa_output[i]
        i+=1
        
    letter = "A"
    for i in range(4):
        output_dict["GradesPercentage"][letter] = f"{averages[i]}"
        letter = chr(ord(letter) + 1)  
    output_dict["GradesPercentage"]["F"] = f"{averages[4]}"
    
    
    prof_info = get_professor_info(userInput)
    
    print(f"results: {prof_info}")
    
    if(not prof_info):
        print("N/A")
        output_dict["Professor"]["RMP_data"] = "N/A"
        return output_dict
    
    output_dict["Professor"]["Rating"] = prof_info["rating"]
    output_dict["Professor"]["Num_Ratings"] = prof_info["num_ratings"]
    output_dict["Professor"]["Difficulty"] = prof_info["difficulty"]
    output_dict["Professor"]["Would Take Again"] = prof_info["would_take_again"]
    
    return output_dict



def process(inputString):
    # Important - converts stringified Json to actual Json object
    userInput = loads(inputString)
    try:
        response = requests.post(url, data=userInput)
        subjectGrades = response.json()
        
        if response.status_code == 200:
            return outputData(subjectGrades, userInput)
        else:
            print(f"Failed to retrieve data. Status code: {response.reason}")

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
    except:
        return {}