/**
 * Entry point: triggered when add-on loads in Google Calendar
 */

function buildAddOn(e) {
  const userProfile = getUserProfile();
  const card = userProfile ? buildSessionListCard() : buildWelcomeCard();

  return CardService.newActionResponseBuilder()
    .setNavigation(CardService.newNavigation().pushCard(card))
    .build();
}