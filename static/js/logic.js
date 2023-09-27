/// Create a Leaflet map centered on a specific location and zoom level
var map = L.map('map').setView([0, 0], 2);

// Add a base layer (e.g., OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var satelliteLayer = L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
}).addTo(map);

var earthquakeURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create an empty layer group for earthquake markers
var earthquakeLayer = L.layerGroup();

// Fetch earthquake data and add it to the earthquakeLayer
$.getJSON(earthquakeURL, function(data) {
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            // Customize the marker size and color based on magnitude and depth
            var magnitude = feature.properties.mag;
            var depth = feature.geometry.coordinates[2]; 
            var markerSize = magnitude * 5; 

            return L.circleMarker(latlng, {
                radius: markerSize,
                fillColor: getColor(depth), 
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function (feature, layer) {
            // Create a popup with earthquake information
            layer.bindPopup("Magnitude: " + feature.properties.mag +
                            "<br>Depth: " + feature.geometry.coordinates[2] +
                            " km<br>Location: " + feature.properties.place);
        }
    }).addTo(earthquakeLayer);
});

// Add the earthquakeLayer to the map
earthquakeLayer.addTo(map);

// Create a layer control and add it to the map
var baseLayers = {
    "Base Layer": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
};

var overlayMaps = {
    "Earthquakes": earthquakeLayer
};

L.control.layers(baseLayers, overlayMaps).addTo(map);

// Define a function to set marker color based on depth
function getColor(depth) {
    if (depth < 50) {
        return "#ff0000"; // Red for shallow earthquakes
    } else if (depth < 100) {
        return "#ffff00"; // Yellow for moderate-depth earthquakes
    } else {
        return "#00ff00"; // Green for deep earthquakes
    }
}

// Add a legend to the map
var legend = L.control({ position: 'bottomright' });

legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var depthRanges = [0, 50, 100]; // Depth ranges for legend
    var labels = ['&lt; 50 km', '50 km - 100 km', '&ge; 100 km']; // Labels for legend

    div.innerHTML = '<h4>Earthquake Depth</h4>';

    for (var i = 0; i < depthRanges.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depthRanges[i] + 1) + '"></i> ' +
            labels[i] + '<br>';
    }

    return div;
};

legend.addTo(map);


legend.addTo(map);
