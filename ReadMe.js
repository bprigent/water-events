/**
 
# Water Events – Google Calendar Automation Tool
Water Events is a Google Apps Script project designed to automatically create Google Calendar events based on water-related conditions — such as tide times, surf forecasts, or weather data.

## Who exactly is the user?
- People of various levels of watersports experience.
- They live near the water and practice one or more watersports.
- They may have to travel to different spots to practice their watersports.
- They practice their sport at more than one location.
- They try to practice as much as possible, at least once a week.
- They have a Google Calendar account. 

## User Problems
- People need to go to a website to get the forecast. They need to be pro-active in their research.
- People need to compare the forecast of different spot to make a decision. This require them to switch between webvpages and browser tabs.

## Product goals
Help people know when are where to do their favorite water activities seamlessly. 

## Features
- Everything happens in Google Calendar. We are leveraging the power of Google Calendar and app scripts to create a seamless experience.
- Users can indicate which watersport they practice: surf, windsurf, kitesurf, and wing. They can pick more than one sport.
- Users can indicate in which location they practice their watersports.
- Users can indicate which day of the week they are available to practice and what time of the day they are available to practice.

## User flow - profile creation
1. User enters their name
2. User enters the days of the week they are available to practice
3. User enters the time of the day they are available to practice.
4. User enters their API keys for the Tides API, Wind API, and Swell API.

## User flow - session creation
1. User adds a sport combined with a location, we call that a session.
2. For each session, the user will pick the max/min wind, max/min tide level, tide direction. max/min swell height, max/min swell direction.
3. The user can have as many sessions as they want.

## User flow - session discovery
1. the user opens their Google Calendar app or the Google Calendar Website.
2. the user can see hour increments (1h long events) for the different sessions that are suggested.
3. the title of the event is made of the location and the sport.
4. the description of the even is conditions (tide, wind, swell), and a link to the best forcast website for details.

## Technology stack
- Google Apps Script
- Google Calendar
- Tides API: ??
- Wind API: ??
- Swell API: ??

*/