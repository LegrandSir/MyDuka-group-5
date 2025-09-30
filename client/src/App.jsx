// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import RoleBasedDashboard from "./components/RoleBasedDashboard";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
         path="/dashboard"
         element={
        <PrivateRoute>
          <RoleBasedDashboard />
        </PrivateRoute>
        }
        />
      
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}