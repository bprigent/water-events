
/**
 * Builds the add session card that contains a form to add a new session.
 */
function buildAddSessionCard() {
    const nav = buildNavRow("New Session", []);

    const section = CardService.newCardSection()
        .addWidget(CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setFieldName("sport")
            .setTitle("Sport")
            .addItem("Surf", "surf", true)
            .addItem("Kitesurf", "kitesurf", false)
            .addItem("Windsurf", "windsurf", false)
            .addItem("Wing", "wing", false)
            .addItem("Paddle", "paddle", false))
        .addWidget(CardService.newTextInput()
            .setFieldName("locationQuery")
            .setTitle("Search location (beach, city, etc.)"))
        .addWidget(CardService.newTextInput()
            .setFieldName("tideMin")
            .setTitle("Tide Min (m)"))
        .addWidget(CardService.newTextInput()
            .setFieldName("tideMax")
            .setTitle("Tide Max (m)"))
        .addWidget(CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setFieldName("tideDirection")
            .setTitle("Tide Direction")
            .addItem("Rising", "rising", true)
            .addItem("Falling", "falling", false))

        .addWidget(CardService.newTextInput().setFieldName("windMin").setTitle("Wind Min"))
        .addWidget(CardService.newTextInput().setFieldName("windMax").setTitle("Wind Max"))
        .addWidget(CardService.newTextInput().setFieldName("windDirStart").setTitle("Wind Direction Start (°)"))
        .addWidget(CardService.newTextInput().setFieldName("windDirEnd").setTitle("Wind Direction End (°)"))

        .addWidget(CardService.newTextInput().setFieldName("swellMin").setTitle("Swell Min"))
        .addWidget(CardService.newTextInput().setFieldName("swellMax").setTitle("Swell Max"))
        .addWidget(CardService.newTextInput().setFieldName("swellPeriodMin").setTitle("Swell Period Min"))
        .addWidget(CardService.newTextInput().setFieldName("swellPeriodMax").setTitle("Swell Period Max"))
        .addWidget(CardService.newTextInput().setFieldName("swellDirStart").setTitle("Swell Direction Start (°)"))
        .addWidget(CardService.newTextInput().setFieldName("swellDirEnd").setTitle("Swell Direction End (°)"))

        .addWidget(CardService.newTextButton()
            .setText("Save Session")
            .setOnClickAction(CardService.newAction().setFunctionName("handleSaveSession")));

    return CardService.newCardBuilder()
        .addSection(nav)
        .addSection(section)
        .build();
}


/**
 * save the session to the user properties
 */
function handleSaveSession(e) {
    const input = e.commonEventObject.formInputs;
    const locationQuery = input.locationQuery.stringInputs.value[0];

    let coordinates;
    try {
        coordinates = geocodeLocation(locationQuery);
    } catch (err) {
        return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification().setText("⚠️ Location not found. Try a more specific name."))
        .build();
    }

    const newSession = {
        sport: input.sport.stringInputs.value[0],
        location: locationQuery,
        coordinates,
        tide: {
            min: parseFloat(input.tideMin.stringInputs.value[0]),
            max: parseFloat(input.tideMax.stringInputs.value[0]),
            direction: input.tideDirection.stringInputs.value[0]
        },
        wind: {
            min: parseFloat(input.windMin.stringInputs.value[0]),
            max: parseFloat(input.windMax.stringInputs.value[0]),
            directionStart: parseFloat(input.windDirStart.stringInputs.value[0]),
            directionEnd: parseFloat(input.windDirEnd.stringInputs.value[0])
        },
        swell: {
            min: parseFloat(input.swellMin.stringInputs.value[0]),
            max: parseFloat(input.swellMax.stringInputs.value[0]),
            periodMin: parseFloat(input.swellPeriodMin.stringInputs.value[0]),
            periodMax: parseFloat(input.swellPeriodMax.stringInputs.value[0]),
            directionStart: parseFloat(input.swellDirStart.stringInputs.value[0]),
            directionEnd: parseFloat(input.swellDirEnd.stringInputs.value[0])
        }
      };
    
    const sessions = getUserSessions();
    sessions.push(newSession);
    saveUserSessions(sessions);

    return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification().setText("✅ Session saved!"))
        .setNavigation(CardService.newNavigation().popToRoot().pushCard(buildSessionListCard()))
        .build();
}