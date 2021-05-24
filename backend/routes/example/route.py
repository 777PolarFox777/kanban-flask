from backend.app import app


@app.route("/<req_id>", methods=["GET"])
def example(req_id):
    if req_id == "id":
        return {"status": 200, "message": "You are on a good way!"}
    else:
        return {"status": 400, "message": "You are on a bad way!"}, 400
