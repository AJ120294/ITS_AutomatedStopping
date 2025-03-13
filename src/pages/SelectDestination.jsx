import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import "./SelectDestination.css";
import { fetchStopsForBus } from "./api";

function SelectDestination() {
  const navigate = useNavigate();
  const location = useLocation();
  const startStation = location.state?.startStation || "Unknown"; // 선택한 탑승 정류장 정보

  const [stations, setStations] = useState([]);

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      const busNumber = "70"; // 예제 버스 번호 (필요 시 변경 가능)
      const stops = await fetchStopsForBus(busNumber); // API에서 정류장 데이터 가져오기
      if (stops.length > 0) {
        setStations(stops.map((stop) => stop.attributes.stop_name)); // 정류장 이름만 저장
      } else {
        setStations(["No stops found"]); // 정류장이 없을 경우 메시지 표시
      }
    } catch (error) {
      console.error("Error fetching stops:", error);
    }
  };

  // 하차 정류장 선택 시 다음 페이지로 이동
  const handleSelectDestination = (selectedStation) => {
    navigate("/map", { state: { startStation, destinationStation: selectedStation } });
  };

  return (
    <div className="container">
      <Header />
      <h2>Select Destination</h2>
      <p className="info">
        You boarded at: <strong>{startStation}</strong>
      </p> {/* 선택한 탑승 정류장 표시 */}
      
      <div className="station-list-container"> {/* 🔥 스크롤 가능 컨테이너 추가 */}
        <ul className="station-list">
          {stations
            .filter((station) => station !== startStation) // 탑승 정류장은 제외
            .map((station, index) => (
              <li key={index} className="station-item" onClick={() => handleSelectDestination(station)}>
                {station}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}

export default SelectDestination;
