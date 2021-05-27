from flask import request
from backend.app import app, db
from backend.models import TestModel


@app.route("/model", methods=["GET", "POST"])
def example():
    if request.method == "POST":
        if request.is_json:
            data = request.get_json()
            new_model = TestModel(data)

            db.session.add(new_model)
            db.session.commit()

            return {"message": f"Created {new_model.name} with id {new_model.id}"}
        else:
            return {"message": "Invalid json!"}, 400
    elif request.method == "GET":
        models = TestModel.query.all()

        return {"items": models}
