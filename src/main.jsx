import React from "react";
import ReactDOM from "react-dom/client";
import AutoInsuranceIntake from "./Insurance.jsx";
import GasStationIntake    from "./GasStation.jsx";
import HotelIntake         from "./Hotel.jsx";

const path = window.location.pathname;

const App = () => {
  if (path.startsWith("/gas-station")) return <GasStationIntake />;
  if (path.startsWith("/hotel"))       return <HotelIntake />;
  return <AutoInsuranceIntake />;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
