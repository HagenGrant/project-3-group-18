# Imports
import sqlalchemy
from sqlalchemy import create_engine, text, func
import datetime

import pandas as pd
import numpy as np

# The Purpose of this Class is to separate out any Database logic
class SQLHelper():

    # Database Setup
    # Define Properties
    def __init__(self):
        self.engine = create_engine("sqlite:///tornadoes_clean.sqlite")

    ##################
    # Database Queries
    ##################

    # Bar Graph Query
    def get_bar(self, user_seasons):

        # User Input
        if user_seasons != 'All':
            where_clause = f"seasons LIKE '{user_seasons}'"
        else:
            where_clause = "1 = 1"

        # Query
        query = f"""
            SELECT
                yr,
                category,
                injuries,
                fatalities
            FROM
                tornadoes
            WHERE
                {where_clause}
            ORDER BY
                category ASC;
        """

        # Convert data into dictionary
        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)

    # Pie Graph Query
    def get_pie(self, user_seasons):

        # User Input
        if user_seasons != 'All':
            where_clause = f"seasons LIKE '{user_seasons}'"
        else:
            where_clause = "1 = 1"

        # Query
        query = f"""
            SELECT
                loss,
                category
            FROM
                tornadoes
            WHERE
                {where_clause};
        """

        # Convert data into dictionary
        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)

    # Data Table Query
    def get_table(self, user_seasons):

        # User Input
        if user_seasons != 'All':
            where_clause = f"seasons LIKE '{user_seasons}'"
        else:
            where_clause = "1 = 1"

        # Query
        query = f"""
            SELECT
                yr,
                seasons,
                state,
                category,
                injuries,
                fatalities,
                loss
            FROM
                tornadoes
            WHERE
                {where_clause}
            ORDER BY
                category DESC;
        """

        # Convert data into dictionary
        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)

    # Map Query
    def get_map(self, year):
        
        # User Input
        if year != -1:
            where_clause = f"yr = {year}"
        else:
            where_clause = f"yr > 2000"

        # Query
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
                {where_clause};
        """

        # Convert data into dictionary
        df = pd.read_sql(text(query), con = self.engine)
        data = df.to_dict(orient="records")
        return(data)