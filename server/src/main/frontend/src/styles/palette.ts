export const palette = {
  orange: "#EC5515", // 에러
  yellow: "#FFCC30", // 즐겨찾기 별
  lightgreen: "#34C34D", // 승차
  green: "#64A637", // 지선버스
  blue: "#0080CA", // 선택, 하차
  indigo: "#003F63", // 글씨
  violet: "#6574ED", // 간선버스
  lightgray: "#F8F8F8", // 작은 섹션의 배경색
  midgray: "#EDEDED", // 작은 섹션 테두리
  gray: "#9B9B9B", // 글씨나 테두리
  white: "#FFFFFF",
  black: "#111111",
  linear: "linear-gradient(291.55deg, #34C34D -43.46%, #0080CA 97.67%)",
};

export type PaletteKeyTypes = keyof typeof palette;
