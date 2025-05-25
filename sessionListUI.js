/**
 * Placeholder: session list screen
 */
function buildSessionListCard() {
    const sessions = getUserSessions();

    const nav = buildNavRow("Sessions", [
        CardService.newTextButton()
          .setText("Add")
          .setOnClickAction(CardService.newAction().setFunctionName("buildAddSessionCard")),
        CardService.newTextButton()
          .setText("Profile")
          .setOnClickAction(CardService.newAction().setFunctionName("buildProfileCardAction"))
      ]);

    const builder = CardService.newCardBuilder().addSection(nav);

    if (!sessions.length) {
        builder.addSection(CardService.newCardSection()
            .addWidget(CardService.newTextParagraph().setText("You don't have any sessions yet.")));
    } else {
        sessions.forEach((session, i) => {
            builder.addSection(renderSessionCardSection(session, i));
        });
    }
    
    return builder.build();
}



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