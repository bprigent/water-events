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
    const profile = getUserProfile();
    const name = profile ? profile.name : "";
    const timeWindowStart = profile ? profile.timeWindow.start : "";
    const timeWindowEnd = profile ? profile.timeWindow.end : "";
    const tideApiKey = profile ? profile.apiKeys.tide : "";
    const windApiKey = profile ? profile.apiKeys.wind : "";
    const swellApiKey = profile ? profile.apiKeys.swell : "";
    const availableDays = profile ? profile.availableDays : [];

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
    const dayCheckboxes = CardService.newSelectionInput()
        .setType(CardService.SelectionInputType.CHECK_BOX)
        .setFieldName("availableDays")
        .setTitle("Available Days");
  
    days.forEach(day => {
        const isSelected = availableDays.includes(day);
        dayCheckboxes.addItem(day, day, isSelected);
    });
  
    const section = CardService.newCardSection()
        .addWidget(CardService.newTextInput().setFieldName("name").setTitle("Your Name").setValue(name))
        .addWidget(CardService.newTextInput().setFieldName("start").setTitle("Start Time (e.g. 08:00)").setValue(timeWindowStart))
        .addWidget(CardService.newTextInput().setFieldName("end").setTitle("End Time (e.g. 18:00)").setValue(timeWindowEnd))
        .addWidget(CardService.newTextInput().setFieldName("tide").setTitle("Tide API Key").setValue(tideApiKey))
        .addWidget(CardService.newTextInput().setFieldName("wind").setTitle("Wind API Key").setValue(windApiKey))
        .addWidget(CardService.newTextInput().setFieldName("swell").setTitle("Swell API Key").setValue(swellApiKey))
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
        .setNavigation(CardService.newNavigation().popToRoot().pushCard(buildProfileCard()))
        .build();
}

/**
* Triggers display of profile card
*/
function buildProfileCardAction() {
    return CardService.newActionResponseBuilder()
        .setNavigation(CardService.newNavigation().pushCard(buildProfileCard()))
        .build();
}

/**
* Builds the profile card
*/
function buildProfileCard() {
    const profile = getUserProfile();

    const nav = buildNavRow("Your Profile", [
        CardService.newTextButton()
        .setText("Edit")
        .setOnClickAction(CardService.newAction().setFunctionName("buildSignupFormCardAction"))
    ]);

    if (!profile) {
        return CardService.newCardBuilder()
        .setHeader(CardService.newCardHeader().setTitle("Water Events"))
        .addSection(nav)
        .addSection(CardService.newCardSection()
            .addWidget(CardService.newTextParagraph().setText("No profile found.")))
        .build();
    }

    const section = CardService.newCardSection()
        .addWidget(CardService.newTextParagraph().setText(`<b>Name:</b> ${profile.name}`))
        .addWidget(CardService.newTextParagraph().setText(`<b>Available Days:</b> ${profile.availableDays.join(", ")}`))
        .addWidget(CardService.newTextParagraph().setText(`<b>Time Window:</b> ${profile.timeWindow.start}–${profile.timeWindow.end}`))
        .addWidget(CardService.newTextParagraph().setText(`<b>API Keys:</b><br>
            Tide: ${profile.apiKeys.tide}<br>
            Wind: ${profile.apiKeys.wind}<br>
            Swell: ${profile.apiKeys.swell}`));

    return CardService.newCardBuilder()
        .addSection(nav)
        .addSection(section)
        .build();
}