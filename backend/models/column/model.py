from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship

from backend.app import db


class Column(db.Model):
    __tablename__ = "columns"

    id = db.Column(db.Integer(), primary_key=True)
    title = db.Column(db.String(250))
    color = db.Column(db.String(7))
    order = db.Column(db.Integer())
    user_id = db.Column(db.Integer(), ForeignKey("users.id"))
    cards = relationship("Card")

    def __init__(self, json: dict):
        if "title" in json and "color" in json and "order" in json and "userId" in json:
            self.title = json["title"]
            self.color = json["color"]
            self.order = json["order"]
            self.user_id = json["userId"]
        else:
            raise TypeError("Incorrect initial data in Column model")

    def __repr__(self):
        return f"<Column {self.id}>"

    def json(self):
        return {"id": self.id, "title": self.title, "color": self.color, "order": self.order, "userId": self.user_id}
