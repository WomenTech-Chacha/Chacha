import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const API_KEY =
  "qeY/9Oi46a3oF+Go8FTjDu6Qw6/Seu+ULoQ6Anw4E5Ob1AUuYAd6sBzKkxiptwWuxwLfC9UyLcoIQc6jsq6Iuw==";

interface StationItem {
  direction: string;
  stationNm: string;
  stationNo: string;
  station: string;
  busRouteAbrv: string;
  seq: string;

  //   isBusLocation: boolean;
  //   isMoving: boolean;
}

interface SelectedStationItemProps {
  isSelected: boolean;
}

interface BusLocationData {
  stopFlag: string;
  sectionId: string;
  sectOrd: string;
}

const SelectedStationItem = styled.div<SelectedStationItemProps>`
  // 선택된 항목을 위한 스타일
  background-color: ${(props) => (props.isSelected ? "#007bff" : "#ffffff")};
  color: ${(props) => (props.isSelected ? "#ffffff" : "#000000")};

  cursor: pointer;
`;

const StationList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const busId = new URLSearchParams(location.search).get("busId");
  const stId = new URLSearchParams(location.search).get("stId");
  const plainNo = new URLSearchParams(location.search).get("plainNo");
  const [stationList, setStationList] = useState<StationItem[]>([]);
  const [busNm, setBusNm] = useState<string>("");
  const [selectedStations, setSelectedStations] = useState<StationItem[]>([]);
  const [busLocationData, setBusLocationData] = useState<BusLocationData[]>([]);
  const [selectedDirection, setSelectedDirection] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (busId) {
      getStationsByBusRouteId();
      fetchBusLocationData();
    }
  }, [busId]);

  useEffect(() => {
    if (stId && stationList.length > 0) {
      const stationFind = stationList.find(
        (station) => station.station === stId
      );
      if (stationFind) {
        setSelectedDirection(stationFind.direction);
        setSelectedStations([stationFind]);
      }
    }
  }, [stId, stationList]);

  const fetchBusLocationData = () => {
    const queryParams = new URLSearchParams();
    queryParams.append("serviceKey", API_KEY);
    queryParams.append("busRouteId", busId || "");
    queryParams.append("resultType", "json");

    fetch(
      `http://ws.bus.go.kr/api/rest/buspos/getBusPosByRtid?${queryParams.toString()}`
    )
      .then((response) => response.json())
      .then((jsonData) => {
        const msgHeader = jsonData.msgHeader;
        if (msgHeader && msgHeader.headerCd === "0") {
          const busPosData = jsonData.msgBody.itemList;
          setBusLocationData(busPosData || []);
          console.log("버스위치", busPosData);
        } else {
          setBusLocationData([]);
          console.error("API response error:", jsonData);
        }
      })
      .catch((error) => {
        console.error("API request failed:", error);
      });
  };

  const getStationsByBusRouteId = () => {
    const queryParams = new URLSearchParams();
    queryParams.append("serviceKey", API_KEY);
    queryParams.append("busRouteId", busId || "");
    queryParams.append("resultType", "json");

    fetch(
      `http://ws.bus.go.kr/api/rest/busRouteInfo/getStaionByRoute?${queryParams.toString()}`
    )
      .then((response) => response.json())
      .then((jsonData) => {
        const msgHeader = jsonData.msgHeader;
        if (msgHeader && msgHeader.headerCd === "0") {
          const stationList = jsonData.msgBody.itemList;
          setStationList(stationList || []);
          const busNumber = stationList[0].busRouteAbrv || "";
          setBusNm(busNumber);
          console.log(stationList);
        } else {
          setStationList([]);
        }
      })
      .catch((error) => {
        console.error("API request failed:", error);
      });
  };

  const handleStationClick = (station: StationItem) => {
    // 이미 선택된 역인지 확인
    const isStationSelected = selectedStations.some(
      (selectedStation) => selectedStation.stationNo === station.stationNo
    );

    // 이미 선택된 것이라면 선택이 지워지게
    if (isStationSelected) {
      setSelectedStations((prevSelected) =>
        prevSelected.filter(
          (selectedStation) => selectedStation.stationNo !== station.stationNo
        )
      );
    } else {
      //역이 아직 선택되어 있지 않고 선택된 역이 2개 미만인 경우 선택에 추가
      if (selectedStations.length < 2) {
        setSelectedStations((prevSelected) => [...prevSelected, station]);
      }
    }
  };

  const handleReservationClick = () => {
    // 2개를 선택한 값을 예약페이지로
    if (selectedStations.length === 2) {
      const startStation = selectedStations[0].stationNm;
      const startStId = selectedStations[0].station;
      const endStation = selectedStations[1].stationNm;
      const endStId = selectedStations[1].station;
      const busNumber = stationList[0].busRouteAbrv || "";
      navigate(
        `/reserve-page?busNumber=${busNumber}&startStation=${startStation}&startStId=${startStId}&endStation=${endStation}&endStId=${endStId}&plainNo=${plainNo}`
      );
    } else {
      // 2개를 선택하지 않았다면
      alert("Please select exactly 2 stations.");
    }
  };

  const handleResetClick = () => {
    setSelectedStations([]);
  };

  const filteredStations = selectedDirection
    ? stationList.filter((station) => station.direction === selectedDirection)
    : [];

  const mergedStationData = filteredStations.map((station) => {
    const busLocation = busLocationData.find(
      (location) => location.sectOrd === station.seq
    );
    const isBusLocation = busLocation && busLocation.stopFlag === "1";
    const isMoving = busLocation && busLocation.stopFlag === "0";

    return {
      ...station,
      isBusLocation,
      isMoving,
    };
  });

  const directionNames = Array.from(
    new Set(stationList.map((station) => station.direction))
  );

  const handleDirectionClick = (direction: string) => {
    if (selectedDirection !== direction) {
      setSelectedDirection(direction);
    }
  };

  return (
    <div>
      <h1>{busNm}번 버스</h1>
      <div>
        {directionNames.map((direction, index) => (
          <button key={index} onClick={() => handleDirectionClick(direction)}>
            {direction} 방면
          </button>
        ))}
      </div>
      <div>
        {mergedStationData.map((result, index) => (
          <SelectedStationItem
            key={index}
            onClick={() => handleStationClick(result)}
            isSelected={selectedStations.some(
              (selectedStation) =>
                selectedStation.stationNo === result.stationNo
            )}
          >
            {result.stationNm}
            {result.isMoving && " 🚌(이동중)"}
            {result.isBusLocation && " 🚌"}
            <button>선택</button>
          </SelectedStationItem>
        ))}
      </div>
      <button onClick={handleReservationClick}>예약 하기</button>
      <button onClick={handleResetClick}>다시선택하기</button>
    </div>
  );
};

export default StationList;
