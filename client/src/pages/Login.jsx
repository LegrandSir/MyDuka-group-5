// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginAPI } from "../services/api";
import logo from "../assets/mydukalogo-01.svg";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const data = await loginAPI(email, password);

      if (data.access_token) {
      login(data.user, data.access_token); // Use context login
      navigate("/dashboard");
    } else {
      setError(data.msg || "Login failed");
    }
  } catch {
    setError("Server error. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md bg-[#041524] rounded-2xl shadow-2xl p-8 border border-gray-700">
        <img src={logo} alt="Logo" className="mx-auto mb-4 w-20 h-20" />
        <h1 className="text-2xl font-bold text-white text-center mb-2">
          MY DUKA
        </h1>
        <p className="text-gray-300 text-sm text-center mb-6">
          Sign in to manage your inventory and track your business.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-700 bg-[#0a223a] text-white"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-700 bg-[#0a223a] text-white"
            required
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700 text-white"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}