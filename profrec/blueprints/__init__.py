#!/usr/bin/env python3
from flask import Flask
from profrec.blueprints.api import apis

app = Flask(__name__)
app.register_blueprint(apis)