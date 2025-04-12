import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./component/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import BookAppointment from "./pages/BookAppointment";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import AdminLogin from "./pages/Adminlogin";
import AdminDashboard from "./pages/admindashboard";

// CopilotKit
import { CopilotKit } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";

// Environment
const API_URL = import.meta.env.VITE_API_URL;

const OAuthHandler = ({ setToken }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      console.log("OAuth token received:", token);
      localStorage.setItem("token", token);
      setToken(token);
      navigate("/");
    }
  }, [location, navigate, setToken]);

  return <div className="flex justify-center items-center min-h-screen">Processing authentication...</div>;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [adminToken, setAdminToken] = useState(localStorage.getItem("adminToken"));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');

    if (tokenFromUrl && !token) {
      console.log("Found token in URL:", tokenFromUrl);
      localStorage.setItem("token", tokenFromUrl);
      setToken(tokenFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [token]);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      console.log("Token being sent:", storedToken);
      setIsLoading(true);

      axios
        .get(`${API_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
        .then((res) => {
          console.log("Profile Data:", res.data);
          setUser(res.data);
        })
        .catch((error) => {
          console.error("Profile Fetch Error:", error.response?.data || error.message);
          setToken(null);
          localStorage.removeItem("token");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const ProtectedRoute = ({ element }) => {
    if (isLoading) {
      return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }
    return token ? element : <Navigate to="/login" />;
  };

  const AdminRoute = ({ element }) => {
    if (isLoading) {
      return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }
    return adminToken ? element : <Navigate to="/adminlogin" />;
  };

  return (
    <CopilotKit publicApiKey={import.meta.env.VITE_COPILOT_API_KEY}>
      <Router>
        <Navbar user={user} setUser={setUser} setToken={setToken} adminToken={adminToken} setAdminToken={setAdminToken} />

        {/* ✅ Fixed Disclaimer at Bottom-Left */}
        <div style={{
          position: "fixed",
          bottom: "30px",
          right: "90px", // shifted just to the left of chat icon
          background: "#fffbea",
          color: "#8a6d3b",
          border: "1px solid #f0ad4e",
          padding: "10px 14px",
          borderRadius: "8px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          zIndex: 9999,
          maxWidth: "300px",
          fontSize: "13px"
        }}>
          Hi, I'm an AI doctor 🙂. But I'm not always accurate. Always consult your doctor ⚠️.
        </div>

        {/* ✅ AI Chat Popup */}
        <CopilotPopup
          labels={{
            title: "AI DOCTOR",
            initial: "HI I'M AI DOCTOR, NEED ANY HELP? ASK ME!",
          }}
          instructions=" Only medical related questions are allowed. "
        />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile user={user} token={token} />} />} />
          <Route path="/book-appointment" element={<ProtectedRoute element={<BookAppointment token={token} user={user} />} />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/adminlogin" element={<AdminLogin setAdminToken={setAdminToken} />} />
          <Route path="/admin-dashboard" element={<AdminRoute element={<AdminDashboard adminToken={adminToken} />} />} />
          <Route path="/oauth/callback" element={<OAuthHandler setToken={setToken} />} />
        </Routes>
      </Router>
    </CopilotKit>
  );
};

export default App;
