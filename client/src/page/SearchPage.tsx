import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import styled from "styled-components";

interface Station {
  busRouteId: string;
  busRouteAbrv: string;
}

const API_KEY =
  "qeY/9Oi46a3oF+Go8FTjDu6Qw6/Seu+ULoQ6Anw4E5Ob1AUuYAd6sBzKkxiptwWuxwLfC9UyLcoIQc6jsq6Iuw==";

const SearchPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Station[]>([]);

  const navigate = useNavigate();

  const performSearch = () => {
    const queryParams = new URLSearchParams();
    queryParams.append("serviceKey", API_KEY);
    queryParams.append("strSrch", searchInput);
    queryParams.append("resultType", "json");

    fetch(
      `http://ws.bus.go.kr/api/rest/busRouteInfo/getBusRouteList?${queryParams.toString()}`
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
              busRouteAbrv: "",
            },
          ]);
        }
      })
      .catch((error) => {
        console.error("API request failed:", error);
      });
  };

  const handleStationClick = (busRouteId: string) => {
    // 버스번호검색
    navigate(`/bus-stops?busId=${busRouteId}`);
    console.log(busRouteId);
  };

  const handleNearbyClick = () => {
    navigate(`/nearby-stops`);
  };

  return (
    <div>
      <h1>Search Page</h1>
      <p>검색하는 페이지</p>
      <div>
        <input
          type="text"
          id="searchInput"
          value={searchInput}
          placeholder="버스번호를 입력하세요."
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button id="submit" onClick={performSearch}>
          검색하기
        </button>
      </div>
      <button id="stationNameBtn" onClick={handleNearbyClick}>
        내 근처 버스 정류장 찾기
      </button>

      <ul className="data">
        {searchResults.map((result, index) => (
          <li key={index}>
            {result.busRouteAbrv}{" "}
            <button onClick={() => handleStationClick(result.busRouteId)}>
              선택
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPage;
