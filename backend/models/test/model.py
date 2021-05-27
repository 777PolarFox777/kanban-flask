from backend.app import db


class TestModel(db.Model):
    __tablename__ = "model"

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String())
    age = db.Column(db.Integer())

    def __init__(self, json: dict):
        if "name" in json and "age" in json:
            self.name = json["name"]
            self.age = json["age"]

    def __repr__(self):
        return f"<Test {self.name}>"

    def json(self):
        return {"id": self.id, "name": self.name, "age": self.age}
