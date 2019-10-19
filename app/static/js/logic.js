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

    // Here we create a legend control object.
    var legend = L.control({
      position: "bottomright"
    });

    // Then we add all the details for our legend
    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");

      var grades = ["Seeded", "Calculated", "Locked"];
      var colors = ["#2A7FFF", "#FF0000", "#44AA00"];

      // Loop through our intervals and generate a label with a colored square for each interval.
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + grades[i] + "<br>";
      }
      return div;
    };

    // We add our legend to the map.
    legend.addTo(map);

    //Make Icons for map with color conditions:
    var greenIcon = L.icon({
      iconUrl: "../static/images/green.png",
      iconSize: [20, 20]
    });
    var redIcon = L.icon({
      iconUrl: "../static/images/red.png",
      iconSize: [20, 20]
    });
    var blueIcon = L.icon({
      iconUrl: "../static/images/blue.png",
      iconSize: [20, 20]
    });
    function colors(d) {
      if (d.Status == "L") {
        return greenIcon;
      } else if (d.Status == "S") {
        return blueIcon;
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
      }
      marker.on("dragend", function(event) {
        //alert('drag ended');
        var marker = event.target;
        var location = marker.getLatLng();
        var lat = location.lat;
        var lon = location.lng;
        addToTextBox(lat, lon);
      });
      // Binding a pop-up to our marker
      marker.bindPopup(String(d.Longitude) + String(d.Latitude));
    });
  });
}

function onSave() {
  //send new coords to sql:
  let saved = document.getElementsByClassName("coords");

  let i;
  var coords = [];
  for (i = 0; i < saved.length; i++) {
    coords.push({
      AddressId: saved[i].getAttribute("AddressId"),
      StreetAddress: saved[i].getAttribute("StreetAddress"),
      Latitude: saved[i].getAttribute("Latitude"),
      Longitude: saved[i].getAttribute("Longitude"),
      Status: "L"
    });
  }

  console.log(coords);
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/savelocation", false);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      console.log(this.responseText);
    } else {
      alert("Location Save Failed");
    }
  };
  xhr.send(JSON.stringify({ savedCoords: coords }));
}
