import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReservationPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const startStation = queryParams.get("startStation");
  const endStation = queryParams.get("endStation");
  const busNumber = queryParams.get("busNumber");

  const navigate = useNavigate();

  const handleBoardingClick = () => {
    // navigate(
    //     `/onboarding-page?busId=${busId}`
    //   );
  };

  return (
    <div>
      <h1>예약현황</h1>
      <p>탑승예약: {busNumber}번 버스</p>
      <p>출발지: {startStation}</p>
      <p>도착지: {endStation}</p>
      <button>탑승완료</button>
      <button>예약취소</button>
    </div>
  );
};
export default ReservationPage;
