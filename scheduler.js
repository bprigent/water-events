/**
 * Finds and creates matching sessions for the current day
 */
function findAndCreateMatchingSessions() {
    const sessions = getUserSessions();
    const forecastByLocation = {};
  
    // Step 1: Fetch forecasts for all unique locations
    const uniqueLocations = [...new Set(sessions.map(s => s.location))];
  
    for (const location of uniqueLocations) {
      const session = sessions.find(s => s.location === location);
      const coords = session.coordinates;
      forecastByLocation[location] = mergeWindAndSwellForecast(coords.lat, coords.lon);
    }
  
    // Step 2: Match sessions and create calendar events
    for (const session of sessions) {
      const hourlyForecasts = forecastByLocation[session.location];
  
      for (const hourConditions of hourlyForecasts) {
        if (matchSessionToConditions(session, hourConditions)) {
          createCalendarEvent(session, hourConditions.time, hourConditions);
          break; // optional: only create first match
        }
      }
    }
  }
  
  
  
  function setupTrigger() {
    ScriptApp.newTrigger("findAndCreateMatchingSessions")
      .timeBased()
      .everyDays(1)
      .atHour(6)
      .create();
  }