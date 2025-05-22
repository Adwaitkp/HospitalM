import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = ({ user, setUser, setToken }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-teal-700 p-4 flex justify-between items-center">
      {/* Logo Section */}
      <div className="flex items-center">
        <div className="ml-4">
          <h1 className="text-white font-bold text-3xl">Utkarsha Nursing Home</h1>
          <p className="text-white text-sm">Nagpur | Open 24 Hours</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center">
        <Link to="/" className="text-white ml-4">Home</Link>
        <Link to="/about-us" className="text-white ml-4">About Us</Link>
        
        {/* Authentication links */}
        {!user && (
          <>
            <Link to="/login" className="text-white ml-4">Login</Link>
            <Link to="/register" className="text-white ml-4">Sign Up</Link>
          </>
        )}

        {/* User profile */}
        {user && (
          <Link to="/profile" className="text-white rounded-full bg-gray-800 p-2 ml-4">
            {user.name}
          </Link>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center">
        {/* Logout Button */}
        {user && (
          <button
            onClick={handleLogout}
            className="text-white bg-teal-950 p-2 rounded ml-4"
          >
            Logout
          </button>
        )}

        {/* Book Appointment */}
        <motion.button
          onClick={() => !user ? navigate("/login") : navigate("/book-appointment")}
          className="text-white bg-red-700 p-2 rounded ml-4"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          Book Appointment
        </motion.button>
      </div>
    </nav>
  );
};

export default Navbar;