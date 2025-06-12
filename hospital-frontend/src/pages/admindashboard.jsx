import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [groupedAppointments, setGroupedAppointments] = useState({});
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [error, setError] = useState(null);
  const [assignModal, setAssignModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [assignDate, setAssignDate] = useState("");
  const [assignTime, setAssignTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const showNotification = (message, type = "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("No admin token found in localStorage!");
        setError("Authentication error. Please login again.");
        setLoading(false);
      }
    };
    
    checkToken();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      setError(null);
      try {
        const token = localStorage.getItem("adminToken");
        
        if (!token) {
          console.error("No admin token found!");
          setError("Authentication error. Please login again.");
          return;
        }

        const res = await axios.get("https://hospitalm-9kap.onrender.com/api/admin/appointments/all", {
          headers: { "x-auth-token": token }
        });

        setAppointments(res.data);
        const grouped = groupAppointmentsByUniquePatient(res.data);
        setGroupedAppointments(grouped);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        showNotification("Failed to fetch appointments. " + (error.response?.data?.msg || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const groupAppointmentsByUniquePatient = (appointments) => {
    return appointments.reduce((groups, appointment) => {
      const uniqueKey = `${appointment.name} (${appointment.email || 'no email'})`;
      if (!groups[uniqueKey]) {
        groups[uniqueKey] = [];
      }
      groups[uniqueKey].push(appointment);
      return groups;
    }, {});
  };

  useEffect(() => {
    const fetchTodayAppointments = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) return;

        const res = await axios.get("https://hospitalm-9kap.onrender.com/api/admin/appointments/today", {
          headers: { "x-auth-token": token }
        });

        setTodayAppointments(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching today's appointments:", error);
      }
    };

    fetchTodayAppointments();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        showNotification("Authentication error. Please login again.");
        return;
      }

      const res = await axios.get(`https://hospitalm-9kap.onrender.com/api/admin/appointments/search?name=${searchQuery}`, {
        headers: { "x-auth-token": token }
      });

      setAppointments(res.data);
      const grouped = groupAppointmentsByUniquePatient(res.data);
      setGroupedAppointments(grouped);
    } catch (error) {
      console.error("Error searching appointments:", error);
      showNotification("Search failed. " + (error.response?.data?.msg || error.message));
    } finally {
      setLoading(false);
    }
  };

  const togglePatient = (patientKey) => {
    setExpandedPatient(expandedPatient === patientKey ? null : patientKey);
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const handleAssignClick = (appointment) => {
    setSelectedAppointment(appointment);
    setAssignModal(true);
    const date = appointment.assignedDate ? new Date(appointment.assignedDate) : new Date();
    setAssignDate(date.toISOString().split('T')[0]);
    
    if (appointment.appointmentTime) {
      setAssignTime(appointment.appointmentTime);
    } else {
      const now = new Date();
      setAssignTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    }
  };

  const closeAssignModal = () => {
    setAssignModal(false);
    setSelectedAppointment(null);
    setAssignDate("");
    setAssignTime("");
    setIsSubmitting(false);
  };

  const handleAssignAppointment = async () => {
    if (!selectedAppointment || !assignDate || !assignTime) {
      showNotification("Please select a date and time", "error");
      return;
    }

    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        showNotification("Authentication error. Please login again.");
        return;
      }

      const response = await axios.post(
        `https://hospitalm-9kap.onrender.com/api/admin/appointments/assign/${selectedAppointment._id}`,
        { assignedDate: assignDate, appointmentTime: assignTime },
        { headers: { "x-auth-token": token } }
      );

      const updatedAppointments = appointments.map(appt => 
        appt._id === selectedAppointment._id 
          ? { ...appt, assignedDate: assignDate, appointmentTime: assignTime, status: "assigned" } 
          : appt
      );
      
      setAppointments(updatedAppointments);
      setGroupedAppointments(groupAppointmentsByUniquePatient(updatedAppointments));
      setTodayAppointments(todayAppointments.map(appt => 
        appt._id === selectedAppointment._id 
          ? { ...appt, assignedDate: assignDate, appointmentTime: assignTime, status: "assigned" } 
          : appt
      ));
      
      closeAssignModal();
      showNotification("Appointment time assigned successfully!", "success");
    } catch (error) {
      console.error("Error assigning appointment time:", error);
      showNotification("Failed to assign appointment time: " + (error.response?.data?.msg || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md max-w-sm z-50 ${
          notification.type === "success" 
            ? "bg-green-100 border-l-4 border-green-500 text-green-700" 
            : "bg-red-100 border-l-4 border-red-500 text-red-700"
        }`}>
          {notification.message}
        </div>
      )}

      <div className="w-full max-w-screen-xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h2>

        <div className="mb-6 flex justify-center">
          <input
            type="text"
            placeholder="Search by patient name"
            className="p-2 border rounded-l-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <button
            className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-3">All Appointments</h3>
            {loading ? <p>Loading...</p> : (
              Object.keys(groupedAppointments).length > 0 ? (
                Object.entries(groupedAppointments).map(([patientKey, appts]) => (
                  <div key={patientKey} className="border-b mb-2">
                    <div 
                      className="cursor-pointer font-medium hover:bg-gray-100 p-2 flex justify-between items-center"
                      onClick={() => togglePatient(patientKey)}
                    >
                      <div>
                        <div>{patientKey.split(" (")[0]}</div>
                        <div className="text-xs text-gray-500">
                          {patientKey.split(" (")[1]?.replace(")", "")}
                        </div>
                      </div>
                      <span className="text-blue-500">{appts.length} appointments</span>
                    </div>
                    
                    {expandedPatient === patientKey && (
                      <ul className="pl-4 pb-2">
                        {appts.map((appt) => (
                          <li key={appt._id} className="mb-2 text-sm pb-2">
                            <div className="flex justify-between items-start gap-4">
                              <div>
                                <div><strong>{appt.symptom}</strong> ({appt.age}y, {appt.gender})</div>
                                <div className="text-gray-600">
                                  Requested: {formatDate(appt.date)}
                                  {appt.assignedDate && (
                                    <div className="text-green-600">
                                      Assigned: {formatDate(appt.assignedDate)} at {appt.appointmentTime}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <button
                                className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAssignClick(appt);
                                }}
                              >
                                {appt.assignedDate ? "Reassign" : "Assign"}
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <p>No appointments found.</p>
              )
            )}
          </div>

          <div className="bg-white p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold mb-3">Today's Appointments</h3>
            {loading ? <p>Loading...</p> : (
              todayAppointments.length > 0 ? (
                todayAppointments.map((appt) => (
                  <li key={appt._id} className="border-b pb-3 mb-3 list-none">
                    <div className="font-medium">{appt.name}</div>
                    <div className="text-xs text-gray-500">{appt.email}</div>
                    <div className="flex justify-between items-start gap-4 mt-1">
                      <div className="text-sm">
                        {appt.symptom} ({appt.age}y, {appt.gender})<br />
                        {appt.assignedDate && (
                          <span className="text-green-600">
                            Assigned: {formatDate(appt.assignedDate)} at {appt.appointmentTime}
                          </span>
                        )}
                      </div>
                      <button
                        className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600"
                        onClick={() => handleAssignClick(appt)}
                      >
                        {appt.assignedDate ? "Reassign" : "Assign"}
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <p>No appointments today.</p>
              )
            )}
          </div>
        </div>

        {assignModal && (
          <div 
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold mb-4">Assign Appointment Time</h3>
              <div className="mb-4">
                <p><strong>Patient:</strong> {selectedAppointment?.name}</p>
                <p><strong>Symptom:</strong> {selectedAppointment?.symptom}</p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Date</label>
                <input 
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={assignDate}
                  onChange={(e) => setAssignDate(e.target.value)}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Time</label>
                <input 
                  type="time"
                  className="w-full p-2 border border-gray-300 rounded"
                  value={assignTime}
                  onChange={(e) => setAssignTime(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={closeAssignModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  className={`bg-blue-500 text-white px-4 py-2 rounded ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'
                  }`}
                  onClick={handleAssignAppointment}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;