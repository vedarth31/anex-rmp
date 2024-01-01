from flask import Blueprint, jsonify, request
# import ratemyprofessor
from profrec.blueprints.utils.prof_info import process

apis = Blueprint('api', __name__, url_prefix='/api')
    
@apis.route('/course_and_prof_info', methods = ['POST'])
def get_grades():
    
    try: 
        # print(request.data)
        response = process(request.data)
        # print(response)
        return jsonify(response)

    except Exception as e:
        print(f"Error processing request: {str(e)}")
        return jsonify({"success": False, "message": "Error processing request"}), 400