import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OAuthCallback = ({ setToken }) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");
    
    if (token) {
      // Save token to localStorage
      localStorage.setItem("token", token);
      
      // Update app state
      setToken(token);
      
      // Redirect to home page
      navigate("/");
    } else {
      // Handle error case
      navigate("/login");
    }
  }, [location, navigate, setToken]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-4">Processing login...</h2>
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
      </div>
    </div>
  );
};

export default OAuthCallback;