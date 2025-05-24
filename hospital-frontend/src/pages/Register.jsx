import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://hospitalm-9kap.onrender.com/api";

const Notification = ({ message, type }) => (
  <div
    className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
      type === "success"
        ? "bg-green-100 border-l-4 border-green-500 text-green-700"
        : "bg-red-100 border-l-4 border-red-500 text-red-700"
    }`}
  >
    {message}
  </div>
);

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const showNotification = (message, type = "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!name || !email || !password || !confirmPassword) {
      showNotification("Please fill all fields");
      return;
    }
    
    if (password !== confirmPassword) {
      showNotification("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${API_URL}/auth/register`, { name, email, password, confirmPassword });
      showNotification("Registered successfully", "success");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Registration Error:", error.response?.data || error.message);
      showNotification(error.response?.data?.message || "Error registering");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4">
      {notification.show && <Notification message={notification.message} type={notification.type} />}

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Create Your Account</h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4">
          <button
            onClick={handleGoogleSignUp}
            className="w-full flex items-center justify-center gap-2 bg-blue-400 text-white py-3 rounded-lg hover:bg-blue-500 transition-colors"
          >
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C34.1 32 30 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l6-6C34.2 5.2 29.4 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.8 0 20-8.2 20-21 0-1.2-.1-2.3-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.1 16.2 18.7 13 24 13c3.1 0 5.9 1.2 8 3.1l6-6C34.2 5.2 29.4 3 24 3 16.3 3 9.5 7.5 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 45c5.3 0 10.1-1.8 13.8-4.9l-6.4-5.2C29.8 36.4 27 37 24 37c-6.1 0-11.2-4-13-9.5l-6.5 5C9.4 41.5 16.1 45 24 45z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1.4 4-5.2 7-9.3 7-6.1 0-11.2-4-13-9.5l-6.5 5C9.4 41.5 16.1 45 24 45c10.8 0 20-8.2 20-21 0-1.2-.1-2.3-.4-3.5z"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;