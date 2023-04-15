// Store our API endpoint as link URL
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_month.geojson"

// Perform a request to the link URL
d3.json(link).then(function (data) {
    // Once we get a response, send the data.features object to the create function.
    createFeatures(data.features);
  });

  function createFeatures(earthquake) {

    // Define a function that we want to run once for each earthquake
    // Create a popup that describes the place, size and depth of earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p><hr><p>Magnitude: ${feature.properties.mag}</p><hr><p>Depth: ${feature.geometry.coordinates[2]}`);
    }
    function createCircleMarker(feature,latlng) {
        let options = {
          radius : feature.properties.mag*2,
          fillColor: chooseColor(feature.geometry.coordinates[2]),
          color: chooseColor(feature.geometry.coordinates[2]),
          opacity: 1,
          fillOpacity: 0.7,
          weight: 1
        }
        return L.circleMarker(latlng,options);
      }
  // Create a GeoJSON layer that contains the features  of each earthquake
    let earthquakes = L.geoJSON(earthquake, {
        onEachFeature: onEachFeature,
        pointToLayer : createCircleMarker
      });
  
      createMap(earthquakes);
  }

  function chooseColor(depth){
    if (depth <= 10) {
      return "#31882A"
    } else if (depth <= 30) {
      return "#DAF7A6"
    } else if (depth <= 50) {
      return "#FFC300"
    } else if (depth <= 70) {
      return "#FF5733"
    } else if (depth <= 90) {
      return "#C70039"
    } else {
      return "#900C3F"
    }
}

let legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    let div = L.DomUtil.create('div', 'info legend');
    let depths = ["-10-10","10-30","30-50","50-70","70-90","90+"];
    let colors = ["color1", "color2", "color3", "color4", "color5", "color6"];
    let labels = [];
    let legendInfo = "<h5>Depth</h5>";

    div.innerHTML = legendInfo

    for (let i = 0; i < depths.length; i++) {
        labels.push("<p><p class='square " + colors[i] +"'></p>&nbsp"+  depths[i] + "&nbsp</p>");
    }  
    div.innerHTML += "<ul>" + labels.join("")+ "</ul>";
    return div;
 };
function createMap(earthquakes) {
  
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let map = L.map("map", {
      center: [30.76, -19.94],     
      zoom: 2.1,
      layers: [street, earthquakes]
    });
  

     // Create a layer control.
  // Pass it our baseMaps and overlayMaps.
  // Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(map);
  legend.addTo(map);
};  





  