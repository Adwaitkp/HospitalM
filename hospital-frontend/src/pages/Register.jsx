import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

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
    if (e) e.preventDefault();
    
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
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
        <form onSubmit={handleRegister}>
          <input 
            type="text" 
            placeholder="Name" 
            value={name}
            onChange={(e) => setName(e.target.value)} 
            className="w-full p-2 border mb-2 rounded"
            required
          />
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
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)} 
            className="w-full p-2 border mb-2 rounded"
            required
          />
          <button 
            type="submit" 
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            disabled={loading}
          >
            {loading ? "Processing..." : "Sign Up"}
          </button>
        </form>

        {/* Google Sign-Up Button */}
        <button 
          onClick={handleGoogleSignUp} 
          className="w-full p-2 bg-blue-500 text-white rounded mt-2 hover:bg-blue-600 transition-colors"
        >
          Sign Up with Google
        </button>

        <p className="mt-2 text-sm">Already have an account? <Link to="/login" className="text-blue-600 underline">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;