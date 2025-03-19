const fs = require('fs');

function generateSUMOFiles(busNumber, startStation, destination, stops) {
  const routeFile = './assignment.rou.xml';

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

  fs.readFile(routeFile, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return;
    }

    // Check for BusType in the <vType> section
    if (!data.includes('<vType id="BusType" vClass="bus"/>')) {
      console.log("Adding BusType to vType");
      const vTypeIndex = data.indexOf('<routes>');
      const newVType = '\n  <vType id="BusType" vClass="bus"/>';
      data = data.slice(0, vTypeIndex + 7) + newVType + data.slice(vTypeIndex + 7);
    }

    // Check if the <trip> for the bus already exists (Check if busNumber exists in trip ID)
    if (!data.includes(`<trip id="bus_${busNumber}"`)) {
      console.log(`Adding new trip for bus ${busNumber}`);
      
      // Find the start and destination stop IDs from the stops array
      const startStop = stops.find((s) => s.attributes.stop_name === startStation);
      const destinationStop = stops.find((s) => s.attributes.stop_name === destination);

      if (!startStop || !destinationStop) {
        console.error('Error: Could not find stop ID for start or destination stop.');
        return;
      }

      const newTrip = `
  <trip id="bus_${busNumber}" type="BusType" depart="0.00" from="${busFrom}" to="${busTo}" via="${busVia}">
    <stop busStop="${startStop.attributes.stop_id}" duration="5"/>
    <stop busStop="${destinationStop.attributes.stop_id}" duration="5"/>
  </trip>`;
      
      const tripIndex = data.indexOf('</routes>');
      data = data.slice(0, tripIndex) + newTrip + data.slice(tripIndex);
    }

    // Write the modified XML back to the file
    fs.writeFile(routeFile, data, (err) => {
      if (err) {
        console.error('Error writing file:', err);
      } else {
        console.log('SUMO files updated successfully.');
      }
    });
  });
}

module.exports = { generateSUMOFiles };
