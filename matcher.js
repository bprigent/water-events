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
        return angle >= start || angle <= end; // wrap around
    }
}
  
/**
 * Matches a single session against the current mocked weather conditions
 */
function matchSessionToConditions(session, conditions) {
    const tide = session.tide;
    const wind = session.wind;
    const swell = session.swell;
  
    return (
        isInRange(conditions.tideLevel, tide.min, tide.max) &&
        conditions.tideDirection === tide.direction &&
        isInRange(conditions.windSpeed, wind.min, wind.max) &&
        isInDirectionalRange(conditions.windDirection, wind.directionStart, wind.directionEnd) &&
        isInRange(conditions.swellHeight, swell.min, swell.max) &&
        isInDirectionalRange(conditions.swellDirection, swell.directionStart, swell.directionEnd)
    );
}


/**
 * Test session matching logic with mocked condition data
 */
function testSessionMatching() {
    const sessions = getUserSessions();
  
    const mockConditions = {
        tideLevel: 1.9,
        tideDirection: "rising",
        windSpeed: 12,
        windDirection: 200,
        swellHeight: 1.2,
        swellDirection: 300
    };
  
    const matchingSessions = sessions.filter(session =>
        matchSessionToConditions(session, mockConditions)
    );
  
    Logger.log("Matching sessions:");
    Logger.log(matchingSessions);
}
  