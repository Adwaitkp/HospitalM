import React from "react";
import { Link, useNavigate } from "react-router-dom";

const AdminNavbar = ({ adminToken, setAdminToken }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setAdminToken(null);
    navigate("/adminlogin");
  };

  return (
    <nav className="bg-teal-700 p-4 flex justify-between items-center">
      {/* Logo Section */}
      <div className="flex items-center">
        <div className="ml-4">
          <h1 className="text-white font-bold text-3xl">Utkarsha Nursing Home</h1>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center">
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="text-white bg-teal-950 p-2 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;