const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

// Define the GeoJSON API URLs (Replace these with real URLs)
const electoralBoundaryAPI = "https://drive.google.com/uc?export=download&id=16jhnKrkorDWHsUcdgZ5Gb1MjeK6WOpq3";

// Function to fetch GeoJSON data directly
const geojsonURL = "https://drive.google.com/uc?export=download&id=16jhnKrkorDWHsUcdgZ5Gb1MjeK6WOpq3";

async function fetchGeoJSON() {
    try {
        const response = await fetch(geojsonURL);
        if (!response.ok) throw new Error("Failed to fetch GeoJSON data");

        return await response.json();
    } catch (e) {
        console.error("Error fetching GeoJSON:", e);
        return null;
    }
}

map.on('load', async function () {
    const geojsonData = await fetchGeoJSON();
    if (geojsonData) {
        map.addSource('geojson-layer', { type: 'geojson', data: geojsonData });

        map.addLayer({
            id: 'geojson-layer',
            type: 'line',
            source: 'geojson-layer',
            paint: { 'line-color': '#ff0000', 'line-width': 2 }
        });
    }
});


// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
