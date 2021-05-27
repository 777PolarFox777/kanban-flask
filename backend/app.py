import os
import flask
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
