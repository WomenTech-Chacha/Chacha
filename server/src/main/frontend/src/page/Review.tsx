import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import Button from "../components/Button";
import StarRating from "../components/StarRating";

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Title = styled.div`
  font-size: 18px;
  margin-bottom: 16px;
  color: #9b9b9b;
`;

const SubTitle = styled.div`
  margin-bottom: 16px;
  font-weight: 500;
  font-size: 26px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #003f63;
`;

const RecentUsageText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 312px;
  height: 54px;
  margin-bottom: 15px;
  font-size: 14px;
  color: #9b9b9b;
  border: none;
  background-color: #ededed;
  border-radius: 4px;
`;

const StationNm = styled.span`
  font-weight: 600;
  font-size: 14px;
  color: #111111;
`;

const BusNumber = styled.span`
  font-weight: 500;
  font-size: 18px;
  color: #003f63;
`;

const ReviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #ffffff;
  border-radius: 25px;
`;

const ReviewSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 300px;
  justify-content: center;
  &.satisfaction {
    h2 {
      color: #003f63;
      font-size: 16px;
      font-weight: 500;
    }
  }
  &.dissatisfaction {
    h2 {
      color: #ec5515;
      font-size: 16px;
      font-weight: 500;
    }
    margin-bottom: 20px;
  }
`;

const ReviewCheckbox = styled.input`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  margin-right: 5px;
  width: 20px;
  height: 20px;
  border: 2px solid #9b9b9b;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  &:checked {
    background-color: #003f63;
  }
  &.dissatisfaction {
    &:checked {
      background-color: #ec5515;
    }
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  margin: 5px 0;
`;

const ButtonWrapper = styled.div`
  bottom: 10px;
  width: 100%;
  height: 100px; /* 높이를 조절해서 리스트가 가려지는 정도를 조절 */
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

const Review = () => {
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [satisfactions, setSatisfactions] = useState<string[]>([]);
  const [dissatisfactions, setDissatisfactions] = useState<string[]>([]);
  const [reservationHistory, setReservationHistory] = useState<any>(null);

  const reservationId = JSON.parse(
    localStorage.getItem("reservation_Id") || "[]"
  );

  useEffect(() => {
    const storedHistory = localStorage.getItem("reservationHistories");
    if (storedHistory) {
      const historyData = JSON.parse(storedHistory);
      setReservationHistory(historyData[0]);
      console.log(historyData);
    }
  }, []);

  const sendDataToServer = async (data: any) => {
    try {
      const response = await axios.post(
        "http://13.125.208.107:8081/review",
        data
      );

      if (response.status === 200) {
        console.log("Review submitted successfully");
      } else {
        console.error("Failed to submit review");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const handleSubmit = () => {
    const reviewData = {
      satis: JSON.stringify(satisfactions),
      dissatis: JSON.stringify(dissatisfactions),
      score: rating,
      review_Id: reservationId,
    };

    sendDataToServer(reviewData);
    if (
      !confirm(
        "만족: " +
          satisfactions +
          "\n불만족: " +
          dissatisfactions +
          "\n제출하시겠습니까?"
      )
    ) {
      // 아니오 일 경우
      setSatisfactions([]);
      setDissatisfactions([]);
    } else {
      navigate("/reserve-page");
    }
  };

  const handleSatisfactionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (e.target.checked) {
      setSatisfactions((prev) => [...prev, value]);
    } else {
      setSatisfactions((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleDissatisfactionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    if (e.target.checked) {
      setDissatisfactions((prev) => [...prev, value]);
    } else {
      setDissatisfactions((prev) => prev.filter((item) => item !== value));
    }
  };

  const handleHome = () => {
    navigate("/search");
  };

  return (
    <ReviewContainer>
      <Title>이용후기</Title>
      <SubTitle>버스 이용 후기를 작성해주세요</SubTitle>
      {reservationHistory && (
        <RecentUsageText>
          {reservationHistory.routeType}
          <BusNumber>{reservationHistory.busNumber}</BusNumber>
          <StationNm>
            {reservationHistory.depStationName} ➡️
            {reservationHistory.arrStationName}
          </StationNm>
        </RecentUsageText>
      )}
      <StarRating onRatingChange={(rating: number) => setRating(rating)} />
      <ReviewWrapper>
        <ReviewSection className="satisfaction">
          <h2>버스 이용 시 만족 사항</h2>
          <Label>
            <ReviewCheckbox
              type="checkbox"
              value="버스기사님의 친절한 응대"
              onChange={handleSatisfactionChange}
            />
            버스기사님의 친절한 응대
          </Label>
          <Label>
            <ReviewCheckbox
              type="checkbox"
              value="슬로프/안정장치"
              onChange={handleSatisfactionChange}
            />
            슬로프/안정장치
          </Label>
          <Label>
            <ReviewCheckbox
              type="checkbox"
              value="승하차 시 빠르고 안전하게 완료"
              onChange={handleSatisfactionChange}
            />
            승하차 시 빠르고 안전하게 완료
          </Label>
          <Label>
            <ReviewCheckbox
              type="checkbox"
              value="없음"
              onChange={handleSatisfactionChange}
            />
            없음
          </Label>
          <Label>
            <ReviewCheckbox
              type="checkbox"
              value="기타"
              onChange={handleSatisfactionChange}
            />
            기타
          </Label>
        </ReviewSection>
        <ReviewSection className="dissatisfaction">
          <h2>버스 이용 시 불만족 사항</h2>
          <Label>
            <ReviewCheckbox
              className="dissatisfaction"
              type="checkbox"
              value="버스 기사님의 응대"
              onChange={handleDissatisfactionChange}
            />
            버스 기사님의 응대
          </Label>
          <Label>
            <ReviewCheckbox
              className="dissatisfaction"
              type="checkbox"
              value="슬로프/안정장치 미흡"
              onChange={handleDissatisfactionChange}
            />
            슬로프/안정장치 미흡
          </Label>
          <Label>
            <ReviewCheckbox
              className="dissatisfaction"
              type="checkbox"
              value="탑승객의 부정적 반응"
              onChange={handleDissatisfactionChange}
            />
            탑승객의 부정적 반응
          </Label>
          <Label>
            <ReviewCheckbox
              className="dissatisfaction"
              type="checkbox"
              value="없음"
              onChange={handleDissatisfactionChange}
            />
            없음
          </Label>
          <Label>
            <ReviewCheckbox
              className="dissatisfaction"
              type="checkbox"
              value="기타"
              onChange={handleDissatisfactionChange}
            />
            기타
          </Label>
        </ReviewSection>
        <ButtonWrapper>
          <Button
            width="280px"
            height="60px"
            buttonColor="indigo"
            fontColor="white"
            fontSize="22px"
            borderRadius="40px"
            onClick={handleSubmit}
          >
            작성 완료
          </Button>
          <Button fontSize="16px" onClick={handleHome}>
            홈으로
          </Button>
        </ButtonWrapper>
      </ReviewWrapper>
    </ReviewContainer>
  );
};

export default Review;
