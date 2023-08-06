var mapContainer = document.getElementById('map'), // 지도를 표시할 div

    mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다


//사용자 현재위치로 이동
//let moveJatLon = new kakao.maps.LatLng()

if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function (position){
        let lat = position.coords.latitude, //위도
            lon = position.coords.longitude; // 경도

        let moveLatLon = new kakao.maps.LatLng(lat, lon);
        map.setCenter(moveLatLon);
    });

} else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다

    var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),
        message = 'geolocation을 사용할수 없어요..'

    displayMarker(locPosition, message);
}

//busStationMap에서 넘어온 "busStations" 값 활용
//예시
let busStations = [
    {
        "stop_TYPE": "중앙차로",
        "node_ID": 100000001,
        "stop_NO": 1001,
        "stop_NM": "종로2가사거리",
        "xcode": 126.987755,
        "ycode": 37.56981},
    {
        "stop_TYPE": "중앙차로",
        "node_ID": 100000002,
        "stop_NO": 1002,
        "stop_NM": "창경궁.서울대학교병원",
        "xcode": 126.99657,
        "ycode": 37.57918}
];

// 마커를 표시할 위치와 title 객체 배열입니다
var positions = [
    //반복 출력
    {
        title: busStations[0].stop_NM,
        latlng: new kakao.maps.LatLng(busStations[0].ycode, busStations[0].xcode)
    },
    {
        title: busStations[1].stop_NM,
        latlng: new kakao.maps.LatLng(busStations[1].ycode, busStations[1].xcode)
    },

];

// 마커 이미지의 이미지 주소입니다
var imageSrc = "busMarker.png";

for (var i = 0; i < positions.length; i ++) {

    // 마커 이미지의 이미지 크기 입니다
    var imageSize = new kakao.maps.Size(24, 35);

    // 마커 이미지를 생성합니다
    var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    // 마커를 생성합니다
    var marker = new kakao.maps.Marker({
        map: map, // 마커를 표시할 지도
        position: positions[i].latlng, // 마커를 표시할 위치
        title : positions[i].title, // 마커의 타이틀
        image : markerImage // 마커 이미지
    });

    //이벤트
    kakao.maps.event.addListener(marker, 'mouseover', makeOverListener(map, marker));
    kakao.maps.event.addListener(marker, 'mouseout', makeOutListener(marker));
}


//카카오지도 api 샘플에서 데려왔는데 마우스 올리면 이미지 커지게 하면 좋을 것 같은데 제가 해보려니까 잘 안되네요,,ㅠ
function makeOverListener(map, marker) {
    /*return function() {
      infowindow.open(map, marker);
    };*/
    //marker.image.target.style.transform = "scale(1.2)"
}

function makeOutListener(marker) {
    /*return function() {
      infowindow.close();
    };*/
}