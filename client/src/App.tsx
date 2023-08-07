import React from "react";
import ReservationPage from "./page/ReservationPage";
import StationList from "./page/StationList";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";
import SearchPage from "./page/SearchPage";
import StationArrivalInfoPage from "./page/StationArrivalInfoPage";
import OnboardingPage from "./page/OnboardingPage";
import NearbyStationPage from "./page/NearbyStationPage";

const MyBackButton = () => {
  const navigate = useNavigate();
  const onClickBtn = () => {
    navigate(-1);
  };

  // 첫페이지일때는 뒤로가기 버튼이 없음
  if (window.location.pathname === "/") {
    return null;
  }

  return <button onClick={onClickBtn}>뒤로가기</button>;
};

const App = () => {
  return (
    <BrowserRouter>
      <MyBackButton />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/nearby-stops" element={<NearbyStationPage />} />
        <Route
          path="/station-arrival-info"
          element={<StationArrivalInfoPage />}
        />
        <Route path="/bus-stops" element={<StationList />} />
        <Route path="/reservation-page" element={<ReservationPage />} />
        <Route path="/onboarding-page" element={<OnboardingPage />} />
      </Routes>
      <nav>
        <ul>
          <li>
            <Link to="/">처음으로</Link>
          </li>
          <li>
            <Link to="/reservation-page">예약현황</Link>
          </li>
        </ul>
      </nav>
    </BrowserRouter>
  );
};

export default App;
