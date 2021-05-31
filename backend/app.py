import os
import flask
from flask import send_from_directory
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from backend.utils import CustomJsonEncoder

app = flask.Flask(__name__)

app.json_encoder = CustomJsonEncoder

app.config["DEBUG"] = os.environ.get("DEBUG")
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_URL")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db)


# noinspection PyBroadException
@app.route("/<path:filename>")
def fallback(filename):
    public_dir = os.path.abspath("../frontend/dist/")
    try:
        return send_from_directory(public_dir, path=filename)
    except Exception:
        return send_from_directory(public_dir, path="index.html")
