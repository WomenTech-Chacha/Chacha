import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const HomePage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #003f63;
  border-radius: 25px;
  color: #ffffff;
  padding: 20px;
  max-width: 400px;
  min-height: 600px;
  border: 1px solid #000000;
`;

const StartButton = styled.button`
  border-radius: 10px;
  margin: 10px auto;
  height: 30px;
  border: none;
  background-color: #0080ca;
  color: #ffffff;
  width: 157px;
  font-size: 16px;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const LogoImage = styled.img`
  width: ${(props) => props.width}px;
  height: auto;
  margin-bottom: 5px;
`;

const TitleText = styled.div`
  font-size: 22px;
  line-height: 38px;
  text-align: center;
  letter-spacing: -0.04em;
`;

const HomeContainer = styled.div`
  margin: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Home = () => {
  const navigate = useNavigate();
  const handleStartClick = () => {
    navigate("/type-select");
  };
  const logos = `${process.env.PUBLIC_URL}/bus-logo.svg`;
  const chacha = `${process.env.PUBLIC_URL}/logo.svg`;

  return (
    <HomeContainer>
      <HomePage>
        <LogoContainer>
          <LogoImage src={logos} width={40} alt="chacha-bus" />
          <LogoImage src={chacha} width={70} alt="chacha-font" />
        </LogoContainer>
        <TitleText>
          교통약자를 위한 <br />
          서울시 저상버스 승하차 예약 서비스
        </TitleText>
        <StartButton onClick={handleStartClick}>시작하기</StartButton>
      </HomePage>
    </HomeContainer>
  );
};

export default Home;
