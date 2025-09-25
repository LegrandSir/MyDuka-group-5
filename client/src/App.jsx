import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
// import ClerkDashboard from "./pages/ClerkDashboard"

function App() {
  return (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
  );
}

export default App;
