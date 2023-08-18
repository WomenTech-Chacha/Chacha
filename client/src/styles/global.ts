import { createGlobalStyle } from "styled-components";
import PretendardMedium from "./font/Pretendard-Medium.woff2";
import PretendardRegular from "./font/Pretendard-Regular.woff2";
import PretendardLight from "./font/Pretendard-Light.woff2";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'PretendardMedium';
    src: local('PretendardMedium'), local('PretendardMedium');
    font-style: normal;
    src: url(${PretendardMedium}) format('woff2');
}

@font-face {
  font-family: 'PretendardRegular';
  src: local('PretendardRegular'), local('PretendardRegular');
  font-style: normal;
  src: url(${PretendardRegular}) format('woff2');
}

@font-face {
  font-family: 'PretendardLight';
  src: local('PretendardLight'), local('PretendardLight');
  font-style: normal;
  src: url(${PretendardLight}) format('woff2');
}

body {
  font-family: "PretendardRegular", Arial, sans-serif;
}
`;

export default GlobalStyle;
