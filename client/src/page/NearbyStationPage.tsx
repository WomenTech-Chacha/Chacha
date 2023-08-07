import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const { kakao } = window as any;
const API_KEY =
  "qeY/9Oi46a3oF+Go8FTjDu6Qw6/Seu+ULoQ6Anw4E5Ob1AUuYAd6sBzKkxiptwWuxwLfC9UyLcoIQc6jsq6Iuw==";

interface StationItem {
  arsId: string;
  stationNm: string;
  stationId: string;
  gpsX: string;
  gpsY: string;
  //   isBusLocation: boolean;
  //   isMoving: boolean;
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
            `${process.env.PUBLIC_URL}/busMarker.png`,
            new kakao.maps.Size(24, 35)
          );
          const SelectedMarkerImage = new kakao.maps.MarkerImage(
            `${process.env.PUBLIC_URL}/selectedMarker.png`,
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
              if (!selectedMarker || selectedMarker !== marker) {
                // 클릭된 마커 객체가 null이 아니면
                // 클릭된 마커의 이미지를 기본 이미지로 변경하고
                !!selectedMarker && marker.setImage(markerImage);
                // 현재 클릭된 마커의 이미지는 클릭 이미지로 변경합니다
                marker.setImage(SelectedMarkerImage);
              }
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

  return <div id="map" style={{ width: "100%", height: "500px" }} />;
};

export default NearbyStationPage;
