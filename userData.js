/****************************************************/
/** USER PROFILE SECTION */
/****************************************************/

/**
 * saves profile data in the user properties.
 */
function saveUserProfile(profile) {
    // Get access to the user's properties storage
    const props = PropertiesService.getUserProperties();
    // Convert the profile object to a JSON string and save it
    props.setProperty("userProfile", JSON.stringify(profile));
}

/**
 * get the user profile from the user properties.
 */
function getUserProfile() {
    const props = PropertiesService.getUserProperties();
    const raw = props.getProperty("userProfile");
    // Parse the JSON string back into an object, or return null if no profile exists
    return raw ? JSON.parse(raw) : null;
}
  
/**
 * testing function to save a sample user profile with default values
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
 * testing function to log the current user profile to the Apps Script log
 */
function logUserProfile() {
    const profile = getUserProfile();
    Logger.log(profile);
}

/****************************************************/
/** USER SESSION SECTION */
/****************************************************/

/**
 * save the user sessions to the user properties.
 */
function saveUserSessions(sessions) {
    const props = PropertiesService.getUserProperties();
    props.setProperty("userSessions", JSON.stringify(sessions));
}

/**
 * get the user sessions from the user properties.
 */
function getUserSessions() {
    const props = PropertiesService.getUserProperties();
    const raw = props.getProperty("userSessions");
    return raw ? JSON.parse(raw) : [];
}

/** 
 * log the user sessions to the Apps Script log
 */
function logUserSessions() {
    const sessions = getUserSessions();
    Logger.log(sessions);
}