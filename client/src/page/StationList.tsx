import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const API_KEY =
  "qeY/9Oi46a3oF+Go8FTjDu6Qw6/Seu+ULoQ6Anw4E5Ob1AUuYAd6sBzKkxiptwWuxwLfC9UyLcoIQc6jsq6Iuw==";

interface StationItem {
  direction: string;
  stationNm: string;
  stationNo: string;
  busRouteAbrv: string;
  seq: string;
  //   isBusLocation: boolean;
  //   isMoving: boolean;
}

interface SelectedStationItemProps {
  isSelected: boolean;
  isBusLocation: boolean;
  isMoving: boolean;
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
  const [stationList, setStationList] = useState<StationItem[]>([]);
  const location = useLocation();
  const busId = new URLSearchParams(location.search).get("busId");
  const [busNm, setBusNm] = useState<string>("");
  const [selectedStations, setSelectedStations] = useState<StationItem[]>([]);
  const [busLocationData, setBusLocationData] = useState<BusLocationData[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (busId) {
      getStationsByBusRouteId();
      fetchBusLocationData();
    }
  }, [busId]);

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
          const busPosData = jsonData.msgBody?.itemList;
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
          const stationList = jsonData.msgBody?.itemList;
          setStationList(stationList || []);
          const busNumber = stationList[0]?.busRouteAbrv || "";
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
      const endStation = selectedStations[1].stationNm;
      const busNumber = stationList[0]?.busRouteAbrv || "";
      navigate(
        `/reservation-page?busNumber=${busNumber}&startStation=${startStation}&endStation=${endStation}`
      );
    } else {
      // 2개를 선택하지 않았다면
      alert("Please select exactly 2 stations.");
    }
  };

  const handleResetClick = () => {
    setSelectedStations([]);
  };

  const stationsByDirection: { [key: string]: StationItem[] } = {};
  stationList.forEach((station) => {
    const direction = station.direction;
    if (!stationsByDirection[direction]) {
      stationsByDirection[direction] = [];
    }
    stationsByDirection[direction].push(station);
  });

  const mergedStationData = stationList.map((station) => {
    const busLocation = busLocationData.find(
      (location) => location.sectOrd === station.seq
    );
    const isBusLocation = busLocation?.stopFlag === "1";
    const isMoving =
      busLocation?.stopFlag === "0" && busLocation?.sectOrd === station.seq;

    return {
      ...station,
      isBusLocation,
      isMoving,
    };
  });

  return (
    <div>
      <h1>{busNm}번 버스</h1>
      {Object.keys(stationsByDirection).map((direction, index) => (
        <div key={index}>
          <h2>{direction}방면</h2>
          <div className="data">
            {mergedStationData.map((result, index) => (
              <SelectedStationItem
                key={index}
                onClick={() => handleStationClick(result)}
                isSelected={selectedStations.some(
                  (selectedStation) =>
                    selectedStation.stationNo === result.stationNo
                )}
                isBusLocation={result.isBusLocation}
                isMoving={result.isMoving}
              >
                {result.stationNm}
                {result.isMoving && " 🚌(이동중)"}
                {result.isBusLocation && " 🚌"}
                <button>선택</button>
              </SelectedStationItem>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleReservationClick}>예약 하기</button>
      <button onClick={handleResetClick}>다시선택하기</button>
    </div>
  );
};

export default StationList;
