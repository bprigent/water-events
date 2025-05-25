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
 * checks if the hour is in the user's availability.
 */
function isHourInUserAvailability(forecastTime, profile) {
  const date = new Date(forecastTime);
  const day = date.toLocaleDateString("en-US", { weekday: "long" });

  const hour = date.getHours();
  const startHour = parseInt(profile.timeWindow.start.split(":")[0], 10);
  const endHour = parseInt(profile.timeWindow.end.split(":")[0], 10);

  return profile.availableDays.includes(day) && hour >= startHour && hour < endHour;
}


/**
 * Matches a session against the current marine weather conditions
 */
function matchSessionToConditions(session, conditions) {
  const { tide, wind, swell } = session;

  return (
    isInRange(conditions.tideLevel, tide.min, tide.max) &&
    conditions.tideDirection === tide.direction &&

    isInRange(conditions.windSpeed, wind.min, wind.max) &&
    isInDirectionalRange(conditions.windDirection, wind.directionStart, wind.directionEnd) &&

    isInRange(conditions.swellHeight, swell.min, swell.max) &&
    isInRange(conditions.swellPeriod, swell.periodMin, swell.periodMax) &&
    isInDirectionalRange(conditions.swellDirection, swell.directionStart, swell.directionEnd)
  );
}



/**
 * finds the matching forecasts for the user's sessions.
 */

function findMatchingForecastsForUserSessions(sessions, forecastByLocation, userProfile) {
  const matching = [];

  for (const session of sessions) {
    const forecast = forecastByLocation[session.location];

    const validMatches = forecast.filter(hour =>
      isHourInUserAvailability(hour.time, userProfile) &&
      matchSessionToConditions(session, hour)
    );

    if (validMatches.length) {
      matching.push({ session, matches: validMatches });
    }
  }

  return matching;
}
