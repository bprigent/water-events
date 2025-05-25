/**
 * Renders a single session card section for the session list view.
 */
function renderSessionCardSection(session, index) {
    const title = `${session.sport} at ${session.location}`;
  
    const details = `
        <b>Tide:</b> ${session.tide.min}–${session.tide.max} (${session.tide.direction})<br>
        <b>Wind:</b> ${session.wind.min}–${session.wind.max} knots (${session.wind.directionStart}–${session.wind.directionEnd}°)<br>
        <b>Swell:</b> ${session.swell.min}–${session.swell.max} m, ${session.swell.periodMin}–${session.swell.periodMax}s (${session.swell.directionStart}–${session.swell.directionEnd}°)
    `;
  
    return CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText(`<b>${title}</b><br>${details}`))
        .addWidget(CardService.newTextButton()
            .setText("Open")
            .setOnClickAction(CardService.newAction()
                .setFunctionName("buildSessionDetailCard")
                .setParameters({ index: index.toString() })));
}
  

/**
 * Opens the session detail card for a specific session.
 */
function buildSessionDetailCard(e) {
    const index = parseInt(e.parameters.index, 10);
    const sessions = getUserSessions();
    const session = sessions[index];
  
    const nav = buildNavRow("Session Details", [
        CardService.newTextButton()
            .setText("Refresh")
            .setOnClickAction(CardService.newAction()
                .setFunctionName("handleRefreshSessionMatches")
                .setParameters({ index: index.toString() }))
    ]);
  
    const section = CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText(`<b>Sport:</b> ${session.sport}`))
        .addWidget(CardService.newTextParagraph().setText(`<b>Location:</b> ${session.location}`))
        .addWidget(CardService.newTextParagraph().setText(`<b>Coordinates:</b> ${session.coordinates.lat}, ${session.coordinates.lon}`))
        .addWidget(CardService.newTextParagraph().setText(`<b>Tide:</b> ${session.tide.min}–${session.tide.max} (${session.tide.direction})`))
        .addWidget(CardService.newTextParagraph().setText(`<b>Wind:</b> ${session.wind.min}–${session.wind.max} knots (${session.wind.directionStart}–${session.wind.directionEnd}°)`))
        .addWidget(CardService.newTextParagraph().setText(`<b>Swell:</b> ${session.swell.min}–${session.swell.max} m, ${session.swell.periodMin}–${session.swell.periodMax}s (${session.swell.directionStart}–${session.swell.directionEnd}°)`))
        .addWidget(CardService.newTextButton()
                .setText("🗑 Delete Session")
                .setOnClickAction(CardService.newAction()
                    .setFunctionName("handleDeleteSession")
                    .setParameters({ index: index.toString() })));
    
    const metadata = getSessionMetadata(index);
    const matches = metadata?.matches || [];
    const lastChecked = metadata?.lastChecked;

    const matchSection = CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText(`<b>Last Checked:</b> ${lastChecked || "Never"}`))
        .addWidget(CardService.newTextParagraph().setText(
            matches.length
                ? `✅ ${matches.length} matching hour(s) found.`
                : "❌ No matching hours found."
        ));

    matches.forEach(m => {
        const time = new Date(m.time).toLocaleString();
        matchSection.addWidget(CardService.newTextParagraph().setText(
            `🕒 <b>${time}</b><br>
            💨 Wind: ${m.windSpeed} knots at ${m.windDirection}°<br>
            🌊 Swell: ${m.swellHeight} m, ${m.swellPeriod}s at ${m.swellDirection}°`
        ));
    });
        
    return CardService.newCardBuilder()
        .addSection(nav)
        .addSection(section)
        .addSection(matchSection)
        .build();
}





/**
 * Deletes a session by index and returns to the list.
 */
function handleDeleteSession(e) {
    const index = parseInt(e.parameters.index, 10);
    const sessions = getUserSessions();
    sessions.splice(index, 1); // remove the session
    saveUserSessions(sessions);

    deleteSessionMetadata(index);
  
    return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification().setText("🗑 Session deleted"))
        .setNavigation(CardService.newNavigation().popToRoot().pushCard(buildSessionListCard()))
        .build();
}