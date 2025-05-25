// format date to YYYY-MM-DD.
function formatDate(date) {
    return date.toISOString().split("T")[0];
}
  
// Returns a date string offset by N days.
function getDateOffset(baseDate, offsetDays) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + offsetDays);
    return formatDate(date);
}
  
//Checks whether a value is within a min/max range
function isInRange(value, min, max) {
    return value >= min && value <= max;
}
  
// Checks whether a directional value (degrees) is within a circular range.
// Handles cases where the range wraps around 360°.
function isInDirectionalRange(angle, start, end) {
    if (start <= end) {
        return angle >= start && angle <= end;
    } else {
        return angle >= start || angle <= end;
    }
}
  
// Checks if the forecast hour is within user's availability window.
function isHourInUserAvailability(forecastTime, profile) {
    const date = new Date(forecastTime);
    const day = date.toLocaleDateString("en-US", { weekday: "long" });
  
    const hour = date.getHours();
    const startHour = parseInt(profile.timeWindow.start.split(":"), 10);
    const endHour = parseInt(profile.timeWindow.end.split(":"), 10);
  
    return profile.availableDays.includes(day) && hour >= startHour && hour < endHour;
}