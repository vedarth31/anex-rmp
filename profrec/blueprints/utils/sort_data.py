from  get_data_db import get_course_info

user_input = {
    "dept": "MATH",
    "number": "152",
    "professor": ""
}

def sort_rating(user_input):
    '''sorts rating highest to lowest'''
    data = get_course_info(user_input)
    return list(sorted(data, key= lambda x: x['Professor']['Rating'], reverse=True))

def sort_difficulty(user_input):
    '''sorts difficulty lowest to highest'''
    data = get_course_info(user_input)
    return list(sorted(data, key= lambda x: x['Professor']['Difficulty']))

def sort_gpa(user_input):

    data = get_course_info(user_input)
    # for item in data:
    #     item['AverageGPA'] = sum(item['GPA'].values()) / len(item['GPA'])
    # return sorted(data, key=lambda x: x['AverageGPA'], reverse=True)
    return sorted(data, key=lambda x: sum(x['GPA'].values()) / len(x['GPA']), reverse=True)
    
print(sort_gpa(user_input))