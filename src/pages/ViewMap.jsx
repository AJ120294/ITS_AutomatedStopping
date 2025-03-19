import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import "./ViewMap.css";
import { fetchStopsForBus } from "./api"; // ✅ API connection

//  Bus icon settings
const busIcon = new L.Icon({
  iconUrl: "/bus-icon.png", // Add bus icon in the public folder
  iconSize: [30, 30],
  iconAnchor: [15, 40],
  popupAnchor: [0, -30],
});

//  Bus stop marker icon settings
const stopIcon = new L.Icon({
  iconUrl: "/bus-icon.png", // Add bus stop icon
  iconSize: [20, 20],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

function ViewMap() {
  const location = useLocation();
  const { busNumber, startStation, destination } = location.state || {}; // Data received from the previous page

  //  State management (route data & bus stop locations)
  const [routeStops, setRouteStops] = useState([]); // List of bus stops for the selected bus
  const [mapCenter, setMapCenter] = useState({ lat: -36.8485, lng: 174.7633 }); // Default location (Auckland city center)

  //  Fetch the selected bus route from the API
  useEffect(() => {
    async function getRouteData() {
      if (!busNumber) return;
      
      const stops = await fetchStopsForBus(busNumber); // API call
      if (stops.length > 0) {
        const stopLocations = stops.map(stop => ({
          name: stop.attributes.stop_name, // Store bus stop name
          lat: stop.attributes.stop_lat,
          lng: stop.attributes.stop_lon
        }));

        setRouteStops(stopLocations);
        setMapCenter(stopLocations[0]); // Set the first bus stop as the map center

      
      }
    }
    getRouteData();
  }, [busNumber]);

  return (
    <div className="container">
      <Header />
      <h2>Hop on, Sit Back - The Bus Knows Where to Stop!</h2>

      {/*  Bus information UI */}
      <div className="bus-info">
        <div className="station left">
          <p className="station-label">Start Station</p>
          <p className="station-name">{startStation || "N/A"}</p>
        </div>
        
        {/* Bus image & bus number */}
        <div className="bus-container">
          <img src="src/assets/bus-image.png" alt="Bus" className="bus-image" />
          <div className="bus-number">{busNumber || "N/A"}</div>
        </div>
        
        <div className="station right">
          <p className="station-label">Destination</p>
          <p className="station-name">{destination || "N/A"}</p>
        </div>
      </div>

      {/*  Display actual map */}
      <MapContainer center={mapCenter} zoom={14} className="map">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/*  Display route line */ /* change drawing order (19/03/2025 Goun Han) */}
        {routeStops.length > 1 && (
          <Polyline positions={routeStops.map(stop => [stop.lat, stop.lng])} color="blue" weight={4} />
        )}

        {/*  Add bus stop markers & popups */ /* change stop icon (19/03/2025 Goun Han) */}
        {routeStops.map((stop, index) => (
          <CircleMarker
            key={index}
            center={[stop.lat, stop.lng]}
            radius={5}
            color="blue"  // 테두리 색
            fillColor="white"  // 내부 색
            fillOpacity={1}
          >
            <Popup>{stop.name}</Popup>
          </CircleMarker>
        ))}
        
      </MapContainer>
    </div>
  );
}

export default ViewMap;
