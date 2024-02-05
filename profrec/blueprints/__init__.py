#!/usr/bin/env python3
from flask import Flask
from .api import apis
from flask_cors import CORS

app = Flask(__name__)
from flask_cors import CORS

CORS(app, resources={r"/api/*": {"origins": "https://prof-rec.vercel.app"}}, supports_credentials=True, allow_headers=["Content-Type", "Authorization", "Access-Control-Allow-Origin"], methods=["GET", "POST", "OPTIONS"])

app.register_blueprint(apis)