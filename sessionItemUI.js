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
  
    const nav = buildNavRow("Session Details", []);
  
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
    
    return CardService.newCardBuilder()
        .addSection(nav)
        .addSection(section)
        .build();
  }


  /**
 * Deletes a session by index and returns to the list.
 * @param {Object} e - Event object (expects index param)
 */
function handleDeleteSession(e) {
    const index = parseInt(e.parameters.index, 10);
    const sessions = getUserSessions();
    sessions.splice(index, 1); // remove the session
    saveUserSessions(sessions);
  
    return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification().setText("🗑 Session deleted"))
        .setNavigation(CardService.newNavigation().popToRoot().pushCard(buildSessionListCard()))
        .build();
}
  