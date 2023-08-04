<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" session="true"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>title</title>
</head>

<script type="text/javascript">
    function success({ coords, timestamp }) {
        const latitude = coords.latitude;   // 위도
        const longitude = coords.longitude; // 경도

        let div = document.getElementsByTagName('div');
        div[0].innerText = '위도: '+latitude+', 경도: '+longitude+', 위치 반환 시간: '+timestamp;
    }

    function getUserLocation() {
        if (!navigator.geolocation) {
            throw "위치 정보가 지원되지 않습니다.";
        }
        //watchPosition 실시간 반환은 아님 위치에 변화가 발생하면 호출됨(실시간으로 동작하는 것처럼 보임)
        navigator.geolocation.watchPosition(success);
    }

    getUserLocation();
</script>
<body>
    <div></div>
    <div id="test">
        <c:forEach var="bus" items="${busStations}" begin="0" end="3">
            ${bus.STOP_NM}
        </c:forEach>

    </div>
    <div id="map" style="width:500px;height:400px;"></div>
    <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=c4825333343e68e22860e683376223ca"></script>
    <script>

        let container = document.getElementById('map');
        let options = {
            center: new kakao.maps.LatLng(37.556652, 126.945128),
            level: 3
        };

        let map = new kakao.maps.Map(container, options);
/*
        let moveJatLon = new kakao.maps.LatLng()

        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(function (position){
                let lat = position.coords.latitude, //위도
                    lon = position.coords.longitude; // 경도

                let moveLatLon = new kakao.maps.LatLng(lat, lon);
                map.setCenter(moveLatLon);
                //내 위치로 지도 이동하기 됨
/*
                var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
                    message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다

                // 마커와 인포윈도우를 표시합니다
                displayMarker(locPosition, message);

            });

        } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

            let locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
                message = 'geolocation을 사용할수 없어요..'

            displayMarker(locPosition, message);
        }*/
        //여기를 DB에서 넘어온 값으로 해야함,,,

        let positions = [
            <c:forEach var="bus" items="${busStations}" varStatus="status">
                <c:choose>
                    <c:when test="${status.last}">
                        {
                            title : '${bus.STOP_NM}',
                            content : '<div>${bus.STOP_NM}</div><span><fmt:formatNumber minIntegerDigits="5" type="number" value="${bus.STOP_NO}" /></span>',
                            latlng: new kakao.maps.LatLng(${bus.YCODE}, ${bus.XCODE})
                        }
                    </c:when>
                    <c:otherwise>
                        {
                            title : '${bus.STOP_NM}',
                            content : '<div>${bus.STOP_NM}</div><span><fmt:formatNumber minIntegerDigits="5" type="number" value="${bus.STOP_NO}" /></span>',
                            latlng: new kakao.maps.LatLng(${bus.YCODE}, ${bus.XCODE})
                        },
                    </c:otherwise>
                </c:choose>
            </c:forEach>
        ];

        let imageSrc = "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png";

        for (let i = 0; i < positions.length; i ++) {

            // 마커 이미지의 이미지 크기 입니다
            let imageSize = new kakao.maps.Size(24, 35);

            // 마커 이미지를 생성합니다
            let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

            // 마커를 생성합니다
            let marker = new kakao.maps.Marker({
                map: map, // 마커를 표시할 지도
                position: positions[i].latlng, // 마커를 표시할 위치
                title : positions[i].title, // 마커의 타이틀, 마커에 마우스를 올리면 타이틀이 표시됩니다
                image : markerImage // 마커 이미지
            });
            // 마커에 표시할 인포윈도우를 생성합니다
            let infowindow = new kakao.maps.InfoWindow({
                content: positions[i].content // 인포윈도우에 표시할 내용
            });

            //이벤트 등록
            kakao.maps.event.addListener(marker, 'click', makeOverListener(map, marker, infowindow));
            kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(infowindow));
        }

        // 인포윈도우를 표시하는 클로저를 만드는 함수입니다
        function makeOverListener(map, marker, infowindow) {
            return function() {
                infowindow.open(map, marker);
            };
        }

        // 인포윈도우를 닫는 클로저를 만드는 함수입니다
        function makeOutListener(infowindow) {
            return function() {
                infowindow.close();
            };
        }

        /*
                // 지도에 마커와 인포윈도우를 표시하는 함수입니다
                function displayMarker(locPosition, message) {

                    // 마커를 생성합니다
                    var marker = new kakao.maps.Marker({
                        map: map,
                        position: locPosition
                    });

                    var iwContent = message, // 인포윈도우에 표시할 내용
                        iwRemoveable = true;

                    // 인포윈도우를 생성합니다
                    var infowindow = new kakao.maps.InfoWindow({
                        content : iwContent,
                        removable : iwRemoveable
                    });

                    // 인포윈도우를 마커위에 표시합니다
                    infowindow.open(map, marker);

                    // 지도 중심좌표를 접속위치로 변경합니다
                    map.setCenter(locPosition);
                }*/
    </script>
</body>
</html>