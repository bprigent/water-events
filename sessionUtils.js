/**
 * this function is used to geocode a location query to get the latitude and longitude.
 */
function geocodeLocation(query) {
    const apiKey = "278c413020714d8295c6ecea475230e6"; 
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(query)}&key=${apiKey}&limit=1`;
  
    const response = UrlFetchApp.fetch(url);
    const json = JSON.parse(response.getContentText());
  
    if (json.results.length === 0) {
        throw new Error("Location not found");
    }
  
    const loc = json.results[0].geometry;
    return { lat: loc.lat, lon: loc.lng };
}