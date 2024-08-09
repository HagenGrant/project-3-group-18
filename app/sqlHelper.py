import sqlalchemy
# from sqlalchemy.ext.automap import automap_base
# from sqlalchemy.orm import Session
from sqlalchemy import create_engine, text, func
import datetime

import pandas as pd
import numpy as np

# The Purpose of this Class is to separate out any Database logic
class SQLHelper():
    #################################################
    # Database Setup
    #################################################

    # define properties
    def __init__(self):
        self.engine = create_engine("sqlite:///tornadoes_clean.sqlite")

    #################################################
    # Database Queries
    #################################################

    def get_bar(self, user_seasons):
        # user inputs
       # user_seasons = "All"
        # build the query
        if user_seasons != 'All':
            where_clause = f"seasons LIKE '{user_seasons}'"
        else:
            where_clause = "1 = 1"
        query = f"""
            SELECT
                yr,
                month,
                state,
                category,
                injuries,
                fatalities,
                seasons
            FROM
                tornadoes
            WHERE
                {where_clause}
            ORDER BY
                date DESC;
        """
        # execute query
        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)


    def get_pie(self, user_seasons):

        # user inputs
        user_seasons = "All"
        # build the query
        if user_seasons != 'All':
            where_clause = f"seasons LIKE '{user_seasons}'"
        else:
            where_clause = "1 = 1"
        query = f"""
            SELECT
                yr,
                month,
                state,
                category,
                injuries,
                fatalities,
                seasons
            FROM
                tornadoes
            WHERE
                {where_clause}
            ORDER BY
                date DESC;
        """
        # execute query
        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)


    def get_table(self, user_seasons):

        # user inputs
        user_seasons = "All"
        # build the query
        if user_seasons != 'All':
            where_clause = f"seasons LIKE '{user_seasons}'"
        else:
            where_clause = "1 = 1"
        query = f"""
            SELECT
                yr,
                month,
                state,
                category,
                injuries,
                fatalities,
                seasons
            FROM
                tornadoes
            WHERE
                {where_clause}
            ORDER BY
                date DESC;
        """
        # execute query
        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)


    def get_map(self, year):

        # switch on user_year
        if year != -1:
            where_clause = f"yr = {year}"
        else:
            where_clause = f"yr > 2000"

        # build the query
        query = f"""
            SELECT
                yr,
                state,
                category,
                loss,
                start_lat,
                start_longitude,
                end_latitude,
                end_longitude,
                distance_traveled,
                width
            FROM
                tornadoes
            WHERE
                {where_clause}
            ORDER BY
                date DESC;
        """

        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)
