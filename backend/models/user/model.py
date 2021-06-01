from sqlalchemy.orm import relationship

from backend.app import db


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(250))
    email = db.Column(db.String(50))
    password = db.Column(db.String(50))
    columns = relationship("Column")

    def __init__(self, json: dict):
        if "name" in json and "email" in json and "password" in json:
            self.name = json["name"]
            self.email = json["email"]
            self.password = json["email"]
        else:
            raise TypeError("Incorrect initial data in User model")

    def __repr__(self):
        return f"<User {self.id}>"

    def json(self):
        return {"id": self.id, "name": self.name, "email": self.email, "password": self.password}
