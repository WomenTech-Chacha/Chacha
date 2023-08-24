import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import { getRouteType } from "../util/Types";

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

const BusText = styled.div`
  font-weight: 500;
  font-size: 26px;
  line-height: 34px;
  color: #003f63;
`;

const BusListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
`;

const BusItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 15px 8px 15px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
`;

const BusNumber = styled.div`
  font-weight: 500;
  font-size: 18px;
  color: #003f63;
`;

const BusType = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #9b9b9b;
`;

const ButtonSpan = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 5px;
`;

const Notice = styled.div`
  font-size: 14px;
`;

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
  plainNo1: string;
  plainNo2: string;
  stId: string; // 정류소 번호
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
      `https://chacha-test-proj.koyeb.app/http://ws.bus.go.kr/api/rest/arrive/getLowArrInfoByStId?${queryParams.toString()}`
    )
      .then((response) => response.json())
      .then((jsonData) => {
        const msgHeader = jsonData.msgHeader;
        if (msgHeader && msgHeader.headerCd === "0") {
          const arrivalList = jsonData.msgBody.itemList as ArrivalInfo[];
          setArrivalInfo(arrivalList || []);
          const stationName = arrivalList[0].stNm || "";
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

  const handleBusSelection = (
    busId: string,
    stId: string,
    plainNo: string,
    routeType: string
  ) => {
    navigate(
      `/bus-stops?busId=${busId}&stId=${stId}&plainNo=${plainNo}&routeType=${routeType}`
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
      <HeaderContainer>
        <HeaderText>버스 선택</HeaderText>
        <BusText>{stNm}</BusText>
      </HeaderContainer>
      {arrivalInfo.length > 0 ? (
        <BusListWrapper>
          {arrivalInfo.map((info, index) => (
            <BusItem key={index}>
              <div>
                <BusNumber>{info.busRouteAbrv}</BusNumber>
                <BusType>{getRouteType(info.routeType)}</BusType>
              </div>
              <ButtonSpan>
                <Notice>{info.arrmsg1}</Notice>
                <Button
                  width="56px"
                  height="28px"
                  buttonColor="green"
                  fontColor="white"
                  fontSize="14px"
                  onClick={() =>
                    handleBusSelection(
                      info.busRouteId,
                      info.stId,
                      info.plainNo1,
                      info.routeType
                    )
                  }
                  disabled={!verifyMessage(info.arrmsg1)}
                >
                  선택
                </Button>
                <Notice>{info.arrmsg2}</Notice>
                <Button
                  width="56px"
                  height="28px"
                  buttonColor="green"
                  fontColor="white"
                  fontSize="14px"
                  onClick={() =>
                    handleBusSelection(
                      info.busRouteId,
                      info.stId,
                      info.plainNo2,
                      info.routeType
                    )
                  }
                  disabled={!verifyMessage(info.arrmsg2)}
                >
                  선택
                </Button>
              </ButtonSpan>
            </BusItem>
          ))}
        </BusListWrapper>
      ) : (
        <p>도착예정 정보가 없습니다.</p>
      )}
    </div>
  );
};

export default StationArrivalInfoPage;
