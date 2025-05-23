/**
 * Checks whether a value is within a min/max range
 */
function isInRange(value, min, max) {
    return value >= min && value <= max;
}
  
/**
 * Checks whether a directional value (degrees) is within a circular range.
 * Handles cases where the range wraps around 360°.
 */
function isInDirectionalRange(angle, start, end) {
    if (start <= end) {
        return angle >= start && angle <= end;
    } else {
        return angle >= start || angle <= end; // handles 350°–10° case
    }
}

/**
 * Matches a session against the current marine weather conditions
 *
 * @param {Object} session - One session object from user settings
 * @param {Object} conditions - One hour of marine conditions
 * @return {boolean} - True if conditions match the session criteria
 */
function matchSessionToConditions(session, conditions) {
    const tide = session.tide;
    const wind = session.wind;
    const swell = session.swell;
  
    return (
        // Check tide level and direction
        isInRange(conditions.tideLevel, tide.min, tide.max) &&
        conditions.tideDirection === tide.direction &&
    
        // Check wind speed and direction
        isInRange(conditions.windSpeed, wind.min, wind.max) &&
        isInDirectionalRange(conditions.windDirection, wind.directionStart, wind.directionEnd) &&
    
        // Check swell height, direction, and period
        isInRange(conditions.swellHeight, swell.min, swell.max) &&
        isInDirectionalRange(conditions.swellDirection, swell.directionStart, swell.directionEnd) &&
        isInRange(conditions.swellPeriod, swell.periodMin, swell.periodMax)
    );
}

/**
 * Test function: matches sessions against mocked hourly forecasts by location
 */
function testSessionMatching() {
    const sessions = getUserSessions();
  
    // Mock forecast for each location (hourly data array)
    const mockForecastByLocation = {
      "Saint-Malo": [
        {
          tideLevel: 1.9,
          tideDirection: "rising",
          windSpeed: 12,
          windDirection: 200,
          swellHeight: 1.2,
          swellDirection: 300,
          swellPeriod: 10
        },
        {
          tideLevel: 2.0,
          tideDirection: "rising",
          windSpeed: 13,
          windDirection: 210,
          swellHeight: 1.3,
          swellDirection: 310,
          swellPeriod: 11
        }
      ],
      "Cancale": [
        {
          tideLevel: 1.0,
          tideDirection: "falling",
          windSpeed: 15,
          windDirection: 150,
          swellHeight: 0.9,
          swellDirection: 60,
          swellPeriod: 9
        },
        {
          tideLevel: 0.9,
          tideDirection: "falling",
          windSpeed: 12,
          windDirection: 140,
          swellHeight: 0.8,
          swellDirection: 55,
          swellPeriod: 8
        }
      ]
    };
  
    const matchingResults = [];
  
    for (const session of sessions) {
      const locationForecast = mockForecastByLocation[session.location];
  
      if (!locationForecast) continue;
  
      for (const hourConditions of locationForecast) {
        if (matchSessionToConditions(session, hourConditions)) {
          matchingResults.push({
            session: session,
            time: hourConditions.time || "mocked hour",
            matchedConditions: hourConditions
          });
          break; // Stop after first match for this session
        }
      }
    }
  
    Logger.log("Matching sessions:");
    Logger.log(matchingResults);
  }
  