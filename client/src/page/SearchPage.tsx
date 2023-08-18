import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import { palette } from "../styles/palette";
import { getRouteType } from "../util/Types";

const SearchPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeadContainer = styled.div`
  align-items: center;
  margin-top: 20px;
  margin-right: 110px;
  h2 {
    font-weight: 500;
    font-style: normal;
    color: #003f63;
  }
`;
const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;
const SearchInput = styled.div`
  display: flex;
  input {
    box-shadow: none;
    width: 300px;
    height: 52px;
    border-radius: 40px;
    border: 2px solid #dadada;
    padding-left: 20px;
    font-size: 16px;
  }
`;
const CurrentData = styled.div`
  width: 400px;
  margin-top: 30px;
  border-top: 2px solid #dadada;
`;

const RecentUsageTitle = styled.p`
  font-weight: 500;
  font-size: 14px;
  color: #9b9b9b;
  opacity: 0.5;
  margin: 20px 0 20px 0;
`;

const RecentUsageItem = styled.div`
  position: relative;
  width: 100%;
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
  gap: 6px;
`;

const StationName = styled.span`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #111111;
`;

const BusNumber = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #9b9b9b;
`;

const UsageDate = styled.span`
  font-weight: 500;
  font-size: 12px;
  line-height: 14px;
  color: #9b9b9b;
`;

const SearchResults = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  gap: 8px;
  margin-top: 20px;
`;

const SearchResultItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #9b9b9b;
`;

const SelectButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  width: 56px;
  height: 28px;
  background: #0080ca;
  border-radius: 4px;
  border: none;
  cursor: pointer;
`;

const SelectButtonText = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;
  color: #ffffff;
`;
interface Station {
  busRouteId: string;
  busRouteNm: string;
  routeType: string;
}

const API_KEY =
  "qeY/9Oi46a3oF+Go8FTjDu6Qw6/Seu+ULoQ6Anw4E5Ob1AUuYAd6sBzKkxiptwWuxwLfC9UyLcoIQc6jsq6Iuw==";

const SearchPage: React.FC = () => {
  const smallLogo = `${process.env.PUBLIC_URL}/small-logo.svg`;
  const nearbyStops = `${process.env.PUBLIC_URL}/nearby-stops.svg`;
  const recentUsageData = JSON.parse(
    localStorage.getItem("reservationHistories") || "[]"
  );

  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Station[]>([]);

  const navigate = useNavigate();

  const performSearch = () => {
    const queryParams = new URLSearchParams();
    queryParams.append("serviceKey", API_KEY);
    queryParams.append("strSrch", searchInput);
    queryParams.append("resultType", "json");

    fetch(
      `https://chacha-5eefb3d386a0.herokuapp.com/http://ws.bus.go.kr/api/rest/busRouteInfo/getBusRouteList?${queryParams.toString()}`
    )
      .then((response) => response.json())
      .then((jsonData) => {
        const busRoutes = jsonData.msgBody.itemList as Station[];
        if (busRoutes && busRoutes.length > 0) {
          setSearchResults(busRoutes);
          console.log(busRoutes);
        } else {
          setSearchResults([
            {
              busRouteId: "",
              busRouteNm: "",
              routeType: "",
            },
          ]);
        }
      })
      .catch((error) => {
        console.error("API request failed:", error);
      });
  };

  const handleStationClick = (busRouteId: string, routeType: string) => {
    // 버스번호검색
    navigate(`/bus-stops?busId=${busRouteId}&routeType=${routeType}`);
    console.log(busRouteId);
  };

  const handleNearbyClick = () => {
    navigate(`/nearby-stops`);
  };

  function formatDate(date: any) {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    return new Date(date).toLocaleDateString(
      undefined,
      options as Intl.DateTimeFormatOptions
    );
  }

  return (
    <SearchPageContainer>
      <HeadContainer>
        <img src={smallLogo} alt="작은 로고" />
        <h2>
          차차와 함께
          <br />
          저상버스 승하차 예약해요
        </h2>
      </HeadContainer>
      <SearchContainer>
        <SearchInput>
          <input
            type="text"
            id="searchInput"
            value={searchInput}
            placeholder="🔍 버스번호를 입력하세요."
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <Button
            fontSize="16px"
            fontColor="gray"
            id="submit"
            onClick={performSearch}
          >
            검색
          </Button>
        </SearchInput>
        <Button
          width="350px"
          height="200px"
          fontSize="22px"
          fontColor="white"
          style={{
            background: palette.linear,
            borderRadius: "20px",
          }}
          id="stationNameBtn"
          onClick={handleNearbyClick}
        >
          내 근처 버스 정류장 찾기
          <img src={nearbyStops} alt="버스정류장 로고" />
        </Button>
      </SearchContainer>
      <SearchResults>
        {searchResults.map((result, index) => (
          <SearchResultItem key={index}>
            {getRouteType(result.routeType)} | {result.busRouteNm}
            <SelectButton
              onClick={() =>
                handleStationClick(result.busRouteId, result.routeType)
              }
            >
              <SelectButtonText>선택</SelectButtonText>
            </SelectButton>
          </SearchResultItem>
        ))}
      </SearchResults>
      <CurrentData>
        <RecentUsageTitle>최근 이용내역</RecentUsageTitle>
        {recentUsageData.map((value: any, index: number) => (
          <RecentUsageItem key={index}>
            <RecentUsageText>
              <StationName>
                {value.depStationName} ➡️ {value.arrStationName}
              </StationName>
              <div style={{ display: "flex", alignItems: "center" }}>
                <BusNumber>
                  버스 번호: {value.busNumber} | 방향: {value.direction} |
                </BusNumber>
                <UsageDate> 이용일: {formatDate(value.reservedDate)}</UsageDate>
              </div>
            </RecentUsageText>
          </RecentUsageItem>
        ))}
      </CurrentData>
    </SearchPageContainer>
  );
};

export default SearchPage;
