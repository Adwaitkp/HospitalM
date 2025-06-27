import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Navbar = ({ user, setUser, setToken }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    navigate("/login");
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-teal-700 p-4">
      <div className="flex justify-between items-center">
        {/* Logo Section */}
        <div className="flex items-center">
          <div className="ml-4">
            <h1 className="text-white font-bold text-xl sm:text-2xl lg:text-3xl">Utkarsha Nursing Home</h1>
            <p className="text-white text-xs sm:text-sm">Nagpur | Open 24 Hours</p>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-white p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
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
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 bg-teal-800 rounded-lg p-4">
          <div className="flex flex-col space-y-3">
            <Link to="/" className="text-white py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
            <Link to="/about-us" className="text-white py-2" onClick={() => setIsMenuOpen(false)}>About Us</Link>
            
            {!user && (
              <>
                <Link to="/login" className="text-white py-2" onClick={() => setIsMenuOpen(false)}>Login</Link>
                <Link to="/register" className="text-white py-2" onClick={() => setIsMenuOpen(false)}>Sign Up</Link>
              </>
            )}

            {user && (
              <Link to="/profile" className="text-white py-2" onClick={() => setIsMenuOpen(false)}>
                Profile ({user.name})
              </Link>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="text-white bg-teal-950 p-2 rounded text-left"
              >
                Logout
              </button>
            )}

            <button
              onClick={() => {
                !user ? navigate("/login") : navigate("/book-appointment");
                setIsMenuOpen(false);
              }}
              className="text-white bg-red-700 p-2 rounded"
            >
              Book Appointment
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;