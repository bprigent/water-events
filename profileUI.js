/**
 * Welcome card shown when the user has not completed profile setup
 */
function buildWelcomeCard() {
    const section = CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText(
            "Welcome to Water Events 🌊\n\nGet Google Calendar alerts when conditions are perfect for your watersports."))
        .addWidget(CardService.newTextButton()
            .setText("Get Started")
        .setOnClickAction(CardService.newAction().setFunctionName("buildSignupFormCardAction")));
  
    return CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader().setTitle("Welcome"))
        .addSection(section)
        .build();
}
  
/**
 * Triggers display of signup form
 */
function buildSignupFormCardAction() {
    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().pushCard(buildSignupFormCard()))
        .build();
}
  
  /**
   * User profile form UI
   */
  function buildSignupFormCard() {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
    const dayCheckboxes = CardService.newSelectionInput()
      .setType(CardService.SelectionInputType.CHECK_BOX)
      .setFieldName("availableDays")
      .setTitle("Available Days");
  
    days.forEach(day => {
      dayCheckboxes.addItem(day, day, false);
    });
  
    const section = CardService.newCardSection()
      .addWidget(CardService.newTextInput().setFieldName("name").setTitle("Your Name"))
      .addWidget(CardService.newTextInput().setFieldName("start").setTitle("Start Time (e.g. 08:00)"))
      .addWidget(CardService.newTextInput().setFieldName("end").setTitle("End Time (e.g. 18:00)"))
      .addWidget(CardService.newTextInput().setFieldName("tide").setTitle("Tide API Key"))
      .addWidget(CardService.newTextInput().setFieldName("wind").setTitle("Wind API Key"))
      .addWidget(CardService.newTextInput().setFieldName("swell").setTitle("Swell API Key"))
      .addWidget(dayCheckboxes)
      .addWidget(CardService.newTextButton()
        .setText("Save Profile")
        .setOnClickAction(CardService.newAction().setFunctionName("handleSaveUserProfile")));
  
    return CardService.newCardBuilder()
      .setHeader(CardService.newCardHeader().setTitle("Set Up Your Profile"))
      .addSection(section)
      .build();
  }
  
  /**
   * Form handler that saves the user profile
   */
  function handleSaveUserProfile(e) {
    const input = e.commonEventObject.formInputs;
  
    const profile = {
      name: input.name.stringInputs.value[0],
      timeWindow: {
        start: input.start.stringInputs.value[0],
        end: input.end.stringInputs.value[0]
      },
      apiKeys: {
        tide: input.tide.stringInputs.value[0],
        wind: input.wind.stringInputs.value[0],
        swell: input.swell.stringInputs.value[0]
      },
      availableDays: input.availableDays.stringInputs.value
    };
  
    saveUserProfile(profile);
  
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification().setText("✅ Profile saved!"))
      .setNavigation(CardService.newNavigation().popToRoot().pushCard(buildSessionListCard()))
      .build();
  }
  