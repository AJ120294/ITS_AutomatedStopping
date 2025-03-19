const fs = require('fs');

function generateSUMOFiles(busNumber, startStation, destination, stops) {
  const routeFile = '../Simulation/assignment.rou.xml';

  // Determine the 'from' and 'to' based on the bus number
  let busFrom, busTo;
  if (busNumber === "70") {
    busFrom = "6231-190b2aaa";
    busTo = "7020-65f1fc06";
  } else if (busNumber === "18") {
    busFrom = "5914-233d0cdc";
    busTo = "7049-24767414";
  } else {
    console.error("🚨 Unknown bus number! Please define correct values for 'from' and 'to'.");
    return;
  }

  // Prepare the stop IDs for the 'via' attribute
  const busVia = stops.map((s) => s.id).join(" ");

  // Find the start and destination stop IDs (Moved these outside so they're always available)
  const startStop = stops.find((s) => s.attributes.stop_name === startStation);
  const destinationStop = stops.find((s) => s.attributes.stop_name === destination);

  if (!startStop || !destinationStop) {
    console.error('🚨 Error: Could not find stop ID for start or destination stop.');
    return;
  }

  fs.readFile(routeFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    let changesMade = false;

    // Check for BusType in the <vType> section
    if (!data.includes('<vType id="BusType" vClass="bus"/>')) {
      console.log("Adding BusType to vType");
      const vTypeIndex = data.indexOf('<routes>');
      const newVType = '\n  <vType id="BusType" vClass="bus"/>';
      data = data.slice(0, vTypeIndex + 7) + newVType + data.slice(vTypeIndex + 7);
      changesMade = true;
    }

    // Check if the <trip> for the bus already exists
    const tripRegex = new RegExp(`<trip id="bus_${busNumber}"[^>]*>`, 'g');
    let match = tripRegex.exec(data);
    if (match) {
      console.log(`Found existing trip for bus ${busNumber}`);

      // If the trip exists, get the XML of the trip
      const tripStartIndex = match.index;
      const tripEndIndex = data.indexOf('</trip>', tripStartIndex) + 7;
      let tripXML = data.slice(tripStartIndex, tripEndIndex);

      // Add the new stops to the trip if they are not already there
      const stopRegex = /<stop busStop="([^"]+)"/g;
      let existingStops = [];
      let stopMatch;
      while ((stopMatch = stopRegex.exec(tripXML)) !== null) {
        existingStops.push(stopMatch[1]);
      }

      if (!existingStops.includes(startStop.attributes.stop_id)) {
        tripXML = tripXML.replace('</trip>', `   <stop busStop="${startStop.attributes.stop_id}" duration="5"/>\n  </trip>`);
        changesMade = true;
      }

      if (!existingStops.includes(destinationStop.attributes.stop_id)) {
        tripXML = tripXML.replace('</trip>', `   <stop busStop="${destinationStop.attributes.stop_id}" duration="5"/>\n  </trip>`);
        changesMade = true;
      }

      // Replace the original trip with the updated one
      data = data.slice(0, tripStartIndex) + tripXML + data.slice(tripEndIndex);
    } else {
      console.log(`Adding new trip for bus ${busNumber}`);

      // If the trip doesn't exist, create a new one
      const newTrip = `
  <trip id="bus_${busNumber}" type="BusType" depart="0.00" from="${busFrom}" to="${busTo}" via="${busVia}">
    <stop busStop="${startStop.attributes.stop_id}" duration="5"/>
    <stop busStop="${destinationStop.attributes.stop_id}" duration="5"/>
  </trip>`;
      
      const tripIndex = data.indexOf('</routes>');
      data = data.slice(0, tripIndex) + newTrip + data.slice(tripIndex);
      changesMade = true;
    }

    // Only write the file if changes were made
    if (changesMade) {
      fs.writeFile(routeFile, data, (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log('✅ SUMO files updated successfully.');
        }
      });
    } else {
      console.log('No changes made to the file.');
    }
  });
}

module.exports = { generateSUMOFiles };
