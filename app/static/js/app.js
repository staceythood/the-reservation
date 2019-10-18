//CODE FOR MAP IN RESERVATION!!!!!!
let locationURL = "static/js/addresses.json";

//Calling function to render map:

renderMap(locationURL);

function renderMap(locationURL) {
  //get request from url
  d3.json(locationURL, function(data) {
    console.log(data);
    //save response to data
    let locationData = data;
    createFeatures(locationData);
  });

  //color condition function:
  // function colors({
  //   if somthing1
  //     return blue,
  //   else if  something2
  //     return red
  // });

  // comment

  //function to make features:
  function createFeatures(locationData) {
    function onEachLayer(feature, layer) {
      console.log(feature);
      return new L.circle([feature.Latitude, feature.Longitude], {
        color: "blue",
        fillOpacity: 1,
        draggable: true,
        radius: 100, //should change it to something less
        pmIgnore: false
      }).addTo(map);
    }
    function onEachLocation(feature, layer) {
      layer.bindPopup(
        "<h3>" +
          //location of data we want to show
          +"</h3><hr><p>" +
          new Date( //its location)
            +//more features to add in the pop up
            (+"</p>")
          )
      );
    }
    //add function for another feature we want on the map:
    // map.pm.toggleGlobalDragMode(
    //   map.on("pm:globaldrawmodetoggled", e => {
    //     console.log(e);
    //     globalDragModeEnabled(true);
    //   })
    // );

    //Make GeoJSON layer with data object
    let corrdLocation = L.geoJSON(locationData, {
      onEachFeature: onEachLocation,
      pointToLayer: onEachLayer
    });

    //Send location markers to createMap function
    // createImageBitmap(corrdLocation);
  }

  //Function to make Map
  function createMap(corrdLocation) {
    //Make map layers:
  }

  //Light Map:
  let lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 19,
    id: "mapbox.light",
    accessToken: API_KEY
  });
  // Satellite layer
  let streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 19,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
  //Other Type of Map layer visualization: ????????

  //Define base layers
  let baseMap = {
    "Light Map": lightmap,
    "Street Map": streets
  };

  //Make overlay overlay object to hold overlay layers
  let overlayMap = {
    "Census Coordinates": corrdLocation
    //Something else.......
  };

  //Create map with it's default settings
  let map = L.map("map", {
    center: [29.760427, -95.369804], //Houston downtown coordinate
    zoom: 10,
    layers: [lightmap, corrdLocation] //add more stuff...
  }).addTo("map");

  //Created layer control & passed in baseMap and overlayMaps
  L.control
    .layer(baseMap, overlayMap, {
      collapsed: false
    })
    .addTo("map");
}
