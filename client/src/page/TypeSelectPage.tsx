import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeadContainer = styled.div`
  align-items: center;
  margin-top: 20px;
  margin-right: 35px;

  h2 {
    font-size: 26px;
    font-weight: 500;
    color: #003f63;
  }
  div {
    font-size: 18px;
    font-weight: lighter;
    color: #9b9b9b;
  }
`;

const TypeSelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TypeButton = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
`;

const Icon = styled.span`
  margin-right: 10px;
`;

const TypeSelectPage = () => {
  const smallLogo = `${process.env.PUBLIC_URL}/small-logo.svg`;
  const wheelchair = `${process.env.PUBLIC_URL}/wheelchair.svg`;
  const electricWheelchair = `${process.env.PUBLIC_URL}/electric-wheelchair.svg`;
  const stroller = `${process.env.PUBLIC_URL}/stroller.svg`;
  const crutch = `${process.env.PUBLIC_URL}/crutch.svg`;
  const walker = `${process.env.PUBLIC_URL}/walker.svg`;
  const others = `${process.env.PUBLIC_URL}/others.svg`;

  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const handleTypeClick = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes((prev) => prev.filter((item) => item !== type));
    } else {
      setSelectedTypes((prev) => [...prev, type]);
    }
  };

  const handleConfirmClick = () => {
    if (selectedTypes.length > 0) {
      localStorage.setItem("selectedTypes", JSON.stringify(selectedTypes));
    }

    if (confirm("승차자 유형: " + selectedTypes) === true) {
      navigate("/search");
    } else {
      setSelectedTypes([]);
    }
  };

  return (
    <SelectContainer>
      <HeadContainer>
        <img src={smallLogo} alt="작은 로고" width={64} height={28} />
        <h2>승차자 유형을 선택하세요</h2>
        <div>버스기사님께 내 상황을 미리 전달해요</div>
      </HeadContainer>
      <TypeSelectContainer>
        <TypeButton>
          <Button
            width="157px"
            height="136px"
            borderColor="midgray"
            fontColor="gray"
            fontSize="16px"
            hasBorder={true}
            borderRadius="20px"
            isSelected={selectedTypes.includes("수동휠체어")}
            onClick={() => handleTypeClick("수동휠체어")}
          >
            <Icon>
              <img className="icon" src={wheelchair} alt="수동휠체어 아이콘" />
            </Icon>
            수동휠체어
          </Button>
          <Button
            width="157px"
            height="136px"
            borderColor="midgray"
            fontColor="gray"
            fontSize="16px"
            hasBorder={true}
            borderRadius="20px"
            isSelected={selectedTypes.includes("전동휠체어")}
            onClick={() => handleTypeClick("전동휠체어")}
          >
            <Icon>
              <img
                className="icon"
                src={electricWheelchair}
                alt="전동휠체어 아이콘"
              />
            </Icon>
            전동휠체어
          </Button>
          <Button
            width="157px"
            height="136px"
            borderColor="midgray"
            fontColor="gray"
            fontSize="16px"
            hasBorder={true}
            borderRadius="20px"
            isSelected={selectedTypes.includes("유아차")}
            onClick={() => handleTypeClick("유아차")}
          >
            <Icon>
              <img className="icon" src={stroller} alt="유아차 아이콘" />
            </Icon>
            유아차
          </Button>
          <Button
            width="157px"
            height="136px"
            borderColor="midgray"
            fontColor="gray"
            fontSize="16px"
            hasBorder={true}
            borderRadius="20px"
            isSelected={selectedTypes.includes("부상자")}
            onClick={() => handleTypeClick("부상자")}
          >
            <Icon>
              <img className="icon" src={crutch} alt="부상자 아이콘" />
            </Icon>
            부상자
          </Button>
          <Button
            width="157px"
            height="136px"
            borderColor="midgray"
            fontColor="gray"
            fontSize="16px"
            hasBorder={true}
            borderRadius="20px"
            isSelected={selectedTypes.includes("기타 보조기구")}
            onClick={() => handleTypeClick("기타 보조기구")}
          >
            <Icon>
              <img className="icon" src={walker} alt="기타 보조기구 아이콘" />
            </Icon>
            기타 보조기구
          </Button>
          <Button
            width="157px"
            height="136px"
            borderColor="midgray"
            fontColor="gray"
            fontSize="16px"
            hasBorder={true}
            borderRadius="20px"
            isSelected={selectedTypes.includes("그 외")}
            onClick={() => handleTypeClick("그 외")}
          >
            <Icon>
              <img className="icon" src={others} alt="그 외 아이콘" />
            </Icon>
            그 외
          </Button>
        </TypeButton>
        {selectedTypes.length > 0 && (
          <Button
            width="280px"
            height="60px"
            buttonColor="indigo"
            fontColor="white"
            fontSize="16px"
            borderRadius="40px"
            onClick={handleConfirmClick}
          >
            선택 완료
          </Button>
        )}
      </TypeSelectContainer>
    </SelectContainer>
  );
};

export default TypeSelectPage;
