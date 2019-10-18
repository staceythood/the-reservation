d3.json("/api/locations", function(data) {
  console.log(data);
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
    iconSize: [30, 30]
  });
  var redIcon = L.icon({
    iconUrl: "../static/images/red.png",
    iconSize: [30, 30]
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
    console.log(d.Latitude);
    var marker = L.marker([d.Longitude, d.Latitude], {
      icon: colors(d),
      radius: 5,
      draggable: true
    }).addTo(map);

    // function addToTextBox(lt, ln) {
    //   document.getElementById("lat").innerHTML = lt;
    //   document.getElementById("lng").innerHTML = ln;
    // }
    // marker.on("dragend", function(event) {
    //   //alert('drag ended');
    //   var marker = event.target;
    //   var location = marker.getLatLng();
    //   var lat = location.lat;
    //   var lon = location.lng;
    //   addToTextBox(lat, lon);
    //   //alert(lat);
    //   //retrieved the position
    // });
    // Binding a pop-up to our marker
    marker.bindPopup(String(d.Longitude) + String(d.Latitude));
  });
});
