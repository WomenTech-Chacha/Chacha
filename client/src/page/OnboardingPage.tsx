import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useInterval from "../util/useInterval";
import styled from "styled-components";
import Button from "../components/Button";

const OnBoardingContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const Title = styled.div`
  font-size: 18px;
  margin-bottom: 16px;
  color: #9b9b9b;
`;

const SuccessMessage = styled.div`
  margin-bottom: 16px;
  width: 232px;
  font-weight: 500;
  font-size: 26px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #003f63;
`;

const DirectionButtons = styled.div`
  display: flex;
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
const StationContainer = styled.div`
  margin-bottom: 130px;
`;
const StationItem = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
  padding-left: 10px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;

  &.start-station {
    background-color: #34c34d;
    border-color: #34c34d;
    color: #f8f8f8;
  }
  &.end-station {
    background-color: #f9a825;
    border-color: #f9a825;
    color: #f8f8f8;
  }
`;
const StationWrapper = styled.div`
  display: flex;
  height: 30px;
  align-items: center;
  gap: 8px;
`;
const Status = styled.div`
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: #ededed;
`;

const ButtonWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100px; /* 높이를 조절해서 리스트가 가려지는 정도를 조절 */
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  background-color: #ffffff;
  bottom: 0;
  padding-top: 10px;
`;

interface StationItem {
  direction: string;
  stationNm: string;
  stationNo: string;
  station: string;
  busRouteAbrv: string;
  seq: string;
  isEditable: boolean; // 출발지 기준 3개 이후 정류장만 되게 한다
}

interface BusLocationData {
  seq: string;
  stopFlag: string;
  sectionId: string;
  lastStnId: string;
  sectOrd: string;
  plainNo: string;
  direction: string;
}

const API_KEY =
  "qeY/9Oi46a3oF+Go8FTjDu6Qw6/Seu+ULoQ6Anw4E5Ob1AUuYAd6sBzKkxiptwWuxwLfC9UyLcoIQc6jsq6Iuw==";
const POLLING_INTERVAL = 60000;
const OnboardingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedStationRef = useRef<null | HTMLDivElement>(null);
  const queryParams = new URLSearchParams(location.search);
  const busRouteId = queryParams.get("busRouteId"); //출발 정류장 고유아이디
  const arrStId = queryParams.get("arrStId"); //도착 정류장 고유아이디
  const plainNo = queryParams.get("plainNo");

  const [stationList, setStationList] = useState<StationItem[]>([]);
  const [busPositions, setBusPositions] = useState<BusLocationData[]>([]);
  const [selectedDirection, setSelectedDirection] = useState<string | null>(
    null
  );
  const [arrivalStId, setArrivalStId] = useState(arrStId); // 도착지를 변경하면, 바꾸기 위한 상태값
  const [editButtonClicked, setEditButtonClicked] = useState(false); // 도착지 변경 버튼 눌림 안눌림 상태값
  const [getoff, setGetoff] = useState(false);
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
    if (selectedStationRef.current) {
      selectedStationRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [busPositions, stationList, plainNo]);

  const getStationInfo = () => {
    const queryParams = new URLSearchParams();
    queryParams.append("serviceKey", API_KEY);
    queryParams.append("busRouteId", busRouteId || ""); // Use an empty string as a fallback
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
      `https://chacha-5eefb3d386a0.herokuapp.com/http://ws.bus.go.kr/api/rest/buspos/getBusPosByRtid?${queryParams.toString()}`
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

  const handleEditClick = () => {
    setEditButtonClicked(true); // 도착지 변경을 누름 상태로 변경
  };
  const handleSetClick = (stationId: string) => {
    setArrivalStId(stationId);
  };

  const handleArrivalComplete = () => {
    // 승하차 완료 버튼을 눌렀을 때 실행되는 함수
    navigate("/reserve-page");
    console.log("승하차 완료 처리");
  };

  const handleReview = () => {
    // 버스 이용후기 버튼을 눌렀을 때 실행되는 함수
    // 여기에서 버스 이용후기 작성 페이지로 이동하거나 관련 처리를 수행할 수 있습니다.
    navigate("/review-page");
    console.log("버스 이용후기 작성 페이지 이동");
  };

  useInterval(() => {
    // 1분마다 버스 위치 정보 가져오기
    getBusPos();

    // 버스 위치와 도착 역이 같은지 확인
    const matchingBusPosition = busPositions.find(
      (busPosition) =>
        busPosition.lastStnId === arrivalStId && busPosition.plainNo === plainNo
    );

    if (matchingBusPosition) {
      // 같아지면 getoff를 참으로 변경
      setGetoff(true);
      console.log("내릴시간입니다");
    }
  }, POLLING_INTERVAL);

  // if (matchingBusPosition === arrivalStId) 일 때, 승하차 완료 + 버스 이용후기 버튼 나오게
  // 추가로 구현해야하는 건? 버스 현재위치 정보 새로고침.... 우선 새로고침 버튼?

  return (
    <OnBoardingContainer>
      <Title>경로확인</Title>
      <SuccessMessage>안전하게 이동중이에요</SuccessMessage>
      <DirectionButtons>
        {directionNames.map((direction, index) => (
          <DirectionButton
            key={index}
            className={direction === selectedDirection ? "selected" : ""}
            onClick={() => handleDirectionClick(direction)}
          >
            {direction} 방면
          </DirectionButton>
        ))}
      </DirectionButtons>
      <StationContainer>
        {filteredStations.map((station, index) => {
          const matchingBusPosition = busPositions.find(
            (busPosition) =>
              busPosition.sectOrd === station.seq &&
              busPosition.plainNo === plainNo
          );
          const isArrivalStation = station.station === arrStId;

          // const isArrival = () => {
          //   if (matchingBusPosition)
          //     if (matchingBusPosition.sectionId === arrStId) setGetoff(true);
          // };

          // const canEditButtons = filteredStations.map((item, index) =>
          //   matchingBusPosition ? (
          //     Number(matchingBusPosition.sectOrd) + 2 < Number(item.seq) ? (
          //       <button onClick={() => handleSetClick(item.station)}>
          //         {item.stationNm}
          //       </button>
          //     ) : (
          //       item.stationNm
          //     )
          //   ) : (
          //     item.stationNm
          //   )
          // );
          const busIcon = matchingBusPosition ? (
            matchingBusPosition.stopFlag === "1" ? (
              <Status>🚌 현재위치</Status>
            ) : (
              <Status>🚌 현재위치(이동중)</Status>
            )
          ) : (
            ""
          );

          return (
            <StationItem
              ref={busIcon ? selectedStationRef : null}
              key={index}
              className={`${busIcon ? "start-station" : ""} ${
                isArrivalStation ? "end-station" : ""
              }`}
            >
              <StationWrapper>
                {station.stationNm}
                {busIcon}
                {isArrivalStation && (
                  <>
                    <Status>
                      🚏 도착
                      <Button
                        width="40px"
                        height="20px"
                        buttonColor="lightgray"
                        fontSize="14px"
                        fontColor="black"
                        onClick={handleEditClick}
                      >
                        변경
                      </Button>
                    </Status>
                  </>
                )}
              </StationWrapper>
            </StationItem>
          );
        })}
      </StationContainer>
      <ButtonWrapper>
        <Button
          width="280px"
          height="60px"
          buttonColor="indigo"
          fontColor="white"
          fontSize="22px"
          borderRadius="40px"
          onClick={handleArrivalComplete}
        >
          승하차 완료
        </Button>
        <Button onClick={handleReview}>버스 이용후기</Button>
      </ButtonWrapper>
    </OnBoardingContainer>
  );
};

export default OnboardingPage;
