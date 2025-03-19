const fs = require("fs");
const xmlbuilder = require("xmlbuilder");

function generateSUMOFiles(busNumber, startStation, destination, stops) {
  const networkFile = "network.net.xml";
  const routeFile = "assignment.rou.xml";

  console.log(`🚀 Generating SUMO file with Stop IDs: ${routeFile}`);

  // Create SUMO XML structure
  const routeXML = xmlbuilder
    .create("routes")
    .att("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
    .att("xsi:noNamespaceSchemaLocation", "http://sumo.dlr.de/xsd/routes_file.xsd");

  // Add VTypes
  routeXML.ele("vType", { id: "BusType", vClass: "bus" });
  //routeXML.ele("vType", { id: "DEFAULT_VEHTYPE", vClass: "bus" });

  // Create the route element
  const route = routeXML.ele("route", {
    id: `route_${busNumber}`,
    edges: stops.map((s) => s.id).join(" ")
  });

  // Find start and destination stops
  const startStop = stops.find((s) => s.attributes.stop_name === startStation);
  const destinationStop = stops.find((s) => s.attributes.stop_name === destination);

  // Create the trip element for the vehicle
  const trip = routeXML.ele("trip", {
    id: `bus_${busNumber}`,
    type: "BusType",
    depart: "0.00",
    from: "5914-233d0cdc",
    to: "7049-24767414",
    via: stops.map((s) => s.id).join(" ") // Include all the stops for the route
  });

 // Add stops only at the startStop and destinationStop
  trip.ele("stop", { busStop: startStop.attributes.stop_id, duration: "5" });
  trip.ele("stop", { busStop: destinationStop.attributes.stop_id, duration: "5" });

  // Save the XML file
  fs.writeFileSync(routeFile, routeXML.end({ pretty: true }));
  console.log(`✅ SUMO route file generated with Stop IDs: ${routeFile}`);
}

module.exports = { generateSUMOFiles };
