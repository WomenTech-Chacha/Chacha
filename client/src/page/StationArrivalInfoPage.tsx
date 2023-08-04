import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_KEY =
  "qeY/9Oi46a3oF+Go8FTjDu6Qw6/Seu+ULoQ6Anw4E5Ob1AUuYAd6sBzKkxiptwWuxwLfC9UyLcoIQc6jsq6Iuw==";

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

const StationArrivalInfoPage = () => {
  const location = useLocation();
  const stId = new URLSearchParams(location.search).get("stId");
  const [arrivalInfo, setArrivalInfo] = useState<ArrivalInfo[]>([]);
  const [stNm, setStNm] = useState<string>("");
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
        const msgHeader = jsonData?.msgHeader;
        if (msgHeader && msgHeader.headerCd === "0") {
          const arrivalList = jsonData?.msgBody?.itemList as ArrivalInfo[];
          setArrivalInfo(arrivalList || []);
          const stationName = arrivalList[0]?.stNm || "";
          setStNm(stationName);
          console.log(arrivalList);
        } else {
          setArrivalInfo([]);
        }
      })
      .catch((error) => {
        console.error("API request failed:", error);
        setArrivalInfo([]);
      });
  };

  const getRouteType = (routeType: string) => {
    switch (routeType) {
      case "1":
        return "공항";
      case "2":
        return "마을";
      case "3":
        return "간선";
      case "4":
        return "지선";
      case "5":
        return "순환";
      case "6":
        return "광역";
      case "7":
        return "인천";
      case "8":
        return "경기";
      case "9":
        return "폐지";
      case "0":
        return "공용";
      default:
        return "";
    }
  };

  const handleBusSelection = (busId: string) => {
    navigate(`/bus-stops?busId=${busId}`);
  };

  return (
    <div>
      <h1>{stNm}</h1>
      {arrivalInfo.length > 0 ? (
        <ul>
          {arrivalInfo.map((info, index) => (
            <li key={index}>
              {info.busRouteAbrv} | {getRouteType(info.routeType)} |{" "}
              {info.arrmsg1}{" "}
              <button onClick={() => handleBusSelection(info.busRouteId)}>
                선택
              </button>
              | {info.arrmsg2}
              <button onClick={() => handleBusSelection(info.busRouteId)}>
                선택
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No arrival information available.</p>
      )}
    </div>
  );
};

export default StationArrivalInfoPage;
