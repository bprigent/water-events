/**
 * Entry point for the Google Calendar add-on. Called when the user opens the sidebar.
 * @param {Object} e - The event object
 */
function buildAddOn(e) {
    return createMainCard();
  }
  
  /**
   * Builds the main setup card
   */
  function createMainCard() {
    const card = CardService.newCardBuilder();
    const section = CardService.newCardSection()
      .addWidget(CardService.newTextInput()
        .setFieldName('name')
        .setTitle('Name'))
      .addWidget(CardService.newTextInput()
        .setFieldName('days')
        .setTitle('Available Days (comma-separated)')
        .setValue('Saturday, Sunday'))
      .addWidget(CardService.newTextInput()
        .setFieldName('start')
        .setTitle('Start Time')
        .setValue('08:00'))
      .addWidget(CardService.newTextInput()
        .setFieldName('end')
        .setTitle('End Time')
        .setValue('18:00'))
      .addWidget(CardService.newTextInput()
        .setFieldName('tide')
        .setTitle('Tide API Key'))
      .addWidget(CardService.newTextInput()
        .setFieldName('wind')
        .setTitle('Wind API Key'))
      .addWidget(CardService.newTextInput()
        .setFieldName('swell')
        .setTitle('Swell API Key'))
      .addWidget(CardService.newTextButton()
        .setText('Save Profile')
        .setOnClickAction(CardService.newAction()
          .setFunctionName('handleSaveProfile')));
  
    card.addSection(section);
    return card.build();
  }
  


  /**
 * Handles form submission from the add-on UI
 */
function handleSaveProfile(e) {
    const formInput = e.commonEventObject.formInputs;
  
    const profile = {
      name: formInput.name.stringInputs.value[0],
      availableDays: formInput.days.stringInputs.value[0].split(',').map(d => d.trim()),
      timeWindow: {
        start: formInput.start.stringInputs.value[0],
        end: formInput.end.stringInputs.value[0]
      },
      apiKeys: {
        tide: formInput.tide.stringInputs.value[0],
        wind: formInput.wind.stringInputs.value[0],
        swell: formInput.swell.stringInputs.value[0]
      }
    };
  
    saveUserProfile(profile);
  
    return CardService.newActionResponseBuilder()
      .setNotification(CardService.newNotification()
        .setText('✅ Profile saved!'))
      .build();
  }
  