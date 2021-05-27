from backend.app import app


@app.route("/", methods=["GET"])
def index():
    return "<h1>Distant Reading Archive</h1>" \
           "<p>This site is a prototype API for distant reading of science fiction " \
           "novels.</p> "
