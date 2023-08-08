import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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

  const [arrivalInfo, setArrivalInfo] = useState<ArrivalInfo[]>([]);
  const [depBusInfo, setDepBusInfo] = useState<DepBusInfo[]>([]);
  const [fromNearbyStation, setFromNearbyStation] = useState(false);
  const [selectedVehId, setSelectedVehId] = useState("");
  const [selectedBusTime, setSelectedBusTime] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (startStId) {
      getLowArrivalInfo();
    }
    if (plainNo !== null) {
      setFromNearbyStation(true);
      setSelectedVehId(plainNo);
      setSelectedBusTime(true);
      console.log("버스번호있음");
    }
  }, [startStId, plainNo]);

  const getLowArrivalInfo = () => {
    const queryParams = new URLSearchParams();
    queryParams.append("serviceKey", API_KEY);
    queryParams.append("stId", startStId || ""); // Use an empty string as a fallback
    queryParams.append("pageNo", "1"); // Adjust the page number as needed
    queryParams.append("resultType", "json");

    fetch(
      `http://ws.bus.go.kr/api/rest/arrive/getLowArrInfoByStId?${queryParams.toString()}`
    )
      .then((response) => response.json())
      .then((jsonData) => {
        const msgHeader = jsonData.msgHeader;
        if (msgHeader && msgHeader.headerCd === "0") {
          const arrivalList = jsonData.msgBody.itemList as ArrivalInfo[];
          setArrivalInfo(arrivalList || []);
          console.log(arrivalList);
          const filteredDepBusInfo = arrivalList.filter(
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
      navigate("/"); // 처음 화면으로 이동
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
    <div>
      <h1>예약현황</h1>
      {depBusInfo.length === 0 ? (
        <p>예약 내역이 없습니다</p>
      ) : (
        depBusInfo.map((busInfo, index) => (
          <div key={index}>
            <p>예약버스: {busNumber}번 버스</p>
            <p>출발지: {startStation} 정류장</p>
            {fromNearbyStation ? (
              <span>
                {plainNo === busInfo.plainNo1 && (
                  <>출발지 버스 도착 예정시간: {busInfo.arrmsg1}</>
                )}
                {plainNo === busInfo.plainNo2 && (
                  <>출발지 버스 도착 예정시간: {busInfo.arrmsg2}</>
                )}
              </span>
            ) : (
              <span>
                출발지 버스 도착 예정시간:
                {busInfo.arrmsg1}
                <button
                  onClick={() => handleBusSelection(busInfo.plainNo1)}
                  disabled={!verifyMessage(busInfo.arrmsg1)}
                >
                  선택
                </button>
                |{busInfo.arrmsg2}
                <button
                  onClick={() => handleBusSelection(busInfo.plainNo2)}
                  disabled={!verifyMessage(busInfo.arrmsg2)}
                >
                  선택
                </button>
              </span>
            )}

            <p>도착지: {endStation} 정류장</p>
          </div>
        ))
      )}
      {selectedBusTime && (
        <button onClick={handleBoardingClick}>탑승완료</button>
      )}
      <button onClick={handleCancelClick}>예약취소</button>
    </div>
  );
};

export default ReservePage;
