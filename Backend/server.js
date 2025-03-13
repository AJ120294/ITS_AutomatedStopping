const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const { generateSUMOFiles } = require("./sumoGenerator");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const SUBSCRIPTION_KEY = "8666f374a7bb4b6dbd95f0145a08495f";

// Fetch Route ID by Bus Number
async function fetchRouteId(busNumber) {
  try {
    const response = await axios.get(
      "https://api.at.govt.nz/gtfs/v3/routes",
      {
        params: { "filter[route_short_name]": busNumber },
        headers: {
          Accept: "application/vnd.api+json",
          "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
        },
      }
    );
    return response.data.data.length > 0
      ? response.data.data[0].attributes.route_id
      : null;
  } catch (error) {
    console.error("Error fetching route ID:", error.message);
    return null;
  }
}

// Fetch Stops
async function fetchStops(busNumber) {
  const routeId = await fetchRouteId(busNumber);
  if (!routeId) return [];

  try {
    const response = await axios.get(
      `https://api.at.govt.nz/gtfs/v3/routes/${routeId}/trips`,
      {
        headers: {
          Accept: "application/vnd.api+json",
          "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
        },
      }
    );

    if (response.data.data.length === 0) return [];

    const tripId = response.data.data[0].attributes.trip_id;
    const stopResponse = await axios.get(
      `https://api.at.govt.nz/gtfs/v3/trips/${tripId}/stops`,
      {
        headers: {
          Accept: "application/vnd.api+json",
          "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
        },
      }
    );

    return stopResponse.data.data || [];
  } catch (error) {
    console.error("Error fetching stops:", error.message);
    return [];
  }
}

// API Endpoint to fetch stops for a bus
app.get("/api/stops/:busNumber", async (req, res) => {
  const { busNumber } = req.params;
  const stops = await fetchStops(busNumber);
  res.json(stops);
});

// API Endpoint to generate SUMO files
app.post("/api/generate-sumo", async (req, res) => {
  const { busNumber, startStation, destination } = req.body;

  if (!busNumber || !startStation || !destination) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const stops = await fetchStops(busNumber);
  if (!stops.length) {
    return res.status(400).json({ error: "No stops found for this bus" });
  }

  generateSUMOFiles(busNumber, startStation, destination, stops);
  res.json({ message: "SUMO files generated successfully!" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use((req, res, next) => {
    console.log(`📥 Incoming request: ${req.method} ${req.url}`);
    console.log("📄 Request Body:", req.body);
    next();
  });
  