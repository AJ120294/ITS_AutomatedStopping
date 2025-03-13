import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./SelectStart.css";
import { fetchStopsForBus } from './api';

/*
function SelectStart() {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]); // Bus stop list (정류장 목록 초기값을 빈 배열로 설정!)

  //  call bus stop data(dummy data now), 정류장 데이터를 불러오는 함수 (현재는 더미 데이터)
  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      // Dummy Data now, need to connect API later(현재는 더미 데이터 (나중에 실제 API 연동 예정))
      const data = ["Station 1", "Station 2", "Station 3", "Station 4", "Station 5"];
      setStations(data);
    } catch (error) {
      console.error("정류장 데이터를 불러오는 중 오류 발생:", error);
    }
  };
  // once bus stop selected, move to next page(정류장 선택 시, 다음 페이지로 데이터 전달)
  const handleSelectStation = (selectedStation) => {
    navigate("/destination", { state: { startStation: selectedStation } });
  };

  return (
    <div className="container">
      <Header />
      <h2>Select Start Station</h2>
      <ul className="station-list">
        {stations.map((station, index) => (
          <li key={index} className="station-item" onClick={() => handleSelectStation(station)}>
            {station}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SelectStart;
*/

function SelectStart() {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]); // Bus stop list (정류장 목록 초기값을 빈 배열로 설정!)

  // Fetch bus stop data when component loads (정류장 데이터를 불러오는 함수)
  useEffect(() => {
    fetchStations();
  }, []);

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

  // Once bus stop selected, move to next page (정류장 선택 시, 다음 페이지로 데이터 전달)
  const handleSelectStation = (selectedStation) => {
    navigate("/destination", { state: { startStation: selectedStation } });
  };

  return (
    <div className="container">
      <Header />
      <h2>Select Start Station</h2>
      <ul className="station-list">
        {stations.map((station, index) => (
          <li key={index} className="station-item" onClick={() => handleSelectStation(station)}>
            {station}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SelectStart;
