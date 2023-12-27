from flask import Blueprint, jsonify, request
import ratemyprofessor
from profrec.blueprints.utils.anex_soup import process

apis = Blueprint('api', __name__, url_prefix='/api')

@apis.route('/version', methods = ['GET'])
def version():
    return jsonify(version = '0.0.1')

@apis.route('/health', methods = ['GET'])
def health():
    return jsonify(status = 'ok')

@apis.route('/get_professor_info', methods=['POST'])
def get_professor_info():
    data = request.get_json()
    # prof_name = data.get('prof_name')
    prof_name = "Amy Austin"

    professor = ratemyprofessor.get_professor_by_school_and_name(
        ratemyprofessor.get_school_by_name("Texas A&M University"), prof_name)

    if professor is not None:
        if (professor.school.name == "Texas A&M University" or professor.school.name == "Texas A&M University at College Station"):
            response_data = {
                "name": professor.name,
                "department": professor.department,
                "school": professor.school.name,
                "rating": professor.rating,
                "difficulty": professor.difficulty,
                "num_ratings": professor.num_ratings,
                "would_take_again": round(professor.would_take_again, 1) if professor.would_take_again is not None else None
            }
            return jsonify(response_data)
        else:
            return jsonify({"error": "Invalid school"})
    else:
        return jsonify({"error": "Professor not found"})
    
@apis.route('/anex', methods = ['POST'])
def get_grades():
    response = process(request.data)
    return jsonify(response)
    # return response
    