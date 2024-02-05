#!/usr/bin/env python3
from flask import Flask
from .api import apis
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "https://prof-rec.vercel.app"}})
app.register_blueprint(apis)