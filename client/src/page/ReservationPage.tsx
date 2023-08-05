import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

interface ArrivalInfo {
  stNm: string; // 정류장 이름
  arrmsg1: string; // 가장 가까운 버스 예상시간
  arrmsg2: string; //  두번째로 가까운 버스 예상시간
  routeType: string; // 버스 루트의 유형
  busRouteAbrv: string; // 버스 번호
  busRouteId: string; // 버스 루트 번호 (노선구분용 Id)
  vehId1: string; // 각 버스 고유 번호 - 데이터 넘겨주기 위함
  vehId2: string;
}

interface OneBusInfo {
  stNm: string; // 정류장 이름
  arrmsg1: string; // 가장 가까운 버스 예상시간
  arrmsg2: string; //  두번째로 가까운 버스 예상시간
  routeType: string; // 버스 루트의 유형
  busRouteAbrv: string; // 버스 번호
  busRouteId: string; // 버스 루트 번호 (노선구분용 Id)
  vehId1: string; // 각 버스 고유 번호 - 데이터 넘겨주기 위함
  vehId2: string;
}

const API_KEY =
  "qeY/9Oi46a3oF+Go8FTjDu6Qw6/Seu+ULoQ6Anw4E5Ob1AUuYAd6sBzKkxiptwWuxwLfC9UyLcoIQc6jsq6Iuw==";

const ReservationPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const startStation = queryParams.get("startStation");
  const endStation = queryParams.get("endStation");
  const busNumber = queryParams.get("busNumber");
  const stId = queryParams.get("startStId"); // Assuming you also have busId in the query params

  const [arrivalInfo, setArrivalInfo] = useState<ArrivalInfo[]>([]);
  const [oneBusInfo, setOneBusInfo] = useState<OneBusInfo[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (stId) {
      getLowArrivalInfo();
    }
  }, [stId]);

  const getLowArrivalInfo = () => {
    const queryParams = new URLSearchParams();
    queryParams.append("serviceKey", API_KEY);
    queryParams.append("stId", stId || ""); // Use an empty string as a fallback
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
          const filteredBusInfo = arrivalList.filter(
            (info) => info.busRouteAbrv === busNumber
          );
          setOneBusInfo(filteredBusInfo);
          console.log(filteredBusInfo);
        } else {
          setArrivalInfo([]);
          setOneBusInfo([]);
        }
      })
      .catch((error) => {
        console.error("API request failed:", error);
        setArrivalInfo([]);
        setOneBusInfo([]);
      });
  };

  const handleBoardingClick = () => {
    navigate(`/onboarding-page?busId=${stId}`);
  };

  return (
    <div>
      <h1>예약현황</h1>
      <p>탑승예약: {busNumber}번 버스</p>

      {oneBusInfo.map((busInfo, index) => (
        <div key={index}>
          <p>출발지: {startStation}</p>
          <span>
            출발지 버스 도착 예정시간: {busInfo.arrmsg1}|{busInfo.arrmsg2}
          </span>
          <p>도착지: {endStation}</p>
        </div>
      ))}
      <button onClick={handleBoardingClick}>탑승완료</button>
      <Link to="/reservation-cancel-page">
        <button>예약취소</button>
      </Link>
    </div>
  );
};

export default ReservationPage;
