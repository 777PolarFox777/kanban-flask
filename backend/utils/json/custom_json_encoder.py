from flask.json import JSONEncoder


class CustomJsonEncoder(JSONEncoder):
    def default(self, o):
        try:
            return o.json()
        except TypeError:
            pass

        return JSONEncoder.default(self, o)
