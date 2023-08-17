import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import { getRouteType } from "../util/Types";

const Container = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 18px;
  margin-bottom: 16px;
`;
const HeaderContainer = styled.div`
  top: 20px;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const HeaderText = styled.div`
  font-weight: 400;
  font-size: 18px;
  line-height: 34px;
  color: #9b9b9b;
`;

const SubHeaderText = styled.div`
  font-weight: 500;
  font-size: 26px;
  line-height: 34px;
  color: #003f63;
`;

const DirectionButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 16px;
`;

const DirectionButton = styled.button`
  background-color: #ededed;
  color: #111111;
  border: none;
  border-radius: 4px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &.selected {
    background-color: #0080ca;
    color: #ffffff;
  }

  &:hover {
    background-color: #005e9c;
    color: #ffffff;
  }
`;

const StationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 130px;
`;

const StationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #f2f2f2;
  }

  &.selected {
    background-color: #34c34d;
    border-color: #34c34d;
    color: #ffffff;
  }
`;

const ButtonWrapper = styled.div`
  position: fixed;
  bottom: 10px;
  width: 100%;
  height: 100px; /* 높이를 조절해서 리스트가 가려지는 정도 조절 */
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const API_KEY =
  "qeY/9Oi46a3oF+Go8FTjDu6Qw6/Seu+ULoQ6Anw4E5Ob1AUuYAd6sBzKkxiptwWuxwLfC9UyLcoIQc6jsq6Iuw==";

interface StationItem {
  direction: string;
  stationNm: string;
  stationNo: string;
  station: string;
  busRouteAbrv: string;
  seq: string;
}

interface BusLocationData {
  stopFlag: string;
  sectionId: string;
  sectOrd: string;
}

const StationList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const busId = new URLSearchParams(location.search).get("busId");
  const stId = new URLSearchParams(location.search).get("stId");
  const plainNo = new URLSearchParams(location.search).get("plainNo");
  const routeType = new URLSearchParams(location.search).get(
    "routeType"
  ) as string;
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
      (selectedStation) => selectedStation.station === station.station
    );

    // 이미 선택된 것이라면 선택이 지워지게
    if (isStationSelected) {
      setSelectedStations((prevSelected) =>
        prevSelected.filter(
          (selectedStation) => selectedStation.station !== station.station
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
      const arrSeq = selectedStations[1].seq;

      const reservationHistory = {
        direction: selectedDirection,
        depStationName: startStation,
        arrStationName: endStation,
        depStationNo: selectedStations[0].stationNo,
        arrStationNo: selectedStations[1].stationNo,
        depStation: startStId,
        arrStation: endStId,
        busNumber: busNumber,
        depSeq: selectedStations[0].seq,
        arrSeq: arrSeq,
        reservedDate: new Date(),
        routeType: getRouteType(routeType),
      };

      // 로컬스토리지에 데이터 저장
      const reservationHistories = JSON.parse(
        localStorage.getItem("reservationHistories") || "[]"
      );
      reservationHistories.push(reservationHistory);
      localStorage.setItem(
        "reservationHistories",
        JSON.stringify(reservationHistories)
      );

      navigate(
        `/reserve-page?busNumber=${busNumber}&startStation=${startStation}&startStId=${startStId}&endStation=${endStation}&endStId=${endStId}&arrSeq=${arrSeq}&plainNo=${plainNo}`
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
    <Container>
      <HeaderContainer>
        <HeaderText>정류장 선택</HeaderText>
        <SubHeaderText>승하차 정류장을 선택하세요</SubHeaderText>
      </HeaderContainer>
      <Title>
        {getRouteType(routeType)}|{busNm}번 버스
      </Title>
      <DirectionButtons>
        {directionNames.map((direction, index) => (
          <DirectionButton
            key={index}
            onClick={() => handleDirectionClick(direction)}
            className={direction === selectedDirection ? "selected" : ""}
          >
            {direction} 방면
          </DirectionButton>
        ))}
      </DirectionButtons>
      <StationListContainer>
        {mergedStationData.map((result, index) => (
          <StationItem
            key={index}
            className={
              selectedStations.some(
                (selectedStation) => selectedStation.station === result.station
              )
                ? "selected"
                : ""
            }
            onClick={() => handleStationClick(result)}
          >
            {result.stationNm}
            {result.isMoving && " 🚌(이동중)"}
            {result.isBusLocation && " 🚌"}
          </StationItem>
        ))}
      </StationListContainer>
      <ButtonWrapper>
        <Button
          width="280px"
          height="60px"
          buttonColor="indigo"
          fontColor="white"
          fontSize="22px"
          borderRadius="40px"
          onClick={handleReservationClick}
        >
          예약하기
        </Button>
        <Button onClick={handleResetClick}>다시선택하기</Button>
      </ButtonWrapper>
    </Container>
  );
};

export default StationList;
