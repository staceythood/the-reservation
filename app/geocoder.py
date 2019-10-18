import pandas as pd
from bisect import bisect_left
import re
from pathlib import Path


class Geocoder:
    """Uses a sequence of geocoded anchor points to estimate latitude and longitude of addresses without coordinates"""

    def __init__(self, coded_in=str):
        """ geo_in is a string or path object pointing to the geocoded csv or json OR a DataFrame"""

        # Shut up Pandas, you aren't the boss of me
        pd.set_option("mode.chained_assignment", None)

        if type(coded_in) == pd.core.frame.DataFrame:
            self.geo = coded_in
        elif Path(coded_in).suffix == ".csv":
            self.geo = pd.read_csv(str(Path(coded_in)))
        elif Path(coded_in).suffix == ".json":
            self.geo = pd.read_json(str(Path(coded_in)))
        else:
            try:
                raise TypeError(
                    f"{Path(coded_in).suffix} not a valid input file type. Use .json or .csv instead"
                )
            except TypeError:
                raise

    def __repr__(self):
        """Returns DataFrame of input data"""
        return repr(self.geo)

    def find_closest(self, inp_add, stdout=False):
        """Takes in an address and returns dict with inp address and a coordinates tuple"""
        # split input address to get number and street name
        in_add_split = inp_add.split(" ", 2)

        bool_ix = self.geo["StreetAddress"].str.contains(
            in_add_split[1], flags=re.IGNORECASE, regex=True
        )

        add_geo = self.geo[bool_ix]
        # if add_geo is empty, the street does NOT exist in the reference data
        if len(add_geo) == 0:
            return (0, 0)

        add_geo["StreetAddress"] = (
            add_geo["StreetAddress"].str.split(" ", n=2, expand=True)[0].astype("int32")
        )
        add_geo.sort_values(by="StreetAddress", inplace=True)
        add_geo.reset_index(inplace=True)

        # if inp_add.to_upper() in add_geo["StreetAddress"].values():
        #     return
        add_geo_list = add_geo["StreetAddress"].to_list()

        # Binary search for nearest neighbors in add_geo_list
        pos = bisect_left(add_geo_list, int(in_add_split[0]))
        # These 2 shouldn't come into play but just in case
        # If value == first item
        if pos == 0:
            return (add_geo.iloc[0, 1], add_geo.iloc[0, 2])

        # if value == last item
        if pos == len(add_geo_list):
            return (add_geo.iloc[-1, 1], add_geo.iloc[-1, 2])

        # previous nn
        before = add_geo_list[pos - 1]

        # following nn
        after = add_geo_list[pos]

        # check for sort issues and return tuple with address
        if after - int(in_add_split[0]) < int(in_add_split[0]) - before:
            add = (int(in_add_split[0]), after, before)

            loc = (add_geo.iloc[pos, 1:3], add_geo.iloc[pos - 1, 1:3])
            output = self.dist_bet(add, loc)
            if stdout is True:
                print(output)
            return output
        else:
            add = (int(in_add_split[0]), before, after)
            loc = (add_geo.iloc[pos - 1, 1:3], add_geo.iloc[pos, 1:3])
            output = self.dist_bet(add, loc)
            if stdout is True:
                print(output)
            return output

    def dist_bet(self, inp_tup, coord_tup):
        # Find ratio between addresses
        tot = inp_tup[2] - inp_tup[1]
        top = (inp_tup[2] - inp_tup[0]) / tot

        coords = []

        # Apply ratio to nn lat/lon and return guesstimated coordinates
        for i in range(2):
            loc_tot = coord_tup[1][i] - coord_tup[0][i]
            x = coord_tup[1][i] - (top * loc_tot)
            coords.append(x)
        return tuple(coords)
