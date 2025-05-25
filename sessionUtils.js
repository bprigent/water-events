/**
 * this function is used to geocode a location query to get the latitude and longitude.
 */
function geocodeLocation(query) {
    const apiKey = "278c413020714d8295c6ecea475230e6";  // link to find is www.opencagedata.com/dashboard#geocoding
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}&limit=1`;
  
    const response = UrlFetchApp.fetch(url);
    const json = JSON.parse(response.getContentText());
  
    if (json.results.length === 0) {
        throw new Error("Location not found");
    }
  
    const loc = json.results[0].geometry;
    return { lat: loc.lat, lon: loc.lng };
}


/**
 * get an image of the map with a marker at the given latitude and longitude.
 */
function buildMapImageUrl(lat, lon) {
    const apiKey = "YOUR_GOOGLE_MAPS_API_KEY";
    const center = `${lat},${lon}`;
    const zoom = 13;
    const size = "400x300";
    const marker = `color:red|label:S|${lat},${lon}`;
    const maptype = "roadmap";
  
    return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${size}&maptype=${maptype}&markers=${marker}&key=${apiKey}`;
}