# Dependencies and Setup
import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, inspect,desc
from config import postgres_pswd


# Connect to DB
# engine = create_engine(f"postgresql+psycopg2://postgres:{postgres_pswd}@localhost/Reservation")
engine = create_engine(f"postgresql+psycopg2://postgres:{postgres_pswd}@18.222.106.38/Reservation")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)


# Census information
census_info = [ {"Year": 1900, "File": "Reservation Census charting_1900.csv"},
                {"Year": 1910, "File": "Reservation Census charting_1910.csv"},
                {"Year": 1920, "File": "Reservation Census charting_1920.csv"}
              ]

# Data files path
files_path = "../the-reservation/Reservation_Data/"


# Address File
address_data = files_path + "coded.json"

# Read Data Files and store into Pandas Data Frames
address_df = pd.read_json(address_data)

census_df = pd.DataFrame()

for i in range(len(census_info)):
    #  census Files
    census_data = files_path + census_info[i]["File"]
    # Read Data File into Pandas Data Frame
    upload_df = pd.read_csv(census_data, dtype=str)
    # add the year for census data
    upload_df["Year"] = census_info[i]["Year"]
    # concatenate with existing
    census_df = pd.concat([census_df,upload_df], sort=False)


# census information. Create new column with same format for address as lat/long data
census_addr_df = pd.DataFrame()
census_addr_df["Street Address"] = census_df['House No'] + " " + census_df['Street Name'].str.upper()

# Add Status columns. All addresses in this file are considered locked (not calculated)
address_df["Status"] = "S"

# Merge address and census data 
cens_add_df = pd.merge(census_addr_df, address_df, how = "left", on="Street Address")

# Find those addresses in census that do NOT exist in lat/long
miss_addr_df = cens_add_df[cens_add_df.Latitude.isnull()].drop_duplicates()
miss_addr_df["Latitude"] = 0
miss_addr_df["Longitude"] = 0
miss_addr_df["Status"] = "C"

# Add those extra addresses to original Address data
address_df = pd.concat([address_df, miss_addr_df], sort=False)

# Reset the index so it will be used as AddressId
address_df = address_df.reset_index(drop=True)
address_df = address_df.reset_index()

# Make a copy of the original data in the same column order as the table. Rename columns
# to have the exact same names as the table
address_f_df = address_df.loc[:,["index", "Street Address", "Latitude", "Longitude","Status"]]. \
     rename(columns={"index": "AddressId", "Street Address": "StreetAddress"})


# Merge address and census data once again
cens_add_df = pd.merge(census_addr_df, address_f_df, how="left", left_on="Street Address", right_on="StreetAddress")

# this time we will assign the AddressIds back in census data
census_df["AddressId"] = cens_add_df["AddressId"]

# Make a copy of the original data in the same column order as the table. Rename columns
# to have the exact same names as the table
census_f_df = census_df.loc[:,["AddressId", "Year", "LastName", "GivenName", "Relation (4)", "Color or Race (5)", 
                               "Sex (6)", "Age at last birthday (8)", "Occupation (19)", "Own or Rent (25)",
                               "Owned free or mortgage (26)", "House or Farm (27)", "My Notes", "File Name",
                               "Line #"]]. \
    rename(columns={"Relation (4)": "Relation", "Color or Race (5)": "Race", "Sex (6)": "Gender",
                    "Age at last birthday (8)": "Age", "Occupation (19)": "Occupation", "Own or Rent (25)": "OwnRent",
                    "Owned free or mortgage (26)": "PropStat", "House or Farm (27)": "HouseType", "My Notes": "Notes", 
                    "File Name": "SrcFileName", "Line #": "LineItem"})


# Save addresses to table
address_f_df.to_sql("Address_Data",engine,if_exists="append", index=False)

# Save census data to table
census_f_df.to_sql("Census_Data",engine,if_exists="append", index=False)