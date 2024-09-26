from flask import Flask, render_template, make_response, send_from_directory

app = Flask(__name__)


@app.route("/")
def about():
    return render_template("index.html")


@app.route("/static/<path:filename>")
def serve_from_static(filename):
    response = make_response(send_from_directory("static", filename))
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    return response
