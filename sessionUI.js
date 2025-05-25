/**
 * Placeholder: session list screen
 */
function buildSessionListCard() {
    return CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader().setTitle("Your Sessions"))
        .addSection(CardService.newCardSection()
            .addWidget(CardService.newTextParagraph().setText("You don't have any sessions yet.")))
        .build();
}
  