from flask import request
from werkzeug import exceptions

from backend.app import app, db
from backend.models import Column


@app.route("/column/list", methods=["GET"])
def column_list():
    user_id = request.cookies.get("userId")
    columns = Column.query.filter_by(user_id=user_id).order_by(Column.order.asc()).all()

    return {"data": columns}


@app.route("/column/<int:column_id>", methods=["GET"])
def column_get(column_id):
    column = Column.query.get_or_404(column_id, description=f"Unable to find Column with id={column_id}")

    return {"data": column}


@app.route("/column/<int:column_id>", methods=["PUT"])
def column_update(column_id):
    if request.is_json:
        data = request.get_json()
        affected_rows = Column.query.filter_by(id=column_id).update(data)

        if affected_rows == 0:
            return {"error": {"message": f"Unable to find Column with id {column_id}"}}, exceptions.NotFound.code

        db.session.commit()

        return {"message": f"Updated Column with id {column_id}"}
    else:
        return {"error": {"message": "Invalid json!"}}, exceptions.BadRequest.code


@app.route("/column", methods=["POST"])
def column_create():
    try:
        if request.is_json:
            data = request.get_json()

            if "id" in data:
                return {"error": {"message": "Request body should not contain id field!"}}, exceptions.BadRequest.code

            column = Column(data)

            db.session.add(column)
            db.session.commit()

            return {"message": f"Created Column with id {column.id}", "data": column}
        else:
            return {"error": {"message": "Invalid json!"}}, exceptions.BadRequest.code
    except Exception as e:
        return {"error": {"message": str(e)}}, exceptions.InternalServerError.code


@app.route("/column/<int:column_id>", methods=["DELETE"])
def column_delete(column_id):
    try:
        column = Column.query.get_or_404(column_id, description=f"Unable to find Column with id={column_id}")
        db.session.delete(column)
        db.session.commit()

        return {"message": f"Successfully deleted Column with id {column_id}"}
    except exceptions.NotFound as e:
        return {"error": {"message": str(e)}}, exceptions.NotFound.code
    except Exception as e:
        return {"error": {"message": str(e)}}, exceptions.InternalServerError.code
