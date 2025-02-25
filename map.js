mapboxgl.accessToken = 'pk.eyJ1IjoibWlzc29nbyIsImEiOiJjbHd3Y3Q3dmwxMWw2MmpvbG01cjRrcW0zIn0.fqNaN_WrIyvLdbSuR6yJfw'; // Replace with your token

const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [103.8198, 1.3521],
    zoom: 12
});

// Function to fetch GeoJSON directly from the API
async function fetchGeoJSON(url) {
    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch GeoJSON data');
        return await response.json();
    } catch (e) {
        console.error("Error fetching dataset:", e);
        return null;
    }
}

map.on('load', async function () {
    // Replace these URLs with your actual GeoJSON API endpoints
    const electoralBoundaryURL = "http://127.0.0.1:5000/fetch-data?type=electoral"; 
    const lampPostURL = "http://127.0.0.1:5000/fetch-data?type=lamp-posts"; 

    // Fetch and add electoral boundary data
    const electoralData = await fetchGeoJSON(electoralBoundaryURL);
    if (electoralData) {
        map.addSource('electoral-boundary', { type: 'geojson', data: electoralData });

        map.addLayer({
            id: 'electoral-boundary-layer',
            type: 'line',
            source: 'electoral-boundary',
            paint: { 'line-color': '#ff0000', 'line-width': 2 }
        });
    }

    // Fetch and add lamp post data
    const lampPostData = await fetchGeoJSON(lampPostURL);
    if (lampPostData) {
        map.addSource('lamp-posts', { type: 'geojson', data: lampPostData });

        map.addLayer({
            id: 'lamp-posts-layer',
            type: 'circle',
            source: 'lamp-posts',
            paint: { 'circle-radius': 4, 'circle-color': '#007cbf' }
        });
    }
});
