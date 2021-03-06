from flask import request
from iteration_utilities import flatten
from werkzeug import exceptions
import humps

from backend.app import app, db
from backend.models import Card, Column


@app.route("/card/list", methods=["GET"])
def card_list():
    user_id = request.cookies.get("userId")

    if user_id is None:
        return {"error": {"message": "Unable to find user cookie!"}}, exceptions.BadRequest.code

    columns = Column.query.filter_by(user_id=user_id).order_by(Column.order.asc()).all()
    cards = list(flatten(
        [Card.query.filter_by(column_id=column.id).order_by(Card.order.asc()).all() for column in columns]
    ))

    return {"data": cards}


@app.route("/card/<int:card_id>", methods=["GET"])
def card_get(card_id):
    card = Card.query.get_or_404(card_id, description=f"Unable to find Card with id={card_id}")

    return {"data": card}


@app.route("/card/<int:card_id>", methods=["PUT"])
def card_update(card_id):
    if request.is_json:
        data = request.get_json()
        affected_rows = Card.query.filter_by(id=card_id).update(humps.decamelize(data))

        if affected_rows == 0:
            return {"error": {"message": f"Unable to find Card with id {card_id}"}}, exceptions.NotFound.code

        db.session.commit()

        return {"message": f"Updated Card with id {card_id}"}
    else:
        return {"error": {"message": "Invalid json!"}}, exceptions.BadRequest.code


@app.route("/card", methods=["POST"])
def card_create():
    try:
        if request.is_json:
            data = request.get_json()

            if "id" in data:
                return {"error": {"message": "Request body should not contain id field!"}}, exceptions.BadRequest.code

            card = Card(data)

            db.session.add(card)
            db.session.commit()

            return {"message": f"Created Card with id {card.id}", "data": card}
        else:
            return {"error": {"message": "Invalid json!"}}, exceptions.BadRequest.code
    except Exception as e:
        return {"error": {"message": str(e)}}


@app.route("/card/<int:card_id>", methods=["DELETE"])
def card_delete(card_id):
    try:
        card = Card.query.get_or_404(card_id, description=f"Unable to find Card with id={card_id}")
        db.session.delete(card)
        db.session.commit()

        return {"message": f"Successfully deleted Card with id {card_id}"}
    except exceptions.NotFound as e:
        return {"error": {"message": str(e)}}, exceptions.NotFound.code
    except Exception as e:
        return {"error": {"message": str(e)}}, exceptions.InternalServerError.code
