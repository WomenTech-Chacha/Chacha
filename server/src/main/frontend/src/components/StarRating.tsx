import React, { useState } from "react";
import styled from "styled-components";

const StarRatingContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 5px;
  font-family: PretendardVariable, Arial, sans-serif;
`;

const StarIcon = styled.img`
  width: 24px;
  height: 24px;
  cursor: pointer;

  &.selected {
    filter: grayscale(0); /* 이미지 색상 변경 */
  }
`;

interface StarRatingProps {
  onRatingChange: (rating: number) => void; // 새로 추가한 prop
}
const stars = `${process.env.PUBLIC_URL}/star.svg`;
const graystars = `${process.env.PUBLIC_URL}/gray-star.svg`;

const StarRating: React.FC<StarRatingProps> = (props) => {
  const [rating, setRating] = useState(0); // 별점을 상태로 관리

  const handleStarClick = (selectedRating: number) => {
    setRating(selectedRating);
    props.onRatingChange(selectedRating);
  };

  return (
    <div>
      <StarRatingContainer>
        {[1, 2, 3, 4, 5].map((num) => (
          <StarIcon
            key={num}
            src={num <= rating ? stars : graystars}
            alt="별점 이미지"
            className={num <= rating ? "selected" : ""}
            onClick={() => handleStarClick(num)}
          ></StarIcon>
        ))}
      </StarRatingContainer>
    </div>
  );
};

export default StarRating;
