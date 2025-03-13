const fs = require("fs");
const xmlbuilder = require("xmlbuilder");

function generateSUMOFiles(busNumber, startStation, destination, stops) {
  const networkFile = "network.net.xml";
  const routeFile = "bus_routes.rou.xml";

  // Generate Route File
  const routeXML = xmlbuilder
    .create("routes")
    .ele("vType", { id: "bus", accel: "1.0", decel: "1.0", length: "12", maxSpeed: "20" });

  const route = routeXML.ele("route", { id: `route_${busNumber}`, edges: stops.map((s) => s.id).join(" ") });

  route
    .ele("vehicle", { id: `bus_${busNumber}`, type: "bus", route: `route_${busNumber}`, depart: "0" })
    .ele("stop", { busStop: startStation, duration: "10" })
    .ele("stop", { busStop: destination, duration: "10" });

  // Save route file
  fs.writeFileSync(routeFile, routeXML.end({ pretty: true }));
  console.log(`Generated SUMO route file: ${routeFile}`);
}

module.exports = { generateSUMOFiles };
