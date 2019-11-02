# the-reservation

<summary>Table of Contents</summary>

- [Overview](#overview)
- [Motivation](#goals)
- [The Code](#the-data)
- [References](#references)

</details>

# Overview

The Reservation
Exploring Houston's Red-Light District, 1908-1917

Where Allen Parkway Village now stands – south of Buffalo Bayou and west of downtown Houston – was once the city's legally designated red-light district.  The reservation was established on March 31, 1908, and became the home to "fallen women" and business and emancipated slaves. Freedmantown surroundings conditions weren't very desirable due to its close proximity to two cemetaries, an infectious disease hospital and the flooding prone Buffalo Bayou.


<!-- While working on the data, we continued to investigate the the story of the Reservation. In spite of the poorly gathered census data of the area, we were able to make a few cursory conclusions back by the data of the time. We found that the red-light district helped what was described as "a few huts" develop into a thriving community. The data showed that the population on the Reservation was growing faster than the neighboring City of Houston. The Reservation started to decline after the red-light district was shut down due to pressure from a nearby army base to remove the distraction. -->

# Goals

This project is a collaboration with the Rice Humanities Department and Professor Brian Riedel et al.
<br>

In this extension of the project, our goal was to create a map of the reservation with addresses and demographic data from the 1900, 1910, and 1920 censuses.  The gathered census data was uploaded into a PostgreSQL database for data querying and manipulation. The database has two tables.  The first table includes Address Data such as Address ID, Street Address, Latitude, Longitude, and a column indicating the status of the street address.  This status column indicates 'S' for those addresses already confirmed by Professor Riedel.  Those with a status of 'C' indicate the latitude and longitude need to be calculated for those street addresses.  The second table includes Census Data such as name, relation, race, gender, etc. 

Our application calculates the latitude and longitude of each address with a status of 'C' based on the number of the street address and the latitude/longitude of the already confirmed addresses.  

The data from the database was projected onto a map to see the residential areas of the Red-Light district of Houston. The map allows one to call individual streets to look at the street address and census data one point at a time.  On this filtered view, those addresses that are marked as 'C' can be clicked and dragged to the correct latitude and longitude once confirmed by the Rice Humanities Department.  Once the new latitude and longitude is submitted on the website, the database will be updated with the correct lat/long and the status changed to 'L' for locked.  

</p>
                            


 <!-- We helped clean and organize the data as well as provide a platform upon which further advancements could be made. We established a server with a functioning API that will allow future endeavors to pull the data in a computer friendly format. To further that goal, we've established a method for mounting that data on a number of popular online map generation libraries. In the future we hope to provide a website where interested Houstonians can learn more about an intriguing part of their city's history. -->


# The Data

A sample entry of an API response:

```
{
    "AddressId":3
    "Street Address":"834 Arthur St",
    "Latitude":-95.37708413,"Longitude":29.75856158,
    "Status":"S"
}
```

<!-- # Tech

[![Generic badge](https://img.shields.io/badge/Dependencies-8-blue.svg)](https://github.com/Wired361/Digital-Humanities/network/dependencies) -->

# References

[The Reservation](https://arcgis.com/apps/Cascade/index.html?appid=2262a3c6c67e4f1ebd2261ca8f82a267)