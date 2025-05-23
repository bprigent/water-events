/**
 * Saves the user's watersport sessions into persistent storage.
 * Each session contains the sport, location, and weather conditions (tide, wind, swell).
 * Data is saved as a JSON string using UserProperties, which is scoped to the individual user.
 *
 * @param {Array} sessions - An array of session objects to be saved.
 */
function saveUserSessions(sessions) {
    const props = PropertiesService.getUserProperties(); // Access per-user persistent storage
    props.setProperty("userSessions", JSON.stringify(sessions)); // Convert sessions to JSON and save
}
  
/**
 * Retrieves the user's saved sessions from persistent storage.
 * If no sessions are found, returns an empty array.
 *
 * @return {Array} - An array of session objects or an empty array if none exist.
 */
function getUserSessions() {
    const props = PropertiesService.getUserProperties(); // Access user storage
    const raw = props.getProperty("userSessions"); // Try to retrieve the saved sessions string
    return raw ? JSON.parse(raw) : []; // Parse JSON if it exists, else return empty array
}
  
/**
 * A helper function to save example sessions for testing.
 * This simulates a user creating two sessions with different sports and conditions.
 */
function saveSampleSessions() {
    const sessions = [
        {
            sport: "surf",
            location: "Saint-Malo",
            coordinates: { lat: 48.6525, lon: -2.0253 }, // Exact spot location (example coords)
            tide: { min: 1.2, max: 2.8, direction: "rising" },
            wind: {
                min: 5,
                max: 15,
                directionStart: 180, // from the south
                directionEnd: 270    // to the west
            },
            swell: {
                min: 0.8,
                max: 2.0,
                directionStart: 270, // from the west
                directionEnd: 360    // to the north
            }
        },
        {
            sport: "kitesurf",
            location: "Cancale",
            coordinates: { lat: 48.6732, lon: -1.8549 },
            tide: { min: 0.8, max: 3.0, direction: "falling" },
            wind: {
                min: 10,
                max: 20,
                directionStart: 90,  // from the east
                directionEnd: 180    // to the south
            },
            swell: {
                min: 0.5,
                max: 1.5,
                directionStart: 0,   // from the north
                directionEnd: 90     // to the east
            }
        }
    ];

    saveUserSessions(sessions); // Save the test data to persistent storage
    Logger.log("Sample sessions saved."); // Log success for developer visibility
}

/**
 * Logs the user's saved sessions to the execution log.
 * Useful for debugging and verifying that session storage is working correctly.
 */
function logUserSessions() {
    const sessions = getUserSessions(); // Retrieve saved sessions
    Logger.log(sessions); // Print them to the execution log
}
  