/**
 * Fetches hourly wind speed and direction for a given location using Open-Meteo Marine Weather API.
 * This version pulls forecast data for today.
 */

function fetchWindForecast(lat, lon, startDate = new Date(), days = 1) {
    const start = formatDate(startDate);
    const end = getDateOffset(startDate, days - 1);
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&hourly=wind_speed_10m,wind_direction_10m&start_date=${start}&end_date=${end}&timezone=Europe/Paris`;
  
    try {
        const res = UrlFetchApp.fetch(url);
        const { hourly } = JSON.parse(res.getContentText());
        if (!hourly?.time) throw new Error("Missing wind data");
    
        return hourly.time.map((t, i) => ({
            time: t,
            windSpeed: hourly.wind_speed_10m[i],
            windDirection: hourly.wind_direction_10m[i]
        }));
    } catch (e) {
        Logger.log("⚠️ Wind fetch error: " + e.message);
        return [];
    }
}


/**
 * Fetches swell forecast for a given location and period.
 */
function fetchSwellForecast(lat, lon, startDate = new Date(), days = 1) {
    const start = formatDate(startDate);
    const end = getDateOffset(startDate, days - 1);
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}` +
        `&hourly=wave_height,wave_direction,wave_period&start_date=${start}&end_date=${end}&timezone=Europe/Paris`;
  
    try {
        const res = UrlFetchApp.fetch(url);
        const { hourly } = JSON.parse(res.getContentText());
        if (!hourly?.time) throw new Error("Missing swell data");
    
        return hourly.time.map((t, i) => ({
            time: t,
            swellHeight: hourly.wave_height[i],
            swellDirection: hourly.wave_direction[i],
            swellPeriod: hourly.wave_period[i]
        }));
    } catch (e) {
        Logger.log("⚠️ Swell fetch error: " + e.message);
        return [];
    }
}
  


/**
 * Fetches combined marine forecast for a given location and period.
 */
function fetchAllWeatherForecast(lat, lon, startDate = new Date(), days = 1) {
    const wind = fetchWindForecast(lat, lon, startDate, days);
    const swell = fetchSwellForecast(lat, lon, startDate, days);
    const swellMap = new Map(swell.map(s => [s.time, s]));
  
    return wind.map(w => {
        const s = swellMap.get(w.time);
        return {
            time: w.time,
            windSpeed: w.windSpeed,
            windDirection: w.windDirection,
            swellHeight: s?.swellHeight ?? null,
            swellDirection: s?.swellDirection ?? null,
            swellPeriod: s?.swellPeriod ?? null,
            tideLevel: null,
            tideDirection: null
        };
    });
}