import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../assets/my duka logo-01.svg"

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); 
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      {/* Header */}
      <header className="bg-[#041524] backdrop-blur-md border-b border-gray-900 px-6 py-4 flex justify-between items-center rounded-b-2xl shadow-2xl">
        {/* App name / logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="App Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-white">MY DUKA Inventory</h1>
        </div>

        {/* User info + role + logout */}
        <div className="flex items-center gap-4">
          {/* User email */}
          <div className="text-right">
            <p className="text-white font-medium">{user?.email || "User"}</p>
            <p className="text-gray-400 text-sm">ID: {user?.id}</p>
          </div>

          {/* Role badge */}
          <span
            className={`px-3 py-1 text-sm rounded ${
              user?.role === "clerk"
                ? "bg-blue-700 text-blue-200"
                : user?.role === "admin"
                ? "bg-green-700 text-green-200"
                : "bg-purple-700 text-purple-200"
            }`}
          >
            {user?.role?.toUpperCase()}
          </span>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}