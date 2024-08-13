// Custom named function
function chooseColor(category) {
  console.log(category)
    // colors
    if (category === 0) {
      color = "orange";
    } else if (category === 1) {
      color = "black";
    } else if (category === 2) {
      color = "blue";
    } else if (category === 3) {
      color = "red";
    } else if (category === 4) {
      color = "purple";
    } else if (category === 5) {
      color = "yellow";
    } else {
      color = "black";
    }
     // return color
  return (color);
}


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
  let circleArray = [];
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
    let popup2 = `<h1>Distance Traveled: ${row.distance_traveled}mi</h1><h3>Width: ${row.width}yds</h3>`
    // Bind popups
    marker.bindPopup(popup);
    // Add makers to layer group
    markers.addLayer(marker);
    // Add to heatmap
    heatArray.push(point);
    // Create circles
    let circleMarker = L.circle(point, {
      fillOpacity: 5,
      color: chooseColor(row.category),
      fillColor: chooseColor(row.category),
      radius: row.width * 10
    }).bindPopup(popup2);
    circleArray.push(circleMarker);
    
  }
  // Create heat layer
  let heatLayer = L.heatLayer(heatArray, {
    gradient: {0.3: 'red'},
    radius: 25,
    blur: 5
  });
  // Circle layer
  let circleLayer = L.layerGroup(circleArray);
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
    GeoLayer: geo_layer,
    CircleLayer: circleLayer
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

  // Step 6: Legend
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");
    let legendInfo = "<h4>Circle Layer Legend</h4></br>"
    legendInfo += "<i style='background: #FFA500'></i>Category 0<br></br>";
    legendInfo += "<i style='background: #000000'></i>Category 1<br></br>";
    legendInfo += "<i style='background: #0000FF'></i>Category 2<br></br>";
    legendInfo += "<i style='background: #FF0000'></i>Category 3<br></br>";
    legendInfo += "<i style='background: #800080'></i>Category 4<br></br>";
    legendInfo += "<i style='background: #008000'></i>Category 5<br></br>";
    div.innerHTML = legendInfo;
    return div;
  };
// Adding the legend to the map
legend.addTo(myMap);


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
