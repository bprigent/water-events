function createTestEvent() {
  const cal = CalendarApp.getDefaultCalendar();
  const start = new Date();
  const end = new Date(start.getTime() + 60 * 60 * 1000); // 1 hour
  cal.createEvent("🌊 Surf Test Event", start, end, {
    description: "Test swell, wind, tide conditions."
  });
}