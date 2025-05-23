/**
 * Fetches hourly wind speed and direction for a given location using Open-Meteo Marine Weather API.
 * This version pulls forecast data for today.
 *
 * @param {number} lat - Latitude of the location
 * @param {number} lon - Longitude of the location
 * @return {Array} An array of hourly forecast objects: [{ time, windSpeed, windDirection }]
 */

function fetchWindForecast(lat, lon) {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  
    // Construct the Open-Meteo API URL
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=wind_speed_10m,wind_direction_10m&start_date=${today}&end_date=${today}&timezone=auto`;
  
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
  
    const times = data.hourly.time;
    const speeds = data.hourly.wind_speed_10m;
    const directions = data.hourly.wind_direction_10m;
  
    const results = [];
  
    for (let i = 0; i < times.length; i++) {
        results.push({
            time: times[i],
            windSpeed: speeds[i],
            windDirection: directions[i]
      });
    }
  
    return results;
}
  
/**
 * Test function: fetches wind forecast for Saint-Malo and logs it.
 */
function testFetchWindForecast() {
    const lat = 48.6525;
    const lon = -2.0253;
  
    const forecast = fetchWindForecast(lat, lon);
    Logger.log(forecast);
}



/**
 * Fetches hourly swell data (height, direction, and period) for a given location
 * using Open-Meteo's Marine Weather API.
 *
 * @param {number} lat - Latitude of the location
 * @param {number} lon - Longitude of the location
 * @return {Array} - Array of hourly swell objects: [{ time, swellHeight, swellDirection, swellPeriod }]
 */
function fetchSwellForecast(lat, lon) {
    const today = new Date().toISOString().split("T")[0];
  
    // Add wave_period to the hourly query
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,wave_direction,wave_period&start_date=${today}&end_date=${today}&timezone=auto`;
  
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
  
    const times = data.hourly.time;
    const heights = data.hourly.wave_height;
    const directions = data.hourly.wave_direction;
    const periods = data.hourly.wave_period;
  
    const results = [];
  
    for (let i = 0; i < times.length; i++) {
        results.push({
            time: times[i],
            swellHeight: heights[i],
            swellDirection: directions[i],
            swellPeriod: periods[i] // in seconds
        });
    }
  
    return results;
}
  
/**ap
 * Test function: fetches and logs swell data (with period) for Saint-Malo
 */
function testFetchSwellForecast() {
    const lat = 48.6525;
    const lon = -2.0253;
  
    const forecast = fetchSwellForecast(lat, lon);
    Logger.log(forecast);
}
  


/**
 * Merges wind and swell forecast data for a given location
 *
 * @param {number} lat - Latitude of the location
 * @param {number} lon - Longitude of the location
 * @return {Array} - Array of merged wind and swell forecast objects
 */
function mergeWindAndSwellForecast(lat, lon) {
    const windData = fetchWindForecast(lat, lon);
    const swellData = fetchSwellForecast(lat, lon);
  
    const merged = [];
  
    for (let i = 0; i < windData.length; i++) {
      merged.push({
        time: windData[i].time,
        windSpeed: windData[i].windSpeed,
        windDirection: windData[i].windDirection,
        swellHeight: swellData[i].swellHeight,
        swellDirection: swellData[i].swellDirection,
        swellPeriod: swellData[i].swellPeriod,
  
        // placeholder for future tide integration
        tideLevel: 1.9,
        tideDirection: "rising"
      });
    }
  
    return merged;
  }
  