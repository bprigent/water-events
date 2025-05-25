
// Matches a single session against a single forecast hour.
function matchSessionToConditions(session, conditionsForAnHour) {
  // extract the session conditions
  const { tide, wind, swell } = session;

  // Check tide conditions
  const tideMatches =
    isInRange(conditionsForAnHour.tideLevel, tide.min, tide.max) &&
    conditionsForAnHour.tideDirection === tide.direction;
  if (!tideMatches) return false;

  // Check wind conditions
  const windMatches =
    isInRange(conditionsForAnHour.windSpeed, wind.min, wind.max) &&
    isInDirectionalRange(conditionsForAnHour.windDirection, wind.directionStart, wind.directionEnd);
  if (!windMatches) return false;

  // Check swell conditions
  const swellMatches =
    isInRange(conditionsForAnHour.swellHeight, swell.min, swell.max) &&
    isInRange(conditionsForAnHour.swellPeriod, swell.periodMin, swell.periodMax) &&
    isInDirectionalRange(conditionsForAnHour.swellDirection, swell.directionStart, swell.directionEnd);
  if (!swellMatches) return false;

  return true;
}


// Finds matches for each session using forecastByLocation and user profile.
function findMatchingForecastsForUserSessions(sessions, forecastByLocation, userProfile) {
  return sessions.map((session) => {
    const forecast = forecastByLocation[session.location] || [];

    const matches = forecast.filter(hour =>
      isHourInUserAvailability(hour.time, userProfile) &&
      matchSessionToConditions(session, hour)
    );

    return { session, matches };
  }).filter(result => result.matches.length > 0);
}



// Refreshes and stores latest matches for one session.
function handleRefreshSessionMatches(e) {
  const index = parseInt(e.parameters.index, 10);
  const sessions = getUserSessions();
  const session = sessions[index];
  const userProfile = getUserProfile();

  if (!session || !userProfile) {
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText("⚠️ Session or profile missing."))
      .build();
  }

  const forecast = fetchAllWeatherForecast(session.coordinates.lat, session.coordinates.lon, new Date(), 3);
  const matches = forecast.filter(hour =>
    isHourInUserAvailability(hour.time, userProfile) &&
    matchSessionToConditions(session, hour)
  );

  saveSessionMetadata(index, {
    lastChecked: new Date().toISOString(),
    matches
  });

  return CardService.newActionResponseBuilder()
    .setNotification(CardService.newNotification().setText(`🔄 Found ${matches.length} match(es)`))
    .setNavigation(CardService.newNavigation().updateCard(buildSessionDetailCard({ parameters: { index: index.toString() } })))
    .build();
}