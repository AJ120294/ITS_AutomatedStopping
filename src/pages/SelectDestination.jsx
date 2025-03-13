import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import "./SelectDestination.css";
import { fetchStopsForBus } from './api';

function SelectDestination() {
  const navigate = useNavigate();
  const location = useLocation();
  const startStation = location.state?.startStation || "Unknown"; // selected bus stop information(선택한 탑승 정류장 정보)

  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetchStations();
  }, []);

  /*
  const fetchStations = async () => {
    const data = ["Station 1", "Station 2", "Station 3", "Station 4", "Station 5"];
    setStations(data);
  };
  */
 const fetchStations = async () => {
     try {
       const busNumber = "70"; // Example bus number, change this dynamically if needed
       const stops = await fetchStopsForBus(busNumber); // Fetch actual stops from API
       if (stops.length > 0) {
         setStations(stops.map(stop => stop.attributes.stop_name)); // Extract and set stop names
       } else {
         setStations(["No stops found"]); // Display message if no stops are found
       }
     } catch (error) {
       console.error("Error fetching stops:", error);
     }
   };

  // once destination selected, move to next page(하차 정류장 선택 시 다음 페이지로 이동)
  const handleSelectDestination = (selectedStation) => {
    navigate("/map", { state: { startStation, destinationStation: selectedStation } });
  };

  return (
    <div className="container">
      <Header />
      <h2>Select Destination</h2>
      <p className="info">You boarded at: <strong>{startStation}</strong></p> {/*Selected bus stop appear, 선택한 탑승 정류장 표시 */}
      <ul className="station-list">
        {stations
          .filter(station => station !== startStation) // remove the bus stop where you board(탑승 정류장은 제외)
          .map((station, index) => (
            <li key={index} className="station-item" onClick={() => handleSelectDestination(station)}>
              {station}
            </li>
          ))}
      </ul>
    </div>
  );
}

export default SelectDestination;
