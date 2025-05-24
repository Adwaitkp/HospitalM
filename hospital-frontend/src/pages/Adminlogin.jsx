import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://hospitalm-xexh.onrender.com/api";

const AdminLogin = ({ setAdminToken }) => {
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

  const handleAdminLogin = async (e) => {
    if (e) e.preventDefault();
    
    if (!email || !password) {
      showNotification("Please enter email and password");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/admin/login`, { email, password });

      console.log("Admin Login Response:", res.data);

      if (!res.data.token) {
        throw new Error("Token not received from server");
      }

      const token = res.data.token;
      localStorage.setItem("adminToken", token);
      setAdminToken(token);

      showNotification("Admin login successful", "success");
      setTimeout(() => navigate("/admin-dashboard"), 1000);
    } catch (error) {
      console.error("Admin Login Error:", error.response?.data || error.message);
      showNotification("Invalid admin credentials");
    } finally {
      setLoading(false);
    }
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
        <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
        <form onSubmit={handleAdminLogin}>
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
      </div>
    </div>
  );
};

export default AdminLogin;