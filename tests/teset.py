import ratemyprofessor

# def test_get_schools_by_name():
#     # Test case for get_schools_by_name function
#     school_name = "Texas A&M University"
    
#     # Get the list of schools
#     schools = ratemyprofessor.get_schools_by_name(school_name)
    
#     if schools:
#         print(f"Schools found for '{school_name}':")
#         for school in schools:
#             print(f"- {school.name}")
#     else:
#         print(f"No schools found for '{school_name}'")
        
def test_get_professor_by_school_and_name():
    # Test case for get_professor_by_school_and_name function
    school_name = "Texas A&M University"
    professor_name = "Daniel Jimenez"
    
    # Get the school first
    school = ratemyprofessor.get_school_by_name(school_name)
    
    if school:
        # Get the professor
        professor = ratemyprofessor.get_professor_by_school_and_name(school, professor_name)
        
        if professor:
            print(f"Professor found: {professor.name} at {school.name}")
            print(professor.school.name)
            response_data = {
                "rating": professor.rating,
                "difficulty": professor.difficulty,
                "num_ratings": professor.num_ratings,
                "would_take_again": round(professor.would_take_again, 1) if professor.would_take_again is not None else None
            }
            print(response_data)
        else:
            print(f"No professor found with name '{professor_name}' at {school.name}")
    else:
        print(f"No school found with name '{school_name}'")


# if __name__ == "__main__":
#     test_get_professor_by_school_and_name()

def get_professor_info(user_input):
    # data = request.get_json()
    # print(f"{data}")
    # prof_name = user_input
    prof_name = "Amy Austin"
    # school = ratemyprofessor.get_school_by_name("Texas A&M University")
    # if school:
    #     # Get the professor
    #     professor = ratemyprofessor.get_professor_by_school_and_name(school, prof_name)
    #     if professor:
    #         response_data = {
    #             "rating": professor.rating,
    #             "difficulty": professor.difficulty,
    #             "num_ratings": professor.num_ratings,
    #             "would_take_again": round(professor.would_take_again, 1) if professor.would_take_again is not None else None
    #         }
    #         return response_data

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
            return {"error": "Invalid school"}
    else:
        return {"error": "Professor not found"}

# test_get_professor_by_school_and_name()
# print(get_professor_info("Daniel Jimenez"))

def test_get_professors_by_school_and_name():
    # Test case for get_professors_by_school_and_name function
    school_name = "Your School Name"
    professor_name = "Daniel Jimenez"
    
    # You may want to use an actual school ID here or modify the function to return a school object
    school_id = "123456"  # Replace with an actual school ID or adjust your function
    
    # Get the list of professors
    professors = ratemyprofessor.get_professors_by_school_and_name(school_id, professor_name)
    
    if professors:
        print(f"Professors found for '{professor_name}' at school '{school_name}':")
        for professor in professors:
            print(f"- {professor.name}")
    else:
        print(f"No professors found for '{professor_name}' at school '{school_name}'")

if __name__ == "__main__":
    test_get_professors_by_school_and_name()
