const fs = require("fs");
const xmlbuilder = require("xmlbuilder");

function generateSUMOFiles(busNumber, startStation, destination, stops) {
  const networkFile = "network.net.xml";
  const routeFile = "assignment.rou.xml";

  console.log(`🚀 Generating SUMO file with Stop IDs: ${routeFile}`);

  // Create SUMO XML structure
  const routeXML = xmlbuilder
    .create("routes")
    .ele("vType", { id: "bus", accel: "1.0", decel: "1.0", length: "12", maxSpeed: "20" });

  const route = routeXML.ele("route", { id: `route_${busNumber}`, edges: stops.map((s) => s.id).join(" ") });

  // Find stop IDs instead of stop names
  const startStop = stops.find((s) => s.attributes.stop_name === startStation);
  const destinationStop = stops.find((s) => s.attributes.stop_name === destination);

  route
    .ele("vehicle", { id: `bus_${busNumber}`, type: "bus", route: `route_${busNumber}`, depart: "0" })
    .ele("stop", { busStop: startStop ? startStop.attributes.stop_id : "UNKNOWN", duration: "10" })
    .ele("stop", { busStop: destinationStop ? destinationStop.attributes.stop_id : "UNKNOWN", duration: "10" });

  // Save the XML file
  fs.writeFileSync(routeFile, routeXML.end({ pretty: true }));
  console.log(`✅ SUMO route file generated with Stop IDs: ${routeFile}`);
}

module.exports = { generateSUMOFiles };