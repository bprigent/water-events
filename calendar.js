/**
 * Creates a calendar event for a given session and time
 *
 * @param {Object} session - The session object
 * @param {string} time - The time of the event
 * @param {Object} conditions - The conditions object
 */
function createCalendarEvent(session, time, conditions) {
    const calendar = CalendarApp.getDefaultCalendar();
  
    const start = new Date(time);
    const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour
  
    const title = `${session.location} - ${session.sport}`;
    const description = `Conditions:
  - Tide: ${conditions.tideLevel} (${conditions.tideDirection})
  - Wind: ${conditions.windSpeed} knots @ ${conditions.windDirection}°
  - Swell: ${conditions.swellHeight}m @ ${conditions.swellDirection}° (${conditions.swellPeriod}s)`;
  
    calendar.createEvent(title, start, end, { description });
  }
  