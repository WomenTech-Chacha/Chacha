import { createGlobalStyle } from "styled-components";
import PretendardMedium from "../font/Pretendard-Medium.woff2";

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'PretendardMedium';
    src: local('PretendardMedium'), local('PretendardMedium');
    font-style: normal;
    src: url(${PretendardMedium}) format('woff2');
}
body {
  font-family: "PretendardMedium", Arial, sans-serif;
}
`;

export default GlobalStyle;
