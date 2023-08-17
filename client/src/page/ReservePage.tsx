import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useInterval from "../util/useInterval";
import styled from "styled-components";
import { getCurrentDateTime, getRouteType } from "../util/Types";
import Button from "../components/Button";

const ReservationContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 18px;
  margin-top: 30px;
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

const CurrentTime = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  width: 350px;
  text-align: center;
  margin-bottom: 10px;
  border-top: 2px solid #ededed;
  border-bottom: 2px solid #ededed;
  font-weight: 400;
  font-size: 16px;
  color: #9b9b9b;
`;

const DepBusWrapper = styled.div`
  font-weight: 400;
  font-size: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  color: #9b9b9b;
`;
const DepBusInfo = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
`;
const DepBusNumber = styled.div`
  font-weight: 600;
  font-size: 30px;
  color: #64a637;
`;

const DepStation = styled.div`
  font-weight: 600;
  font-size: 30px;
  line-height: 38px;
  color: #111111;
`;

const BusInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 8px;
`;

const StationName = styled.div`
  display: flex;
  align-items: center;
  width: 300px;
  height: 60px;
  font-weight: 500;
  font-size: 16px;
  color: #111111;
  border: 1px solid #ededed;
  background-color: #ededed;
  border-radius: 40px;
  padding-left: 20px;
  padding-right: 20px;
  gap: 10px;
  img:last-child {
    margin-left: auto;
  }
`;

const ButtonWrapper = styled.div`
  position: fixed;
  bottom: 30px;
  width: 100%;
  height: 100px; /* 높이를 조절해서 리스트가 가려지는 정도를 조절하세요 */
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const ButtonSpan = styled.span`
  display: flex;
  gap: 5px;
  align-items: center;
`;

const NoReserveTitle = styled.div`
  display: flex;
  font-size: 18px;
  color: #9b9b9b;
  margin-top: 50px;
  margin-bottom: 50px;
  justify-content: center;
`;
const CurrentData = styled.div`
  width: 100%;
  left: 27px;
`;
const RecentUsageTitle = styled.p`
  font-weight: 500;
  font-size: 14px;
  line-height: 38px;
  color: #9b9b9b;
  opacity: 0.5;
  margin-bottom: 10px;
`;

const RecentUsageItem = styled.div`
  position: relative;
  height: 76px;
  margin-top: 8px;
  background: #f8f8f8;
  opacity: 0.5;
  border-radius: 8px;
  padding: 0 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RecentUsageText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const StationNm = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #111111;
`;

const BusNumber = styled.span`
  font-weight: 500;
  font-size: 12px;
  color: #9b9b9b;
`;
interface ArrivalInfo {
  stNm: string; // 정류장 이름
  arrmsg1: string; // 가장 가까운 버스 예상시간
  arrmsg2: string; //  두번째로 가까운 버스 예상시간
  routeType: string; // 버스 루트의 유형
  busRouteAbrv: string; // 버스 번호
  busRouteId: string; // 버스 루트 번호 (노선구분용 Id)
  vehId1: string; // 각 버스 고유 번호 - 데이터 넘겨주기 위함
  vehId2: string;
  plainNo1: string; // 차량 번호
  plainNo2: string;
  arsId: string; // 정류소 번호
  staOrd: string;
}

interface DepBusInfo {
  stNm: string; // 정류장 이름
  arrmsg1: string; // 가장 가까운 버스 예상시간
  arrmsg2: string; //  두번째로 가까운 버스 예상시간
  routeType: string; // 버스 루트의 유형
  busRouteAbrv: string; // 버스 번호
  busRouteId: string; // 버스 루트 번호 (노선구분용 Id)
  vehId1: string; // 각 버스 고유 번호 - 데이터 넘겨주기 위함
  vehId2: string;
  plainNo1: string; // 차량 번호
  plainNo2: string;
  arsId: string; // 정류소 번호
  staOrd: string;
}

const API_KEY =
  "qeY/9Oi46a3oF+Go8FTjDu6Qw6/Seu+ULoQ6Anw4E5Ob1AUuYAd6sBzKkxiptwWuxwLfC9UyLcoIQc6jsq6Iuw==";

const ReservePage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const startStation = queryParams.get("startStation");
  const endStation = queryParams.get("endStation");
  const busNumber = queryParams.get("busNumber");
  const startStId = queryParams.get("startStId");
  const endStId = queryParams.get("endStId");
  const plainNo = queryParams.get("plainNo");
  const arrSeq = queryParams.get("arrSeq");

  const startLogo = `${process.env.PUBLIC_URL}/start-station.svg`;
  const endLogo = `${process.env.PUBLIC_URL}/end-station.svg`;
  const startBox = `${process.env.PUBLIC_URL}/departure.svg`;
  const endBox = `${process.env.PUBLIC_URL}/arrival.svg`;

  const [arrivalInfo, setArrivalInfo] = useState<ArrivalInfo[]>([]);
  const [depBusInfo, setDepBusInfo] = useState<DepBusInfo[]>([]);
  const [selectedVehId, setSelectedVehId] = useState("");
  const [selectedBusTime, setSelectedBusTime] = useState(false);

  const navigate = useNavigate();

  const recentUsageData = JSON.parse(
    localStorage.getItem("reservationHistories") || "[]"
  );

  useEffect(() => {
    console.log(plainNo);
    if (startStId) {
      getLowArrivalInfo();
    }
    if (plainNo !== "null" && plainNo !== null) {
      setSelectedVehId(plainNo);
      setSelectedBusTime(true);
      console.log("버스번호있음");
    }
  }, [startStId, plainNo]);

  const getLowArrivalInfo = () => {
    const queryParams = new URLSearchParams();
    queryParams.append("serviceKey", API_KEY);
    queryParams.append("stId", startStId || "");
    queryParams.append("pageNo", "1");
    queryParams.append("resultType", "json");

    fetch(
      `http://ws.bus.go.kr/api/rest/arrive/getLowArrInfoByStId?${queryParams.toString()}`
    )
      .then((response) => response.json())
      .then((jsonData) => {
        const msgHeader = jsonData.msgHeader;
        if (msgHeader && msgHeader.headerCd === "0") {
          const departureList = jsonData.msgBody.itemList as DepBusInfo[];
          setArrivalInfo(departureList || []);
          console.log(departureList);
          const filteredDepBusInfo = departureList.filter(
            (info) => info.busRouteAbrv === busNumber
          );
          setDepBusInfo(filteredDepBusInfo);
          console.log("출발 버스 정보", filteredDepBusInfo);
        } else {
          setArrivalInfo([]);
          setDepBusInfo([]);
        }
      })
      .catch((error) => {
        console.error("API request failed:", error);
        setArrivalInfo([]);
        setDepBusInfo([]);
      });
  };

  const resetData = () => {
    setArrivalInfo([]);
    setDepBusInfo([]);
  };

  const handleCancelClick = () => {
    const confirmed = window.confirm("예약을 취소하시겠습니까?");
    if (confirmed) {
      resetData();
      navigate("/search"); // 검색 화면으로 이동
    }
  };

  const handleBusSelection = (plainNo: string) => {
    setSelectedVehId(plainNo);
    setSelectedBusTime(true);
  };

  const handleBoardingClick = () => {
    navigate(
      `/onboarding-page?busRouteId=${depBusInfo[0].busRouteId}&arrStId=${endStId}&plainNo=${selectedVehId}`
    );
  };

  useInterval(() => {
    getLowArrivalInfo();
  }, 60000);

  const verifyMessage = (value: string) => {
    let minutesSplit = value.split("분");
    if (
      value === "운행종료" ||
      value === "출발대기" ||
      value === "곧 도착" ||
      value === "회차대기"
    ) {
      // 버튼을 비활성화
      return false;
    } else if (Number(minutesSplit[0]) < 5) {
      // 버튼을 비활성화
      return false;
    } else {
      // 버튼 활성화
      return true;
    }
  };

  return (
    <ReservationContainer>
      <Title>예약내역</Title>
      {depBusInfo.length > 0 ? (
        <>
          <SuccessMessage>성공적으로 예약했어요</SuccessMessage>
          <CurrentTime>현재 시각 {getCurrentDateTime()}</CurrentTime>
        </>
      ) : (
        <>
          <CurrentTime>현재 시각 {getCurrentDateTime()}</CurrentTime>
        </>
      )}

      {depBusInfo.length === 0 ? (
        <div>
          <NoReserveTitle>현재 예약 내역이 없습니다</NoReserveTitle>
          <CurrentData className="current-data">
            {recentUsageData ? (
              <RecentUsageTitle>지난 예약내역</RecentUsageTitle>
            ) : (
              <></>
            )}
            {recentUsageData.length > 0 &&
              recentUsageData.map((value: any, index: any) => (
                <RecentUsageItem key={index}>
                  <RecentUsageText>
                    <StationNm>
                      {value.depStationName} ➡️ {value.arrStationName}
                    </StationNm>
                    <br />
                    <BusNumber>
                      버스 번호: {value.busNumber} 방향: {value.direction}
                    </BusNumber>
                  </RecentUsageText>
                </RecentUsageItem>
              ))}
          </CurrentData>
        </div>
      ) : (
        depBusInfo.map((busInfo, index) => (
          <div key={index}>
            <DepBusWrapper>
              {getRouteType(busInfo.routeType)}
              <DepBusInfo>
                <DepBusNumber>{busNumber}</DepBusNumber>
                <DepStation>{startStation}</DepStation>
              </DepBusInfo>
            </DepBusWrapper>
            <BusInfoContainer>
              <StationName>
                <img src={startLogo} alt="시작정류장 로고" />
                {startStation}
                <img src={startBox} alt="시작정류장" />
              </StationName>
              {selectedBusTime ? (
                <span>
                  {plainNo === busInfo.plainNo1 && <>{busInfo.arrmsg1}</>}
                  {plainNo === busInfo.plainNo2 && <>{busInfo.arrmsg2}</>}
                </span>
              ) : (
                <ButtonSpan>
                  {busInfo.arrmsg1}
                  <Button
                    width="56px"
                    height="28px"
                    buttonColor="green"
                    fontColor="white"
                    fontSize="14px"
                    onClick={() => handleBusSelection(busInfo.plainNo1)}
                    disabled={!verifyMessage(busInfo.arrmsg1)}
                  >
                    선택
                  </Button>

                  {busInfo.arrmsg2}
                  <Button
                    width="56px"
                    height="28px"
                    buttonColor="green"
                    fontColor="white"
                    fontSize="14px"
                    onClick={() => handleBusSelection(busInfo.plainNo2)}
                    disabled={!verifyMessage(busInfo.arrmsg2)}
                  >
                    선택
                  </Button>
                </ButtonSpan>
              )}

              <StationName>
                <img src={endLogo} alt="도착정류장 로고" />
                {endStation}
                <img src={endBox} alt="도착정류장" />
              </StationName>
              <>
                {Math.abs(Number(arrSeq) - Number(busInfo.staOrd))}개 정류장
                이동
              </>
            </BusInfoContainer>
          </div>
        ))
      )}
      {selectedBusTime && (
        <ButtonWrapper>
          <Button
            width="280px"
            height="60px"
            buttonColor="indigo"
            fontColor="white"
            fontSize="22px"
            borderRadius="40px"
            onClick={handleBoardingClick}
          >
            승차완료
          </Button>
          <Button onClick={handleCancelClick}>예약취소</Button>
        </ButtonWrapper>
      )}
    </ReservationContainer>
  );
};

export default ReservePage;
