from flask import Flask, jsonify, render_template
import pandas as pd
import numpy as np
from sqlHelper import SQLHelper
import os

#################################################
# Flask Setup
#################################################

os.chdir(os.path.dirname(os.path.realpath(__file__)))
app = Flask(__name__)
sql = SQLHelper()

#################################################
# Flask Routes
#################################################

# HTML ROUTES
@app.route("/")
def index():
    return render_template("home.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/map")
def map():
    return render_template("map.html")

@app.route("/about_us")
def about_us():
    return render_template("about_us.html")

# SQL Queries
@app.route("/api/v1.0/get_dashboard/<user_seasons>")
def get_dashboard(user_seasons):

    bar_data = sql.get_bar(user_seasons)
    pie_data = sql.get_pie(user_seasons)
    table_data = sql.get_table(user_seasons)

    data = {
        "bar_data": bar_data,
        "pie_data": pie_data,
        "table_data": table_data,
    }
    return(jsonify(data))

@app.route("/api/map/<year>")
def get_map(year):
    year = int(year) # cast to int
    map_data = sql.get_map(year)

    return(jsonify(map_data))



# Run the App
if __name__ == '__main__':
    app.run(debug=True)
