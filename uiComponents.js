/**
 * Builds a reusable top nav row with a left title and right-aligned buttons
 * @param {string} title - Section title (shown on the left)
 * @param {Array} buttons - Array of CardService.TextButton
 * @return {CardSection}
 */
function buildNavRow(title, buttons) {
    const navSection = CardService.newCardSection();
  
    // Left: title
    navSection.addWidget(CardService.newTextParagraph().setText(`<b>${title}</b>`));
  
    // Right: button set
    const buttonSet = CardService.newButtonSet();
    buttons.forEach(btn => buttonSet.addButton(btn));
    navSection.addWidget(buttonSet);
  
    return navSection;
}
  