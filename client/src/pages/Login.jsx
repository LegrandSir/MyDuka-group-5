import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.access_token) {
        // Save token
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to dashboard (or home page)
        navigate("/dashboard");
      } else {
        setError(data.msg || "Login failed");
      }
    } catch (err) {
      setError("Server error, please try again");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primaryBg px-4">
      <div className="w-full max-w-md bg-[#041524] rounded-2xl shadow-2xl p-8 border border-gray-700">
        <img
          src="./src/assets/my duka logo-01.svg"
          alt="Logo"
          className="mx-auto mb-4 w-20 h-20"
        />
        <h1 className="text-2xl font-bold text-white text-center">MY DUKA</h1>
        <p className="text-gray-300 text-sm text-center">
          Sign in to manage your inventory and track your business
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="email" className="block text-gray-200 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-700 bg-[#0a223a] text-white"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-gray-200 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded border border-gray-700 bg-[#0a223a] text-white"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
