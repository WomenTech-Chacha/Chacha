import React, { useEffect, useState } from "react";

const API_KEY =
  "qeY/9Oi46a3oF+Go8FTjDu6Qw6/Seu+ULoQ6Anw4E5Ob1AUuYAd6sBzKkxiptwWuxwLfC9UyLcoIQc6jsq6Iuw==";

const OnboardingPage = (props: any) => {
  const [busLocation, setBusLocation] = useState<any>(null);

  useEffect(() => {
    // Fetch the current location of the bus using the busId from the query params
    const busId = props.location.search.split("=")[1]; // Extract the busId from the query params
    const apiUrl = `http://ws.bus.go.kr/api/rest/buspos/getBusPosByVehId?serviceKey=${encodeURIComponent(
      API_KEY
    )}&vehId=${busId}&numOfRows=1&pageNo=1&resultType=json`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((jsonData) => {
        if (jsonData && jsonData.response) {
          setBusLocation(jsonData.response);
        }
      })
      .catch((error) => {
        console.error("API request failed:", error);
      });
  }, []);

  return (
    <div>
      <h1>OnboardingPage</h1>
      {busLocation ? (
        <div>
          <p>Bus ID: {busLocation.vehId}</p>
          <p>
            Bus Location: {busLocation.gpsX}, {busLocation.gpsY}
          </p>
          {/* Display other relevant bus location information */}
        </div>
      ) : (
        <p>Loading bus location...</p>
      )}
    </div>
  );
};

export default OnboardingPage;
