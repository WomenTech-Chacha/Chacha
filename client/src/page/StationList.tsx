import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

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

  &.start-station {
    background-color: #34c34d;
    border-color: #34c34d;
    color: #ffffff;
  }

  &.end-station {
    background-color: #f9a825;
    border-color: #f9a825;
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
  const [selectStartStation, setSelectStartStation] =
    useState<StationItem | null>(null);
  const [selectEndStation, setSelectEndStation] = useState<StationItem | null>(
    null
  );
  const [busLocationData, setBusLocationData] = useState<BusLocationData[]>([]);
  const [selectedDirection, setSelectedDirection] = useState<string | null>(
    null
  );
  const [reservationId, setReservationId] = useState(""); // 예약 번호 상태

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
        setSelectStartStation(stationFind);
      }
    }
  }, [stId, stationList]);

  const fetchBusLocationData = () => {
    const queryParams = new URLSearchParams();
    queryParams.append("serviceKey", API_KEY);
    queryParams.append("busRouteId", busId || "");
    queryParams.append("resultType", "json");

    fetch(
      `https://chacha-5eefb3d386a0.herokuapp.com/http://ws.bus.go.kr/api/rest/buspos/getBusPosByRtid?${queryParams.toString()}`
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
      `https://chacha-5eefb3d386a0.herokuapp.com/http://ws.bus.go.kr/api/rest/busRouteInfo/getStaionByRoute?${queryParams.toString()}`
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
    // 이미 선택된 출발역이면 선택 취소
    if (selectStartStation && selectStartStation.station === station.station) {
      setSelectStartStation(null);
      return;
    }

    // 이미 선택된 도착역이면 선택 취소
    if (selectEndStation && selectEndStation.station === station.station) {
      setSelectEndStation(null);
      return;
    }

    // 출발역이 선택되지 않은 상태라면 출발역으로 선택
    if (!selectStartStation) {
      setSelectStartStation(station);
    } else if (!selectEndStation) {
      // 출발역은 선택되어 있으나 도착역이 선택되지 않은 상태라면 도착역으로 선택
      setSelectEndStation(station);
    }
  };

  const selectedPersonType = localStorage.getItem("selectedTypes");

  const handleReservationClick = async () => {
    // 2개를 선택한 값을 예약페이지로
    if (selectStartStation && selectEndStation) {
      // 출발과 도착 정류장이 선택되었을 때만 예약 페이지로 이동
      const startStation = selectStartStation.stationNm;
      const startStId = selectStartStation.station;
      const endStation = selectEndStation.stationNm;
      const endStId = selectEndStation.station;
      const busNumber = stationList[0].busRouteAbrv || "";
      const arrSeq = selectEndStation.seq;

      const reservationHistory = {
        direction: selectedDirection,
        depStationName: startStation,
        arrStationName: endStation,
        depStationNo: selectStartStation.stationNo,
        arrStationNo: selectEndStation.stationNo,
        depStation: startStId,
        arrStation: endStId,
        busNumber: busNumber,
        depSeq: selectStartStation.seq,
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
      alert("출발과 도착 정류장을 모두 선택해주세요");
    }

    const reservationData = {
      person_Type: selectedPersonType, // 선택한 유형(휠체어 등)
      in_Stop_NM: selectStartStation && selectStartStation.stationNm, // 탑승 정류장명
      bus_No: busNm, // 탑승 버스
      out_Stop_NM: selectEndStation && selectEndStation.stationNm, // 하차 정류장명
    };

    try {
      const response = await axios.post(
        `http://13.125.208.107:8081/reservation`,
        reservationData
      );
      const { reservation_Id } = response.data; // 서버에서 받은 예약 번호
      setReservationId(reservation_Id);

      if (response.status === 200) {
        console.log("Reservation submitted successfully");
        localStorage.setItem("reservation_Id", reservation_Id);
      } else {
        console.error("Failed to submit reservation");
      }
    } catch (error) {
      console.error("Error submitting reservation:", error);
    }
  };

  const handleResetClick = () => {
    setSelectStartStation(null);
    setSelectEndStation(null);
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
            className={`
    ${
      selectStartStation && selectStartStation.station === result.station
        ? "start-station"
        : ""
    }
    ${
      selectEndStation && selectEndStation.station === result.station
        ? "end-station"
        : ""
    }
  `}
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
