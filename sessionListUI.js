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