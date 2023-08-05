import React from "react";
import ReservationPage from "./page/ReservationPage";
import StationList from "./page/StationList";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import SearchPage from "./page/SearchPage";
import StationArrivalInfoPage from "./page/StationArrivalInfoPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route
          path="/station-arrival-info"
          element={<StationArrivalInfoPage />}
        />
        <Route path="/bus-stops" element={<StationList />} />
        <Route path="/reservation-page" element={<ReservationPage />} />
      </Routes>
      <nav>
        <ul>
          <li>
            <Link to="/">처음으로</Link>
          </li>
          <li>예약현황</li>
        </ul>
      </nav>
    </BrowserRouter>
  );
};

export default App;
