import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Button from "../components/Button";
import "./SearchBus.css"; // Importing styles
import { fetchStopsForBus } from "./api"; // API function

function SearchBus() {
  const [busNumber, setBusNumber] = useState(""); // Selected bus number
  const [stations, setStations] = useState([]); // List of stops for selected bus
  const [startStation, setStartStation] = useState(""); // Selected start station
  const [destination, setDestination] = useState(""); // Selected destination
  const [loading, setLoading] = useState(false); // Loading state for fetching stops
  const navigate = useNavigate(); // Hook for navigation
  const busNumbers = ["18", "70"]; // List of available bus numbers

  // Fetch stops when a bus is selected
  useEffect(() => {
    if (busNumber) {
      fetchStations(busNumber);
    } else {
      setStations([]); // Reset stops if no bus selected
      setStartStation("");
      setDestination("");
    }
  }, [busNumber]);

  const fetchStations = async (selectedBus) => {
    setLoading(true);
    try {
      console.log(`Fetching stops for bus ${selectedBus}...`);
      const stops = await fetchStopsForBus(selectedBus); // API call

      if (stops.length > 0) {
        const stopNames = stops.map((stop) => stop.attributes?.stop_name || "Unknown Stop");
        setStations(stopNames);
      } else {
        setStations(["No stops found"]);
      }
    } catch (error) {
      console.error("Error fetching stops:", error);
      setStations(["Error fetching data"]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Confirm Journey
  const handleConfirm = () => {
    if (!busNumber) {
      alert("Please select a bus number.");
      return;
    }
    if (!startStation || startStation === "No stops found" || startStation === "Error fetching data") {
      alert("Please select a valid start station.");
      return;
    }
    if (!destination || destination === "No stops found" || destination === "Error fetching data") {
      alert("Please select a valid destination.");
      return;
    }
    if (startStation === destination) {
      alert("Start and destination cannot be the same.");
      return;
    }
    
    navigate("/map", {
      state: { busNumber, startStation, destination },
    });
  };

  return (
    <div className="container">
      <Header />
      <h2>Plan Your Journey</h2>

      {/* Bus Number Dropdown */}
      <div className="dropdown-container">
        <label>Bus Number:</label>
        <select value={busNumber} onChange={(e) => setBusNumber(e.target.value)} className="dropdown">
          <option value="">Select Your Bus</option>
          {busNumbers.map((bus) => (
            <option key={bus} value={bus}>
              {bus}
            </option>
          ))}
        </select>
      </div>

      {/* Display loading message */}
      {loading && <p>Loading stops...</p>}

      {/* Start Location Dropdown */}
      {stations.length > 0 && !loading && (
        <div className="dropdown-container">
          <label>Start Location:</label>
          <select value={startStation} onChange={(e) => setStartStation(e.target.value)} className="dropdown">
            <option value="">Select Your Start Location</option>
            {stations.map((station, index) => (
              <option key={index} value={station}>
                {station}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Destination Dropdown (appear once startStation selected) */}
      {startStation && startStation !== "No stops found" && startStation !== "Error fetching data" && (
        <div className="dropdown-container">
          <label>Destination:</label>
          <select value={destination} onChange={(e) => setDestination(e.target.value)} className="dropdown">
            <option value="">Select Your Destination</option>
            {stations
              .filter((station) => station !== startStation) // except start stop 
              .map((station, index) => (
                <option key={index} value={station}>
                  {station}
                </option>
              ))}
          </select>
        </div>
      )}

      {/* Confirm Journey Button */}
      <Button text="Confirm Journey" onClick={handleConfirm} />
    </div>
  );
}

export default SearchBus;
