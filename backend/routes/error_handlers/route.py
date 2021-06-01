from werkzeug import exceptions
from backend.app import app


@app.errorhandler(exceptions.NotFound)
def not_found_handler(e):
    return {"error": {"code": e.code, "name": e.name, "message": e.description}}, exceptions.NotFound.code
