export const getRouteType = (routeType: string) => {
  switch (routeType) {
    case "1":
      return "공항";
    case "2":
      return "마을";
    case "3":
      return "간선";
    case "4":
      return "지선";
    case "5":
      return "순환";
    case "6":
      return "광역";
    case "7":
      return "인천";
    case "8":
      return "경기";
    case "9":
      return "폐지";
    case "0":
      return "공용";
    default:
      return "";
  }
};

export function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}`;
  return formattedDateTime;
}
