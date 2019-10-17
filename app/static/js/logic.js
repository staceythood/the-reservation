d3.json("static/js/addresses.json", function(data) {
  console.log(data);
  // Create our initial map object
  // Set the longitude, latitude, and the starting zoom level
  var myMap = L.map("map", {
    center: [29.760427, -95.369804],
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
  }).addTo(myMap);

  // Create a new marker
  // Pass in some initial options, and then add it to the map using the addTo method
  data.forEach(d => {
    console.log(d.Latitude);
    var marker = L.marker([d.Longitude, d.Latitude], {
      //   radius: 5,
      draggable: true
    }).addTo(myMap);

    function addToTextBox(lt, ln) {
      document.getElementById("lat").innerHTML = lt;
      document.getElementById("lng").innerHTML = ln;
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
