function doSomething() {
  d3.select("#map").remove();
  d3.select("#mapContainer")
    .append("div")
    .attr("id", "map");

  endpoint = document.getElementById("street_dropdown").value;
  d3.json("/filter/" + endpoint, function(data) {
    // Create our initial map object
    // Set the longitude, latitude, and the starting zoom level
    var map = L.map("map", {
      center: [29.758205, -95.3773107],
      zoom: 16
    });

    // Add a tile layer (the background map image) to our map
    // We use the addTo method to add objects to our map
    L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: "mapbox.streets",
      accessToken: API_KEY
    }).addTo(map);

    //Make Icons for map with color conditions:
    var greenIcon = L.icon({
      iconUrl: "../static/images/green.png",
      iconSize: [25, 25]
    });
    var redIcon = L.icon({
      iconUrl: "../static/images/red.png",
      iconSize: [25, 25]
    });
    function colors(d) {
      if (d.Status === "L") {
        return greenIcon;
      } else {
        return redIcon;
      }
    }

    // Create markers
    // Pass in some initial options, and then add it to the map using the addTo method
    data.forEach(d => {
      var marker = L.marker([d.Longitude, d.Latitude], {
        icon: colors(d),
        radius: 5,
        draggable: true
      }).addTo(map);
      //Adds the "new text"/ location onto the ID
      function addToTextBox(lt, ln) {
        d3.select("#coords")
          .append("p")
          .attr("class", "d-none coords")
          .attr("AddressId", d.AddressId)
          .attr("Latitude", lt)
          .attr("Longitude", ln)
          .attr("StreetAddress", d.StreetAddress);

        // d3.select("#ID-" + d.AddressId).text(lt + " ," + ln);
      }
      marker.on("dragend", function(event) {
        //alert('drag ended');
        var marker = event.target;
        var location = marker.getLatLng();
        var lat = location.lat;
        var lon = location.lng;
        addToTextBox(lat, lon);
        //alert(lat);
        //retrieved the position
      });
      // Binding a pop-up to our marker
      marker.bindPopup(String(d.Longitude) + String(d.Latitude));
    });
  });
}

function onSave() {
  d3.json("/", {
    method: "POST",
    body: JSON.stringify({
      title: "Hello",
      body: "_d3-fetch_ is it",
      userId: 1,
      friends: [2, 3, 4]
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8"
    }
  }).then(json => {
    svg
      .append("text")
      .text(JSON.stringify(json))
      .attr("y", 200)
      .attr("x", 120)
      .attr("font-size", 16)
      .attr("font-family", "monospace");
  });
  //send new coords to sql:
  let saved = document.getElementsByClassName("coords");

  let i;
  let coords = [];
  for (i = 0; i < saved.length; i++) {
    coords.push({
      AddressId: saved[i].getAttribute("AddressId"),
      StreetAddress: saved[i].getAttribute("StreetAddress"),
      Latitude: saved[i].getAttribute("Latitude"),
      Longitude: saved[i].getAttribute("Longitude"),
      Status: "L"
    });
    coords[saved[i].getAttribute("add-id")] = [saved[i].getAttribute("lat"), saved[i].getAttribute("lon")];
  }
  // let newThing = thing.getAttribute("lat");
  console.log(coords);
}
