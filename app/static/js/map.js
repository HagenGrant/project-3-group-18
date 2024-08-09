function createMap(data, geo_data) {



  // STEP 1: Init the Base Layers

  // Tile Layers
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });



  // Step 2: Overlay Layers

  // Marker Clusters and Heat Array
  let markers = L.markerClusterGroup();
  let heatArray = [];
  // Loop through data
  for (let i = 0; i < data.length; i++){
    let row = data[i];
    // Save Lat & Long
    let latitude = row.end_latitude;
    let longitude = row.end_longitude;
    // Save coordinate points
    let point = [latitude, longitude];
    // Make markers out of points
    let marker = L.marker(point);
    // Create popup
    let popup = `<h1>Category: ${row.category}</h1><hr><h3>Damage: $${row.loss}</h3>`;
    // Bind popups
    marker.bindPopup(popup);
    // Add makers to layer group
    markers.addLayer(marker);
    // Add to heatmap
    heatArray.push(point);
  }
  // Create heat layer
  let heatLayer = L.heatLayer(heatArray, {
    radius: 10,
    blur: 1
  });
  // Create geo layer
  let geo_layer = L.geoJSON(geo_data, {
    style: function (feature) {
        return {
            fillColor: 'white',
            color: 'black',
            weight: 2,
            opacity: .5,
            fillOpacity: .1
        };
    }
});



  // Step 3: Layer Controls

  // Street & Topography base layers
  let baseLayers = {
    Street: street,
    Topography: topo
  };
  // Additional overlays
  let overlayLayers = {
    Markers: markers,
    Heatmap: heatLayer,
    GeoLayer: geo_layer
  }



  // Step 4: Initialize the map

  // Destroy the old map
  d3.select("#map-container").html("");
  // Select map container from html
  d3.select("#map-container").html("<div id='map'></div>");
  // Default map settings
  let myMap = L.map("map", {
    center: [38, -96],
    zoom: 5,
    layers: [street, markers]
  });



  // Step 5: Add the Layer Control filter as needed
  L.control.layers(baseLayers, overlayLayers).addTo(myMap);

}



// API request function
function do_work() {
  // Extract user input
  let year = d3.select("#year_filter").property("value");
  year = parseInt(year);
  // We need to make a request to the APIs
  let url = `/api/map/${year}`;
  let url2 = "https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json";
  // Nested request
  d3.json(url).then(function (data) {
    d3.json(url2).then(function (geo_data) {
      createMap(data, geo_data);
    });
  });
}



// Event listener for CLICK on Button
d3.select("#filter").on("click", do_work);
do_work();
