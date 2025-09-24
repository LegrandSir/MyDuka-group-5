import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
// import Merchant from "./pages/MerchantDashboard"

function App() {
  return (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
  );
}

export default App;
