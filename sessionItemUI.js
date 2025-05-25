
/**
 * Opens the session detail card for a specific session.
 */
function buildSessionDetailCard(e) {
    const index = parseInt(e.parameters.index, 10);
    const sessions = getUserSessions();
    const session = sessions[index];
    const metadata = getSessionMetadata(index);
  
    const nav = buildNavRow("Session Details", [
        CardService.newTextButton()
            .setText("Refresh")
            .setOnClickAction(CardService.newAction()
                .setFunctionName("handleRefreshSessionMatches")
                .setParameters({ index: index.toString() })),
        CardService.newTextButton()
            .setText("🗑 Delete")
            .setOnClickAction(CardService.newAction()
                .setFunctionName("handleDeleteSession")
                .setParameters({ index: index.toString() }))
    ]);
  
    return CardService.newCardBuilder()
      .addSection(nav)
      .addSection(renderSessionDetailSection(session, index))
      .addSection(renderSessionMatchSection(metadata))
      .build();
}

/**
 * section about the session
 */
function renderSessionDetailSection(session, index) {
    return CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText(`<b>Sport:</b> ${session.sport}`))
        .addWidget(CardService.newTextParagraph().setText(`<b>Location:</b> ${session.location}`))
        .addWidget(CardService.newTextParagraph().setText(`<b>Coordinates:</b> ${session.coordinates.lat}, ${session.coordinates.lon}`))
        .addWidget(CardService.newTextParagraph().setText(`<b>Tide:</b> ${session.tide.min}–${session.tide.max} (${session.tide.direction})`))
        .addWidget(CardService.newTextParagraph().setText(`<b>Wind:</b> ${session.wind.min}–${session.wind.max} knots (${session.wind.directionStart}–${session.wind.directionEnd}°)`))
        .addWidget(CardService.newTextParagraph().setText(`<b>Swell:</b> ${session.swell.min}–${session.swell.max} m, ${session.swell.periodMin}–${session.swell.periodMax}s (${session.swell.directionStart}–${session.swell.directionEnd}°)`));
}


function renderSessionMatchSection(metadata) {
    const section = CardService.newCardSection();
    const matches = metadata?.matches || [];
    const lastChecked = metadata?.lastChecked || "Never";
  
    section.addWidget(CardService.newTextParagraph().setText(`<b>Last Checked:</b> ${lastChecked}`));
    section.addWidget(CardService.newTextParagraph().setText(
        matches.length
            ? `✅ ${matches.length} matching hour(s) found.`
            : "❌ No matching hours found."
    ));
  
    matches.forEach(m => {
        const time = new Date(m.time).toLocaleString();
        section.addWidget(CardService.newTextParagraph().setText(
            `🕒 <b>${time}</b><br>
            💨 Wind: ${m.windSpeed} knots at ${m.windDirection}°<br>
            🌊 Swell: ${m.swellHeight} m, ${m.swellPeriod}s at ${m.swellDirection}°`
        ));
    });
  
    return section;
}