from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from backend.app import db


class Card(db.Model):
    __tablename__ = "cards"

    id = db.Column(db.Integer(), primary_key=True)
    text = db.Column(db.String(500))
    order = db.Column(db.Integer())
    column_id = db.Column(db.Integer(), ForeignKey("columns.id"))

    def __init__(self, json: dict):
        if "text" in json and "order" in json and "columnId" in json:
            self.text = json["text"]
            self.order = json["order"]
            self.column_id = json["columnId"]
        else:
            raise TypeError("Incorrect initial data in Card model")

    def __repr__(self):
        return f"<Card {self.id}>"

    def json(self):
        return {"id": self.id, "text": self.text, "order": self.order, "columnId": self.column_id}
