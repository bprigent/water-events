
/**
 * Builds the add session card that contains a form to add a new session.
 */
function buildAddSessionCard(coordNote = "Type a location and press enter", formData = {}) {
    const nav = buildNavRow("New Session", []);

    const section = CardService.newCardSection()
        // Sport
        .addWidget(CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setFieldName("sport")
            .setTitle("Sport")
            .addItem("Surf", "surf", true)
            .addItem("Kitesurf", "kitesurf", false)
            .addItem("Windsurf", "windsurf", false)
            .addItem("Wing", "wing", false)
            .addItem("Paddle", "paddle", false))
        
        // Location
        .addWidget(CardService.newTextInput()
            .setFieldName("locationQuery")
            .setTitle("Search location (beach, city, etc.)")
            .setValue(formData.locationQuery || "")
            .setOnChangeAction(CardService.newAction().setFunctionName("handleLocationQueryChange")))

        // Location note
        .addWidget(CardService.newTextParagraph()
            .setText(typeof coordNote === "string" ? coordNote : "Type a location and press enter"))
        
        // Tide level %
        .addWidget(CardService.newTextParagraph()
            .setText("🌊 Tide levels are relative to the full tidal range: 0% = low tide, 100% = high tide."))
        .addWidget(CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setFieldName("tideMin")
            .setTitle("Tide Min %")
            .addItem("0%", "0", false)
            .addItem("25%", "25", false)
            .addItem("50%", "50", true)
            .addItem("75%", "75", false)
            .addItem("100%", "100", false))
        .addWidget(CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setFieldName("tideMax")
            .setTitle("Tide Max %")
            .addItem("0%", "0", false)
            .addItem("25%", "25", false)
            .addItem("50%", "50", false)
            .addItem("75%", "75", false)
            .addItem("100%", "100", true))

        // Tide direction
        .addWidget(CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setFieldName("tideDirection")
            .setTitle("Tide Direction")
            .addItem("Rising", "rising", true)
            .addItem("Falling", "falling", false))
        
        // Wind speed
        .addWidget(CardService.newTextInput().setFieldName("windMin").setTitle("Wind Min (knots)").setValue(0))
        .addWidget(CardService.newTextInput().setFieldName("windMax").setTitle("Wind Max (knots)").setValue(5))
        
        // Wind direction
        .addWidget(CardService.newTextParagraph()
            .setText("💨 Wind direction refers to where it is coming from. Example: ↙ SW = 225°"))
        .addWidget(CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setFieldName("windDirStart")
            .setTitle("Wind Direction Start")
            .addItem("↓ South (180°)", "180", false)
            .addItem("↙ SW (225°)", "225", false)
            .addItem("← West (270°)", "270", true)
            .addItem("↖ NW (315°)", "315", false)
            .addItem("↑ North (0°)", "0", false))
        .addWidget(CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setFieldName("windDirEnd")
            .setTitle("Wind Direction End")
            .addItem("↓ South (180°)", "180", false)
            .addItem("↙ SW (225°)", "225", false)
            .addItem("← West (270°)", "270", false)
            .addItem("↖ NW (315°)", "315", false)
            .addItem("↑ North (0°)", "0", true))

        // Swell
        .addWidget(CardService.newTextInput().setFieldName("swellMin").setTitle("Swell Min (m)").setValue(0.5))
        .addWidget(CardService.newTextInput().setFieldName("swellMax").setTitle("Swell Max (m)").setValue(3))
        .addWidget(CardService.newTextInput().setFieldName("swellPeriodMin").setTitle("Swell Period Min (s)").setValue(5))
        .addWidget(CardService.newTextInput().setFieldName("swellPeriodMax").setTitle("Swell Period Max (s)").setValue(15))

        // Swell direction
        .addWidget(CardService.newTextParagraph()
            .setText("🌊 Swell direction shows where the swell is coming from. Example: ↘ SE = 135°"))
        .addWidget(CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setFieldName("swellDirStart")
            .setTitle("Swell Direction Start")
            .addItem("↑ North (0°)", "0", true)
            .addItem("↘ SE (135°)", "135", false)
            .addItem("→ East (90°)", "90", false)
            .addItem("↙ SW (225°)", "225", false)
            .addItem("← West (270°)", "270", false))
        .addWidget(CardService.newSelectionInput()
            .setType(CardService.SelectionInputType.DROPDOWN)
            .setFieldName("swellDirEnd")
            .setTitle("Swell Direction End")
            .addItem("↑ North (0°)", "0", false)
            .addItem("↘ SE (135°)", "135", false)
            .addItem("→ East (90°)", "90", false)
            .addItem("↙ SW (225°)", "225", false)
            .addItem("← West (270°)", "270", true))

        // Save button
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

    // save the empty matches metadata for this new session
    const newIndex = sessions.length - 1;
    saveSessionMetadata(newIndex, {
    lastChecked: null,
    matches: []
    });

    return CardService.newActionResponseBuilder()
        .setNotification(CardService.newNotification().setText("✅ Session saved!"))
        .setNavigation(CardService.newNavigation().popToRoot().pushCard(buildSessionListCard()))
        .build();
}


/**
 * handle the location query change event.
 */
function handleLocationQueryChange(e) {
    const query = e.commonEventObject.formInputs.locationQuery?.stringInputs?.value[0] || "";
    let coordinates;
    let coordNote = "";
  
    try {
        coordinates = geocodeLocation(query);
        const lat = coordinates.lat.toFixed(4);
        const lon = coordinates.lon.toFixed(4);
        const mapsLink = `https://www.google.com/maps?q=${lat},${lon}`;
        coordNote = `📍 Found: Lat ${lat}, Lon ${lon} — <a href="${mapsLink}" target="_blank">View in Maps</a>`;
    } catch {
      coordNote = "❌ No coordinates found for this location.";
    }
  
    const formData = {
      locationQuery: query
    };
  
    return CardService.newActionResponseBuilder()
      .setNavigation(CardService.newNavigation().updateCard(buildAddSessionCard(coordNote, formData)))
      .build();
  }
  