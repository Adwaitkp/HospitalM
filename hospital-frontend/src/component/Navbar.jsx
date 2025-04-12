import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = ({ user, setUser, setToken, adminToken, setAdminToken }) => {
  const navigate = useNavigate();

  const handleBookAppointmentClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/book-appointment");
    }
  };

  const handleLogout = () => {
    if (adminToken) {
      localStorage.removeItem("adminToken");
      setAdminToken(null);
      navigate("/adminlogin");
    } else {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      navigate("/login");
    }
  };

  // Check if admin is logged in
  const isAdmin = !!adminToken;

  return (
    <nav className="bg-teal-700 p-4 flex justify-between items-center">
      {/* Logo/Title Section */}
      <div className="flex items-center">
        <div className="ml-4">
          <h1 className="text-white font-bold text-3xl">Utkarsha Nursing Home</h1>
          <p className="text-white text-sm">Nagpur | Open 24 Hours</p>
        </div>
      </div>

      {/* Navigation Links - Always centered */}
      <div className="flex items-center">
        <Link to="/" className="text-white ml-4">Home</Link>
        <Link to="/about-us" className="text-white ml-4">About Us</Link>
        {isAdmin && <Link to="/admin-dashboard" className="text-white ml-4">Dashboard</Link>}
        {!isAdmin && !user && (
          <>
            <Link to="/login" className="text-white ml-4">Login</Link>
            <Link to="/register" className="text-white ml-4">Sign Up</Link>
          </>
        )}
        {!isAdmin && user && (
          <Link to="/profile" className="text-white rounded-full bg-gray-800 p-2 ml-4">{user.name}</Link>
        )}
      </div>

      {/* User Actions Section */}
      <div className="flex items-center">
        {(isAdmin || user) && (
          <button 
            onClick={handleLogout} 
            className="text-white bg-teal-950 p-2 rounded ml-4"
          >
            Logout
          </button>
        )}
        {!isAdmin && (
          <motion.button
            onClick={handleBookAppointmentClick}
            className="text-white bg-red-700 p-2 rounded ml-4"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            Book Appointment
          </motion.button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;