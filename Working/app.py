import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

from config import username, password

app = Flask(__name__)


#################################################
# Database Setup
#################################################

# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db/bellybutton.sqlite"
app.config["SQLALCHEMY_DATABASE_URI"] = f'mysql://{username}:{password}@localhost/Shot_Data_db'
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)
# print(Base.classes.keys())

# Save references to each table
# Samples_Metadata = Base.classes.sample_metadata
# Samples = Base.classes.samples
Sample_Metadata = Base.classes.master_shot



@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/names")
def names():
    """Return a list of sample names."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(Sample_Metadata).statement
    df = pd.read_sql_query(stmt, db.session.bind)

    # Return a list of the column names (sample names)
    return jsonify(list(df.columns))


@app.route("/metadata/<Player_Name>")
def sample_metadata(Player_Name):
    """Return the MetaData for a given sample."""
    sel = [
        Sample_Metadata.Player_Name,
        Sample_Metadata.Loc_X,
        Sample_Metadata.Loc_Y,
        Sample_Metadata.Game_Date
    ]

    results = db.session.query(*sel).filter(Sample_Metadata.Player_Name == Player_Name).all()
    print(results)
    # Create a dictionary entry for each row of metadata information
    sample_metadata = []
    for result in results:
        single_metadata = {"Player_Name" : result[0],
        "Loc_X" : result[1],
        "Loc_Y" : result[2],
        "Game_Date" : result[3]}

        # sample_metadata["Player_Name"] = result[0]
        # sample_metadata["Loc_X"] = result[1]
        # sample_metadata["Loc_Y"] = result[2]
        # sample_metadata["Game_Date"] = result[3]
        sample_metadata.append(single_metadata)

    print(sample_metadata)
    return jsonify(sample_metadata)


@app.route("/samples/<sample>")
def samples(sample):
    """Return `otu_ids`, `otu_labels`,and `sample_values`."""
    stmt = db.session.query(Sample_Metadata).statement #QUERY Samples TABLE
    df = pd.read_sql_query(stmt, db.session.bind)

    # Filter the data based on the sample number and
    # only keep rows with values above 1
    # sample_data = df.loc[df[sample] > 1, ["otu_id", "otu_label", sample]]
    # Format the data to send as json
    data = {
        "Loc_X": df[Loc_X].values.tolist(),
        "Loc_Y": df[Loc_Y].values.tolist(),
        "Game_Date": df[Game_Date].tolist(),
    }
    return jsonify(data)


if __name__ == "__main__":
    app.run(debug=True)
