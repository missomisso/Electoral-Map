const express = require("express");
const axios = require("axios");
const { DOMParser } = require("xmldom");
const toGeoJSON = require("togeojson");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

// Function to fetch and convert KML to GeoJSON
async function fetchAndConvert(datasetId) {
    try {
        // Step 1: Get the actual file URL from API
        const apiUrl = `https://api-open.data.gov.sg/v1/public/api/datasets/${datasetId}/poll-download`;
        const response = await axios.get(apiUrl);
        
        if (response.data.code !== 0) throw new Error(response.data.errMsg);
        const fetchUrl = response.data.data.url;

        // Step 2: Download KML file
        const fileResponse = await axios.get(fetchUrl);
        const kmlData = fileResponse.data;

        // Step 3: Convert KML to GeoJSON
        const kmlDom = new DOMParser().parseFromString(kmlData);
        const geojson = toGeoJSON.kml(kmlDom);

        return geojson;
    } catch (error) {
        console.error("Error fetching or converting data:", error);
        return null;
    }
}

// API Route to fetch and serve GeoJSON
app.get("/fetch-data", async (req, res) => {
    const datasetId = req.query.dataset_id;
    if (!datasetId) return res.status(400).json({ error: "Missing dataset_id parameter" });

    const geojsonData = await fetchAndConvert(datasetId);
    if (!geojsonData) return res.status(500).json({ error: "Failed to fetch or convert data" });

    res.json(geojsonData);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://127.0.0.1:${PORT}`);
});
