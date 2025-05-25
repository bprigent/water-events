/**
 * Fetches hourly wind speed and direction for a given location using Open-Meteo Marine Weather API.
 * This version pulls forecast data for today.
 */

function fetchWindForecast(lat, lon) {
    const today = new Date().toISOString().split("T")[0];
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=wind_speed_10m,wind_direction_10m&start_date=${today}&end_date=${today}&timezone=Europe/Paris`;

    try {
        const response = UrlFetchApp.fetch(url);
        const data = JSON.parse(response.getContentText());

        if (!data.hourly || !data.hourly.time) throw new Error("Invalid wind data structure");

        const times = data.hourly.time;
        const speeds = data.hourly.wind_speed_10m;
        const directions = data.hourly.wind_direction_10m;

        return times.map((time, i) => ({
            time,
            windSpeed: speeds[i],
            windDirection: directions[i],
        }));
    } catch (err) {
        Logger.log("❌ Wind fetch error: " + err.message);
        return [];
    }
  }


/**
 * Fetches hourly swell data (height, direction, and period) for a given location
 * using Open-Meteo's Marine Weather API.
 */
function fetchSwellForecast(lat, lon) {
    const today = new Date().toISOString().split("T")[0];
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,wave_direction,wave_period&start_date=${today}&end_date=${today}&timezone=Europe/Paris`;
  
    try {
        const response = UrlFetchApp.fetch(url);
        const data = JSON.parse(response.getContentText());
    
        if (!data.hourly || !data.hourly.time) throw new Error("Invalid swell data structure");
    
        const times = data.hourly.time;
        const heights = data.hourly.wave_height;
        const directions = data.hourly.wave_direction;
        const periods = data.hourly.wave_period;
    
        return times.map((time, i) => ({
            time,
            swellHeight: heights[i],
            swellDirection: directions[i],
            swellPeriod: periods[i],
        }));
    } catch (err) {
        Logger.log("❌ Swell fetch error: " + err.message);
        return [];
    }
}
  


/**
 * Merges wind and swell forecast data for a given location
 */
function fetchAllWeatherForecast(lat, lon) {
    const windData = fetchWindForecast(lat, lon);
    const swellData = fetchSwellForecast(lat, lon);

    const swellMap = new Map(swellData.map(item => [item.time, item]));

    return windData.map(wind => {
        const swell = swellMap.get(wind.time);
        return {
            time: wind.time,
            windSpeed: wind.windSpeed,
            windDirection: wind.windDirection,
            swellHeight: swell?.swellHeight ?? null,
            swellDirection: swell?.swellDirection ?? null,
            swellPeriod: swell?.swellPeriod ?? null,
            tideLevel: null, // placeholder
            tideDirection: null // placeholder
        };
    });
}