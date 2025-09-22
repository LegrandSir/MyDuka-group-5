import Login from './pages/Login'
import {  Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
     
  )
}

export default App