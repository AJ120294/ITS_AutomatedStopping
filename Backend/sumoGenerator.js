const fs = require("fs");
const xmlbuilder = require("xmlbuilder");

function generateSUMOFiles(busNumber, startStation, destination, stops) {
    const networkFile = "network.net.xml";
    const routeFile = "assignment.rou.xml";

    console.log(`🚀 Generating SUMO file for bus_${busNumber} with Stop IDs: ${routeFile}`);

    // Define from and to values based on the bus number
    let busFrom, busTo;

    if (busNumber === "bus_70") {
        busFrom = "6231-190b2aaa";
        busTo = "7020-65f1fc06";
    } else if (busNumber === "bus_18") {
        busFrom = "5914-233d0cdc";
        busTo = "7049-24767414";
    } else {
        console.error("🚨 Unknown bus number! Please define correct values for 'from' and 'to'.");
        return;
    }

    // Load existing XML file if it exists
    let routeXML;
    if (fs.existsSync(routeFile)) {
        const xmlData = fs.readFileSync(routeFile, "utf8");
        routeXML = xmlbuilder.begin().ele("routes");
        routeXML.raw(xmlData.match(/<routes[^>]*>([\s\S]*)<\/routes>/)[1]);
    } else {
        // Create a new XML structure if the file does not exist
        routeXML = xmlbuilder
            .create("routes")
            .att("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
            .att("xsi:noNamespaceSchemaLocation", "http://sumo.dlr.de/xsd/routes_file.xsd");

        // Add VTypes
        routeXML.ele("vType", { id: "BusType", vClass: "bus" });
    }

    // Check if a trip for this bus already exists
    let existingTrip = routeXML.children.find(trip => trip.attributes && trip.attributes.id === `bus_${busNumber}`);

    if (!existingTrip) {
        // Create a new trip if none exists
        existingTrip = routeXML.ele("trip", {
            id: `bus_${busNumber}`,
            type: "BusType",
            depart: "0.00",
            from: busFrom,
            to: busTo,
            via: stops.map((s) => s.id).join(" ") // Include all stops for the route
        });
    }

    // Find start and destination stops
    const startStop = stops.find((s) => s.attributes.stop_name === startStation);
    const destinationStop = stops.find((s) => s.attributes.stop_name === destination);

    // Add stops to the existing trip
    if (startStop) {
        existingTrip.ele("stop", { busStop: startStop.attributes.stop_id, duration: "5" });
    }
    if (destinationStop) {
        existingTrip.ele("stop", { busStop: destinationStop.attributes.stop_id, duration: "5" });
    }

    // Save the updated XML file
    fs.writeFileSync(routeFile, routeXML.end({ pretty: true }));
    console.log(`✅ SUMO route file updated: ${routeFile}`);
}

module.exports = { generateSUMOFiles };
