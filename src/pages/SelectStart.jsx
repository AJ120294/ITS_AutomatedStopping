import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./SelectStart.css";
import { fetchStopsForBus } from "./api";

function SelectStart() {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]); // 정류장 목록 저장

  // Fetch bus stop data when component loads (정류장 데이터를 불러오는 함수)
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

  // Once bus stop selected, move to next page (정류장 선택 시, 다음 페이지로 데이터 전달)
  const handleSelectStation = (selectedStation) => {
    navigate("/destination", { state: { startStation: selectedStation } });
  };

  return (
    <div className="container">
      <Header />
      <h2>Select Start Station</h2>
      <div className="station-list-container"> {/* 🔥 스크롤 가능한 컨테이너 */}
        <ul className="station-list">
          {stations.map((station, index) => (
            <li key={index} className="station-item" onClick={() => handleSelectStation(station)}>
              {station}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SelectStart;
