import {  Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
    </Routes>
  )
}

export default App