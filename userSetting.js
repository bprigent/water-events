/**
 * This file manages user profile settings using Google Apps Script's Properties Service.
 * It provides functions to save, retrieve, and manage user preferences and API keys.
 */

function saveUserProfile(profile) {
    // Get access to the user's properties storage
    const props = PropertiesService.getUserProperties();
    // Convert the profile object to a JSON string and save it
    props.setProperty("userProfile", JSON.stringify(profile));
}

function getUserProfile() {
    const props = PropertiesService.getUserProperties();
    const raw = props.getProperty("userProfile");
    // Parse the JSON string back into an object, or return null if no profile exists
    return raw ? JSON.parse(raw) : null;
}
  
/**
 * Creates and saves a sample user profile with default values
 * This is useful for testing or initial setup
 */
function saveSampleProfile() {
    const profile = {
        name: "Benjamin",
        // Days when the user is available for water activities
        availableDays: ["Saturday", "Sunday"],
        // Preferred time window for activities
        timeWindow: { start: "08:00", end: "18:00" },
        // API keys for various weather and ocean data services
        apiKeys: {
            tide: "your-tide-api-key",
            wind: "your-wind-api-key",
            swell: "your-swell-api-key"
        }
    };
  
    saveUserProfile(profile);
    Logger.log("Sample profile saved.");
}
  
/**
 * Logs the current user profile to the Apps Script log
 * Useful for debugging and verification
 */
function logUserProfile() {
    const profile = getUserProfile();
    Logger.log(profile);
}
  