import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const showNotification = (message, type = "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    
    if (!email || !password) {
      showNotification("Please enter email and password");
      return;
    }
    
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });

      if (!res.data.token) {
        throw new Error("Token not received from server");
      }

      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);
      
      showNotification("Login successful", "success");
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      showNotification("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md max-w-sm ${
          notification.type === "success" ? "bg-green-100 border-l-4 border-green-500 text-green-700" : 
          "bg-red-100 border-l-4 border-red-500 text-red-700"
        }`}>
          {notification.message}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
            className="w-full p-2 border mb-2 rounded"
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            className="w-full p-2 border mb-2 rounded"
            required
          />
          <button 
            type="submit" 
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            disabled={loading}
          >
            {loading ? "Processing..." : "Login"}
          </button>
        </form>

        {/* Google Login Button */}
        <button 
          onClick={handleGoogleLogin} 
          className="w-full p-2 bg-blue-500 text-white rounded mt-2 hover:bg-blue-600 transition-colors"
        >
          Login with Google
        </button>

        <p className="mt-2 text-sm">Don't have an account? <Link to="/register" className="text-blue-600 underline">Sign Up</Link></p>
      </div>
    </div>
  );
};

export default Login;