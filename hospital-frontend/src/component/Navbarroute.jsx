import React from "react";
import { useLocation } from "react-router-dom";
import UserNavbar from "./usernavbar";
import AdminNavbar from "./adminnavbar";
import DoctorNavbar from "./doctornavbar";

const NavbarRouter = (props) => {
  const location = useLocation();
  const { 
    user, setUser, setToken,
    adminToken, setAdminToken,
    doctorToken, setDoctorToken
  } = props;

  // Check route path to determine which navbar to display
  const isAdminPath = location.pathname.startsWith("/admin");
  const isDoctorPath = location.pathname.startsWith("/doctor");
  
  // Special case for login pages - don't show navbar
  const isAdminLoginPage = location.pathname === "/adminlogin";
  const isDoctorLoginPage = location.pathname === "/doctorlogin";
  
  // If on login pages, don't render any navbar
  if (isAdminLoginPage || isDoctorLoginPage) {
    return null;
  }
  
  // Determine which navbar to display based on path and tokens
  if (isAdminPath && adminToken) {
    return <AdminNavbar adminToken={adminToken} setAdminToken={setAdminToken} />;
  }
  
  if (isDoctorPath && doctorToken) {
    return <DoctorNavbar 
      doctorToken={doctorToken} 
      setDoctorToken={setDoctorToken} 
    />;
  }
  
  // Default to user navbar for all other cases
  return <UserNavbar user={user} setUser={setUser} setToken={setToken} />;
}

export default NavbarRouter;