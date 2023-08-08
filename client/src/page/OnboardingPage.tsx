import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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

interface BusLocationData {
  stopFlag: string;
  sectionId: string;
  sectOrd: string;
  plainNo: string;
  direction: string;
}

const API_KEY =
  "qeY/9Oi46a3oF+Go8FTjDu6Qw6/Seu+ULoQ6Anw4E5Ob1AUuYAd6sBzKkxiptwWuxwLfC9UyLcoIQc6jsq6Iuw==";

const OnboardingPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const busRouteId = queryParams.get("busRouteId");
  const arrStId = queryParams.get("arrStId");
  const plainNo = queryParams.get("plainNo");

  const [stationList, setStationList] = useState<StationItem[]>([]);
  const [busPositions, setBusPositions] = useState<BusLocationData[]>([]);
  const [arrivalStId, setArrivalStId] = useState(arrStId); // 도착지를 변경하면, 바꾸기 위한 상태값
  const [selectedDirection, setSelectedDirection] = useState<string | null>(
    null
  );

  const filteredStations = selectedDirection
    ? stationList.filter((station) => station.direction === selectedDirection)
    : [];

  useEffect(() => {
    getStationInfo(), getBusPos();
  }, [busRouteId, plainNo]);

  useEffect(() => {
    // 고른 버스의 현재 위치를 알려주는 데이터
    const matchingBusPosition = busPositions.find(
      (busPosition) => busPosition.plainNo === plainNo
    );

    if (matchingBusPosition) {
      const matchingStation = stationList.find(
        (station) => station.seq === matchingBusPosition.sectOrd
      );

      if (matchingStation) {
        setSelectedDirection(matchingStation.direction);
      }
    }
  }, [busPositions, stationList, plainNo]);

  const getStationInfo = () => {
    const queryParams = new URLSearchParams();
    queryParams.append("serviceKey", API_KEY);
    queryParams.append("busRouteId", busRouteId || ""); // Use an empty string as a fallback
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
          console.log(stationList);
        } else {
          setStationList([]);
        }
      })
      .catch((error) => {
        console.error("API request failed:", error);
      });
  };

  const getBusPos = () => {
    const queryParams = new URLSearchParams();
    queryParams.append("serviceKey", API_KEY);
    queryParams.append("busRouteId", busRouteId || ""); // Use an empty string as a fallback
    queryParams.append("resultType", "json");

    fetch(
      `http://ws.bus.go.kr/api/rest/buspos/getBusPosByRtid?${queryParams.toString()}`
    )
      .then((response) => response.json())
      .then((jsonData) => {
        const busPositions = jsonData.msgBody.itemList || [];
        setBusPositions(busPositions);
        console.log("버스위치", busPositions);
      })
      .catch((error) => {
        console.error("API request failed:", error);
        setBusPositions([]);
      });
  };

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
      <div>
        {directionNames.map((direction, index) => (
          <button key={index} onClick={() => handleDirectionClick(direction)}>
            {direction} 방면
          </button>
        ))}
      </div>
      <div>
        {filteredStations.map((station, index) => {
          const matchingBusPosition = busPositions.find(
            (busPosition) =>
              busPosition.sectOrd === station.seq &&
              busPosition.plainNo === plainNo
          );
          const isArrivalStation = station.station === arrStId;

          const busIcon = matchingBusPosition
            ? matchingBusPosition.stopFlag === "1"
              ? "🚌 현재버스위치"
              : "🚌 현재버스위치(이동중)"
            : "";

          return (
            <div key={index}>
              {/* Display station information here */}
              <p>
                {station.stationNm} {busIcon}
                {isArrivalStation && "🚌 도착정류장"}
              </p>
              {/* ... other station details */}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingPage;
