import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import "./ViewMap.css";

// bus icon setting
const busIcon = new L.Icon({
  iconUrl: "/bus-icon.png", // in public folder, 
  iconSize: [40, 40], 
  iconAnchor: [20, 40], 
  popupAnchor: [0, -40],
});

function ViewMap() {
  const location = useLocation();
  const { startStation, destinationStation } = location.state || {};

  //  Bus location (Dummy Data)
  const [busPosition, setBusPosition] = useState({ lat: 37.7749, lng: -122.4194 });

  useEffect(() => {
    let index = 0;
    const route = [
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7755, lng: -122.4185 },
      { lat: 37.7760, lng: -122.4175 },
      { lat: 37.7770, lng: -122.4165 }, 
    ]; //  Dummy GPS Data (Later need to connect to API)

    const interval = setInterval(() => {
      if (index < route.length) {
        setBusPosition(route[index]); // Bus location update
        index++;
      } else {
        clearInterval(interval); // animation stop when it reach last location
      }
    }, 2000); // location change per 2 seconds(animation effect)

    return () => clearInterval(interval); 
  }, []);

  return (
    <div className="container">
      <Header />
      <h2>Bus Route</h2>
      <MapContainer center={busPosition} zoom={15} className="map">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={busPosition} icon={busIcon}>
          <p> Bus is moving...</p>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default ViewMap;
