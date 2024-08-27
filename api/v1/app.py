#!/usr/bin/python3

from api.v1 import app


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)
