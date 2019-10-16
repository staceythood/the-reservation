import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from geocoder import Geocoder


#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Database Setup
#################################################
engine = create_engine(
    f"postgresql+psycopg2://postgres:Welcome1@18.222.106.38/Reservation"
)

# app.config[
#     "SQLALCHEMY_DATABASE_URI"
# ] = "postgresql+psycopg2://postgres:Welcome1@18.222.106.38/Reservation"
# engine = create_engine(f"postgresql+psycopg2://postgres:olive314@localhost/Reservation")
# db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
address_data = Base.classes.Address_Data
census_data = Base.classes.Census_Data

# import models

#################################################
# Flask Routes
#################################################

# Route to render index.html template using data from db
@app.route("/")
def index():
    """Return the homepage."""
    return render_template("indexm.html")


@app.route("/api/locations")
def locations():
    """Return location data to be used in interactive leaflet map"""

    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Use Pandas to perform the sql query
    locations = session.query(address_data).all()

    # Create the locations dataframe with all data, including both statuses
    loc_df = pd.read_sql_table("Address_Data", con=engine)
    print(loc_df.head())
    # Create a locations dataframe with only status of c(calculated) aka those without lat/long
    calc_loc_df = loc_df[loc_df.Latitude == 0]
    # calc_loc_df.to_json(orient="index")

    # Call the geocoder class
    geo = Geocoder(calc_loc_df)
    # # Retrieve data from DB
    # select_st = 'select a."StreetAddress", a."Latitude", a."Longitude", a."AddressId", a."Status" \
    #             from "Address_Data" a'
    # address_data = pd.read_sql_query(select_st, con=engine)
    # # Retrieve rows without lat long
    # req_loc = address_data[address_data.Latitude == 0]

    # Calculate lat/long using reference data
    calc_loc_df["lat_lon"] = calc_loc_df[["StreetAddress"]].applymap(geo.find_closest)
    # Update lat/long with the calculated values
    calc_loc_df["Latitude"] = calc_loc_df["lat_lon"].apply(lambda x: x[0])
    calc_loc_df["Longitude"] = calc_loc_df["lat_lon"].apply(lambda x: x[1])
    # Drop the additional column
    calc_loc_df = calc_loc_df.drop(columns=["lat_lon"])
    # Include indices for the "merge"
    loc_df = loc_df.reset_index()
    calc_loc_df = calc_loc_df.reset_index()
    loc_df = pd.concat([loc_df, calc_loc_df], sort=False).drop_duplicates(
        ["index"], keep="last"
    )
    # clean the final df
    loc_df = loc_df.drop(columns=["index"]).reset_index(drop=True)

    # Return a JSON list of all locations including those with both statuses
    return jsonify(loc_df)


# @app.route("/savelocation", methods=["GET", "POST"])
# def send_to_db():
#     if method == "POST":
#         addressid = request.form["addressid"]
#         lat = request.form["latitude"]
#         lng = request.form["longitude"]

#         address = address(addressid=addressid, lat=latitude, lng=longitude)
#         db.session.add(address)
#         db.session.commit()

#     return render_template("form.html")


# @app.route("/api/census_data")
# def census_data():

#     census_data = db.session.query(census_data).statement
#     cen_df = pd.read_sql_query(census_data, db.session.bind)
#     combined_df = loc_df.set_index("addressid").join(cen_df.set_index("addressid"))

#     return jsonify(combined_df)


# def filter(filter_array):
#     """Return the data for the selected filters."""
#     filters = ""
#     for i in len(filter_array):
#        filters = filters" and " + filter_array[i].column + "= " + filter_array[i].value
#     selection =
#         combined_df.addressid,
#         combined_df.streetAddress,
#         combined_df.latitude,
#         combined_df.longitude,
#         combined_df.status,
#         combined_df.year,
#         combined_df.lastname,
#         combined_df.givenname,
#         combined_df.relation,
#         combined_df.race,
#         combined_df.gender,
#         combined_df.age,
#         combined_df.occupation,
#         combined_df.ownrent,
#         combined_df.propstat,
#         combined_df.housetype,
#         combined_df.notes,
#         combined_df.srcilename,
#         combined_df.lineitem,


#     census_data = pd.read_sql_query(select_st, con=engine)
#     return(census_data.jsonify())
# #    for i in len(filter_array):
# #        filter_st = filter_st" and " + filter_array[i].column + "= " + filter_array[i].value
# # # Retrieve data from DB
# # select_st = 'select c."Year",c."LastName", c."GivenName", c."Relation", c."Race", c."Gender", \
# #                    c."Occupation", a."StreetAddress", a."Latitude", a."Longitude", a."AddressId" \
# #               from "Census_Data" c, "Address_Data" a \
# #            where c."AddressId" = a."AddressId"' + filter_st
# #


#     results = db.session.query(*sel).filter(combined_df.addressid == addressid).all()


if __name__ == "__main__":
    app.run()

