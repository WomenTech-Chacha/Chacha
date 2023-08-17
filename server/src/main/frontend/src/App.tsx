import React from "react";
import ReservePage from "./page/ReservePage";
import StationList from "./page/StationList";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import SearchPage from "./page/SearchPage";
import StationArrivalInfoPage from "./page/StationArrivalInfoPage";
import OnboardingPage from "./page/OnboardingPage";
import NearbyStationPage from "./page/NearbyStationPage";
import Home from "./page/Home";
import Review from "./page/Review";
import TypeSelectPage from "./page/TypeSelectPage";
import Button from "./components/Button";

const arrow = `${process.env.PUBLIC_URL}/arrow-left.svg`;
const MyBackButton = () => {
  const navigate = useNavigate();
  const onClickBtn = () => {
    navigate(-1);
  };

  // 첫페이지일때는 뒤로가기 버튼이 없음
  if (
    window.location.pathname === "/" ||
    window.location.pathname === "/search" ||
    window.location.pathname === "/type-select"
  ) {
    return null;
  }
  return (
    <Button onClick={onClickBtn}>
      <img src={arrow} alt="뒤로가기 버튼" />
    </Button>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <MyBackButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/type-select" element={<TypeSelectPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/nearby-stops" element={<NearbyStationPage />} />
        <Route
          path="/station-arrival-info"
          element={<StationArrivalInfoPage />}
        />
        <Route path="/bus-stops" element={<StationList />} />
        <Route path="/reserve-page" element={<ReservePage />} />
        <Route path="/onboarding-page" element={<OnboardingPage />} />
        <Route path="/review-page" element={<Review />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
