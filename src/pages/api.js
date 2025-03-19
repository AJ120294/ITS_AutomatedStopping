import axios from 'axios';

const SUBSCRIPTION_KEY = '8666f374a7bb4b6dbd95f0145a08495f';
const BACKEND_URL = 'http://localhost:5000'; // ✅ Change if backend is hosted elsewhere

// Fetch Route ID by Bus Number
async function fetchRouteId(busNumber) {
  try {
    const response = await axios.get('https://api.at.govt.nz/gtfs/v3/routes', {
      params: { 'filter[route_short_name]': busNumber },
      headers: {
        'Accept': 'application/vnd.api+json',
        'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
      },
    });

    return response.data.data.length > 0 ? response.data.data[0].attributes.route_id : null;
  } catch (error) {
    console.error('Error fetching route ID:', error.message);
    return null;
  }
}

// Fetch Trip ID by Route ID
async function fetchTripId(routeId) {
  try {
    const response = await axios.get(`https://api.at.govt.nz/gtfs/v3/routes/${routeId}/trips`, {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
      },
    });

    return response.data.data.length > 0 ? response.data.data[0].attributes.trip_id : null;
  } catch (error) {
    console.error('Error fetching trip ID:', error.message);
    return null;
  }
}

// Fetch Stops by Trip ID
async function fetchStops(tripId) {
  try {
    const response = await axios.get(`https://api.at.govt.nz/gtfs/v3/trips/${tripId}/stops`, {
      headers: {
        'Accept': 'application/vnd.api+json',
        'Ocp-Apim-Subscription-Key': SUBSCRIPTION_KEY,
      },
    });

    return response.data.data || [];
  } catch (error) {
    console.error('Error fetching stops:', error.message);
    return [];
  }
}

// Fetch All Stops for a Specific Bus
async function fetchStopsForBus(busNumber) {
  const routeId = await fetchRouteId(busNumber);
  if (!routeId) return [];

  const tripId = await fetchTripId(routeId);
  if (!tripId) return [];

  return await fetchStops(tripId);
}

// ✅ NEW FUNCTION: Generate SUMO Files via Backend
async function generateSUMOFiles(busNumber, startStation, destination) {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/generate-sumo`, {
      busNumber,
      startStation,
      destination
    });

    return response.data; // Returns { message: "SUMO files generated successfully!" }
  } catch (error) {
    console.error('Error generating SUMO files:', error.message);
    return { error: "Failed to generate SUMO files." };
  }
}

export { fetchRouteId, fetchTripId, fetchStops, fetchStopsForBus, generateSUMOFiles };