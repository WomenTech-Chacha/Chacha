import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styled from "styled-components";

const SelectButton = styled.button<ButtonProps>`
  background-color: ${(props) => (props.isActive ? "#007bff" : "#ffffff")};
  color: ${(props) => (props.isActive ? "#ffffff" : "#000000")};
`;

interface Station {
  stId: string;
  stNm: string;
  station: string;
  stationNm: string;
  busRouteId: string;
  busRouteAbrv: string;
}

interface ButtonProps {
  isActive: boolean;
}

const API_KEY =
  "qeY/9Oi46a3oF+Go8FTjDu6Qw6/Seu+ULoQ6Anw4E5Ob1AUuYAd6sBzKkxiptwWuxwLfC9UyLcoIQc6jsq6Iuw==";

const SearchPage: React.FC = () => {
  const [isBusNumberSearch, setIsBusNumberSearch] = useState<boolean>(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Station[]>([]);
  const [isBusNumberButtonActive, setIsBusNumberButtonActive] =
    useState<boolean>(false);
  const [isStationNameButtonActive, setIsStationNameButtonActive] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const apiUrl = isBusNumberSearch
    ? "http://ws.bus.go.kr/api/rest/busRouteInfo/getBusRouteList"
    : "http://ws.bus.go.kr/api/rest/stationinfo/getLowStationByName";

  const performSearch = () => {
    const queryParams = new URLSearchParams();
    queryParams.append(isBusNumberSearch ? "strSrch" : "stSrch", searchInput);
    queryParams.append("resultType", "json");

    fetch(
      `${apiUrl}?serviceKey=${encodeURIComponent(
        API_KEY
      )}&${queryParams.toString()}`
    )
      .then((response) => response.json())
      .then((jsonData) => {
        if (isBusNumberSearch) {
          const busRoutes = jsonData.msgBody?.itemList as Station[];
          if (busRoutes && busRoutes.length > 0) {
            setSearchResults(busRoutes);
            console.log(busRoutes);
          } else {
            setSearchResults([
              {
                stId: "",
                stNm: "검색 결과가 없습니다.",
                station: "",
                stationNm: "검색 결과가 없습니다.",
                busRouteId: "",
                busRouteAbrv: "",
              },
            ]);
          }
        } else {
          const msgHeader = jsonData.msgHeader;
          if (msgHeader && msgHeader.headerCd === "0") {
            const stationList = jsonData.msgBody?.itemList as Station[];
            setSearchResults(stationList);
            console.log(stationList);
          } else {
            setSearchResults([
              {
                stId: "",
                stNm: "검색 결과가 없습니다.",
                station: "",
                stationNm: "검색 결과가 없습니다.",
                busRouteId: "",
                busRouteAbrv: "",
              },
            ]);
          }
        }
      })
      .catch((error) => {
        console.error("API request failed:", error);
      });
  };

  const setActiveButton = (buttonId: string) => {
    if (buttonId === "busNumberBtn") {
      setSearchResults([]);
      setIsBusNumberSearch(true);
      setIsBusNumberButtonActive(true);
      setIsStationNameButtonActive(false);
    } else if (buttonId === "stationNameBtn") {
      setSearchResults([]);
      setIsBusNumberSearch(false);
      setIsBusNumberButtonActive(false);
      setIsStationNameButtonActive(true);
    }
  };

  const handleStationClick = (
    stId: string,
    busRouteId: string,
    isBusNumberSearch: boolean
  ) => {
    if (isBusNumberSearch) {
      // 버스번호검색
      navigate(`/bus-stops?busId=${busRouteId}`);
      console.log(busRouteId);
    } else {
      // 정류장명 검색
      navigate(`/station-arrival-info?stId=${stId}`);
      console.log(stId);
    }
  };

  return (
    <div>
      <h1>Search Page</h1>
      <p>검색하는 페이지</p>
      <SelectButton
        id="busNumberBtn"
        className={isBusNumberSearch ? "active" : ""}
        onClick={() => setActiveButton("busNumberBtn")}
        isActive={isBusNumberButtonActive}
      >
        버스번호
      </SelectButton>
      <SelectButton
        id="stationNameBtn"
        className={!isBusNumberSearch ? "active" : ""}
        onClick={() => setActiveButton("stationNameBtn")}
        isActive={isStationNameButtonActive}
      >
        정류장이름
      </SelectButton>
      <input
        type="text"
        id="searchInput"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button id="submit" onClick={performSearch}>
        검색하기
      </button>
      <ul className="data">
        {searchResults.map((result, index) => (
          <li key={index}>
            {isBusNumberSearch ? result.busRouteAbrv : result.stNm}{" "}
            <button
              onClick={() =>
                handleStationClick(
                  result.stId,
                  result.busRouteId,
                  isBusNumberSearch
                )
              }
            >
              선택
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
