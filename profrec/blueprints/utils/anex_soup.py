import requests
from json import loads

url = "https://anex.us/grades/getData/"

def changeProfName(old_name):
    name_list = old_name.split()
    new_name = name_list[1] + " " + name_list[0][0]
    return new_name.upper()
    
def parseData(data, prof_input):
    # name = changeProfName(prof_input)
    name = prof_input
    # print(json_response)
    parsed_data = {}
    for class_info in data['classes']:
        prof = class_info['prof']
        # if(class_info['semester'] == '20s23'):
        # print(prof, name)
        if(prof == name):
            
            sem = f"{class_info['semester']} {class_info['year']}"
            if(sem not in parsed_data):
                parsed_data[sem] = []
            
            total = int(class_info['A']) + int(class_info['B']) + int(class_info['C']) + int(class_info['D']) + int(class_info['F']) + int(class_info['Q']) 
            parsed_data[sem].append({"GPA": round(float(class_info['gpa']), 2), "As": int(class_info['A']), "Bs": int(class_info['B']), "Cs": int(class_info['C']), "Ds": int(class_info['D']), "Fs": int(class_info['F']), "total": total})
    
    return parsed_data


def calculate_average_gpa(data, semester):
    
    sections = data[semester]

    # if not sections:
    #     print(f"No data available for {semester}")
    #     return None

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
    
    # percents = []
    # for grade in grades:
    #     percents.append(round(grade/total_students * 100, 2))
        
    #high caste way of code i wrote above
    return [round(grade/total_students * 100, 2) for grade in grades]


def outputData(data, prof_input):
    
    parsed_data = parseData(data, prof_input)
    # ------------ MAIN ISSUE - NEED TO FIX IF PROF HAS ONLY TAUGHT < 3 SECTIONS (shouldnt be too hard) --------------------
    # FOR NOW, MANUALLY CHANGE -3 to -2 (IF PROF HAS TAUGHT 2 SECTIONS) or -1.
    recent_sems = dict(list(parsed_data.items())[-3:])
    # print(recent_sems)
    
    gpa_output = []
    letter_percent = []
    for sem in recent_sems:
        
        gpa = calculate_average_gpa(recent_sems, sem)
        gpa_output.append(f"{gpa} ({sem})")
        letter_percent.append(percent_letter_grades(recent_sems,sem))
        # a.append(percent_letter_grades(recent_sems, sem))
    
    combined_lists = zip(*letter_percent)
    averages = [round(sum(values)/len(values), 2) for values in combined_lists]
    # print(averages)
    # print(sum(averages))
    
    # print(f"In recent semesters, Dr. {prof_input} had average GPAs of: {', '.join(gpa_output)}. In these semesters: ")
    # letter = "A"
    # for i in range(4):
    #     print(f"{averages[i]}% of students recieved a {letter}")
    #     letter = chr(ord(letter) + 1)  
    # print(f"{averages[4]}% of students recieved a F")
    output_dict = {}
    
    output_dict["prof"] = prof_input
    for i in range(len(gpa_output)):
        output_dict[f"GPA{i+1}"] = gpa_output[i]
    letter = "A"
    for i in range(4):
        output_dict[letter] = f"{averages[i]}"
        letter = chr(ord(letter) + 1)  
    output_dict["F"] = f"{averages[4]}"

    # print(output_dict)
    
    # output_dict_json = json.dumps(output_dict)
    
    # print(output_dict_json)
    # return output_dict
    
    return output_dict
    # return {'a': 'n'}
    # return output_dict_json

def process(input):
    # Important - converts stringified Json to actual Json object
    data = loads(input)
    print(f"Inside process {data}")
    try:
        response = requests.post(url, data=data)
        
        if response.status_code == 200:
            json_response = response.json()
            return outputData(json_response, data['professor'])
        else:
            print(f"Failed to retrieve data. Status code: {response.reason}")

    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")