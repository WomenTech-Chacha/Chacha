import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "PretendardVariable", "Arial", "sans-serif";
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

const { kakao } = window as any;
const API_KEY =
  "qeY/9Oi46a3oF+Go8FTjDu6Qw6/Seu+ULoQ6Anw4E5Ob1AUuYAd6sBzKkxiptwWuxwLfC9UyLcoIQc6jsq6Iuw==";

interface StationItem {
  arsId: string;
  stationNm: string;
  stationId: string;
  gpsX: string;
  gpsY: string;
}

const NearbyStationPage = () => {
  const navigate = useNavigate();
  const selectedMarker = useRef(null);
  const [stationList, setStationList] = useState<StationItem[]>([]);

  useEffect(() => {
    const mapContainer = document.getElementById("map");
    const mapOptions = {
      center: new kakao.maps.LatLng(37.53843986, 126.9558493),
      level: 3,
    };

    const map = new kakao.maps.Map(mapContainer, mapOptions);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        let lat = position.coords.latitude,
          lon = position.coords.longitude;

        let moveLatLon = new kakao.maps.LatLng(lat, lon);
        map.setCenter(moveLatLon);

        fetchNearbyBusData(map, lon, lat);
      });
    } else {
      let locPosition = new kakao.maps.LatLng(37.53843986, 126.9558493);
      let message: string = "geolocation을 사용할수 없어요..";
      console.log(locPosition, message);
    }
  }, []);

  const fetchNearbyBusData = (map: any, lon: number, lat: number) => {
    const queryParams = new URLSearchParams();
    queryParams.append("serviceKey", API_KEY);
    queryParams.append("tmX", lon.toString());
    queryParams.append("tmY", lat.toString());
    queryParams.append("radius", "800");
    queryParams.append("resultType", "json");

    fetch(
      `http://ws.bus.go.kr/api/rest/stationinfo/getStationByPos?${queryParams.toString()}`
    )
      .then((response) => response.json())
      .then((jsonData) => {
        const msgHeader = jsonData.msgHeader;
        if (msgHeader && msgHeader.headerCd === "0") {
          const stations = jsonData.msgBody.itemList; // 가져온 정류장 데이터
          console.log(stations);
          setStationList(stations);

          const markerImage = new kakao.maps.MarkerImage(
            `${process.env.PUBLIC_URL}/selected-marker.png`,
            new kakao.maps.Size(24, 35)
          );
          // 정류장 데이터를 반복하여 마커를 추가
          for (let i = 0; i < stations.length; i++) {
            const latlng = new kakao.maps.LatLng(
              stations[i].gpsY,
              stations[i].gpsX
            );

            const marker = new kakao.maps.Marker({
              position: latlng,
              map: map,
              title: stations[i].stationNm,
              image: markerImage,
            });

            let infowindow = new kakao.maps.InfoWindow({
              content: stations[i].stationNm, // 인포윈도우에 표시할 내용
            });

            kakao.maps.event.addListener(
              marker,
              "mouseover",
              makeOverListener(map, marker, infowindow)
            );
            kakao.maps.event.addListener(
              marker,
              "mouseout",
              makeOutListener(infowindow)
            );

            kakao.maps.event.addListener(marker, "click", function() {
              selectedMarker.current = marker;
              console.log(stations[i].stationId);
              handleStationClick(stations[i].stationId);
            });
          }
        } else {
          console.error("API request succeeded but no data returned.");
        }
      })
      .catch((error) => {
        console.error("API request failed:", error);
      });

    function makeOverListener(map: any, marker: any, infowindow: any) {
      return function() {
        infowindow.open(map, marker);
      };
    }

    // 인포윈도우를 닫는 클로저를 만드는 함수입니다
    function makeOutListener(infowindow: any) {
      return function() {
        infowindow.close();
      };
    }
    const handleStationClick = (stationId: string) => {
      navigate(`/station-arrival-info?stId=${stationId}`);
    };
  };
  return (
    <Container>
      {/* 스타일 컴포넌트로 생성한 스타일을 적용합니다 */}
      <HeaderContainer>
        <HeaderText>정류장 선택</HeaderText>
        <SubHeaderText>원하는 정류장을 선택하세요</SubHeaderText>
      </HeaderContainer>
      <div id="map" style={{ width: "100%", height: "400px" }} />
    </Container>
  );
};

export default NearbyStationPage;
