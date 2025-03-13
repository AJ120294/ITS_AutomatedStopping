/*
export const fetchStations = async () => {
    // once API provided, add URL here, it is dummy data now, (나중에 팀원이 API를 제공하면 여기에 실제 URL 넣기)
    const response = await fetch("https://api.example.com/stations");
    const data = await response.json();
    return data;
  };
  

  export const fetchBusLocation = async (busId) => {
    // call Bus GPS(버스 GPS 데이터 가져오기)
    const response = await fetch(`https://api.example.com/bus/${busId}/location`);
    const data = await response.json();
    return data;
  };
*/

// api.js
import axios from 'axios';

const SUBSCRIPTION_KEY = '8666f374a7bb4b6dbd95f0145a08495f';

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

export { fetchRouteId, fetchTripId, fetchStops, fetchStopsForBus };
