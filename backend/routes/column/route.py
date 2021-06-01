from flask import request

from backend.app import app
from backend.models import Column


@app.route("/api/column/list", methods=["GET"])
def column_list():
    user_id = request.cookies.get("userId")
    columns = Column.query.filter_by(user_id=user_id).order_by(Column.order.asc()).all()

    return {"data": columns}


@app.route("/api/column/<int:column_id>", methods=["GET"])
def column_get(column_id):
    column = Column.query.get_or_404(column_id, description=f"Unable to find the Column with id={column_id}")

    return {"data": column}

