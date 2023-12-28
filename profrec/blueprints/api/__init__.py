from flask import Blueprint, jsonify, request
# import ratemyprofessor
from profrec.blueprints.utils.anex_soup import process

apis = Blueprint('api', __name__, url_prefix='/api')

@apis.route('/version', methods = ['GET'])
def version():
    return jsonify(version = '0.0.2')

@apis.route('/health', methods = ['GET'])
def health():
    return jsonify(status = 'ok')
    
@apis.route('/anex', methods = ['POST'])
def get_grades():
    response = process(request.data)
    return jsonify(response)    