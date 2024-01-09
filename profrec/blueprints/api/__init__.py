from flask import Blueprint, jsonify, request
# import ratemyprofessor
from ..utils.prof_info import process
from ..utils.update_db import update
from ..utils.get_data_db import check_data
import logging

apis = Blueprint('api', __name__, url_prefix='/api')
logging.basicConfig(level=logging.INFO)
    
@apis.route('/course_and_prof_info', methods = ['POST'])
def get_grades():
    try: 
        # print(request.data)
        response = process(request.data)
        # print(response)
        return jsonify(response)
    except Exception as e:
        logging.error(f"Error processing request: {str(e)}")
        return jsonify({"success": False, "message": "Error processing request"}), 400
    
@apis.route('/get_course_info', methods=['POST'])
def get_info():
    try: 
        # print(request.data)
        return jsonify(check_data(request.data))
    except Exception as e:
        logging.error(f"Error processing request: {str(e)}")
        return jsonify({"success": False, "message": "Error processing request"}), 400

@apis.route('/update-db', methods = ['GET'])
def test():
    try:
        return update()
    except Exception as e:
        logging.error(f"Error in /update-db: {e}")
        raise

@apis.route('/test', methods=['GET'])
def trial():
    return 'Test endpoint reached', 200