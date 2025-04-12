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
        console.log("Admin token:", token ? "Present" : "Missing");
        
        if (!token) {
          console.error("No admin token found!");
          setError("Authentication error. Please login again.");
          return;
        }

        console.log("Sending request to fetch all appointments");
        const res = await axios.get("http://localhost:5000/api/admin/appointments/all", {
          headers: { "x-auth-token": token }
        });

        console.log("Response received:", res.status, "Data count:", res.data.length);
        setAppointments(res.data);
        
        const grouped = groupAppointmentsByUniquePatient(res.data);
        setGroupedAppointments(grouped);
      } catch (error) {
        console.error("Error fetching appointments:", error);
        console.error("Error details:", error.response?.data || "No response data");
        setError("Failed to fetch appointments. " + (error.response?.data?.msg || error.message));
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
        if (!token) {
          console.error("No admin token found!");
          return;
        }

        console.log("Sending request to fetch today's appointments");
        const res = await axios.get("http://localhost:5000/api/admin/appointments/today", {
          headers: { "x-auth-token": token }
        });

        console.log("Today's appointments response:", res.data);
        const appointmentsData = Array.isArray(res.data) ? res.data : [];
        console.log("Today's appointments:", appointmentsData.length);
        setTodayAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching today's appointments:", error);
        console.error("Error details:", error.response?.data || "No response data");
      }
    };

    fetchTodayAppointments();
  }, []);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("No admin token found!");
        setError("Authentication error. Please login again.");
        return;
      }

      console.log("Searching for:", searchQuery);
      const res = await axios.get(`http://localhost:5000/api/admin/appointments/search?name=${searchQuery}`, {
        headers: { "x-auth-token": token }
      });

      console.log("Search results:", res.data.length);
      setAppointments(res.data);
      
      const grouped = groupAppointmentsByUniquePatient(res.data);
      setGroupedAppointments(grouped);
    } catch (error) {
      console.error("Error searching appointments:", error);
      setError("Search failed. " + (error.response?.data?.msg || error.message));
    } finally {
      setLoading(false);
    }
  };

  const togglePatient = (patientKey) => {
    setExpandedPatient(expandedPatient === patientKey ? null : patientKey);
  };

  const formatPatientDisplay = (uniqueKey) => {
    const nameMatch = uniqueKey.match(/(.*) \((.*)\)/);
    if (nameMatch) {
      return {
        name: nameMatch[1],
        email: nameMatch[2] !== 'no email' ? nameMatch[2] : null
      };
    }
    return { name: uniqueKey, email: null };
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  const handleAssignClick = (appointment) => {
    setSelectedAppointment(appointment);
    setAssignModal(true);
    // Set default values based on current appointment
    if (appointment.assignedDate) {
      const date = new Date(appointment.assignedDate);
      if (!isNaN(date.getTime())) {
        setAssignDate(date.toISOString().split('T')[0]);
      } else {
        const today = new Date();
        setAssignDate(today.toISOString().split('T')[0]);
      }
    } else {
      const today = new Date();
      setAssignDate(today.toISOString().split('T')[0]);
    }
    
    // Use current time if no appointment time exists
    if (appointment.appointmentTime) {
      setAssignTime(appointment.appointmentTime);
    } else {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setAssignTime(`${hours}:${minutes}`);
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
      alert("Please select a date and time");
      return;
    }

    // Prevent multiple submissions
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("Authentication error. Please login again.");
        setIsSubmitting(false);
        return;
      }

      console.log(`Assigning appointment ${selectedAppointment._id} to date: ${assignDate}, time: ${assignTime}`);
      
      const response = await axios.post(
        `http://localhost:5000/api/admin/appointments/assign/${selectedAppointment._id}`,
        {
          assignedDate: assignDate,
          appointmentTime: assignTime
        },
        {
          headers: { "x-auth-token": token }
        }
      );

      console.log("Assignment response:", response.data);
      
      // Check response and update UI
      if (response.data && (response.data.success || response.status === 200)) {
        // Update the appointment in our local state
        const updatedAppointments = appointments.map(appt => 
          appt._id === selectedAppointment._id 
            ? { ...appt, assignedDate: assignDate, appointmentTime: assignTime, status: "assigned" } 
            : appt
        );
        
        setAppointments(updatedAppointments);
        
        // Update grouped appointments
        const grouped = groupAppointmentsByUniquePatient(updatedAppointments);
        setGroupedAppointments(grouped);
        
        // Update today's appointments if needed
        const updatedTodayAppointments = todayAppointments.map(appt => 
          appt._id === selectedAppointment._id 
            ? { ...appt, assignedDate: assignDate, appointmentTime: assignTime, status: "assigned" } 
            : appt
        );
        setTodayAppointments(updatedTodayAppointments);
        
        closeAssignModal();
      } else {
        throw new Error("Failed to update appointment. Server did not confirm success.");
      }
    } catch (error) {
      console.error("Error assigning appointment time:", error);
      setError("Failed to assign appointment time: " + (error.response?.data?.msg || error.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search by name"
          className="p-2 border border-gray-300 rounded-l-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-r-md"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">All Appointments</h3>
          {loading ? <p>Loading...</p> : (
            <div>
              {Object.keys(groupedAppointments).length > 0 ? (
                Object.entries(groupedAppointments).map(([patientKey, appts]) => {
                  const { name, email } = formatPatientDisplay(patientKey);
                  return (
                    <div key={patientKey} className="mb-2 border-b">
                      <div 
                        className="flex justify-between items-center py-2 cursor-pointer hover:bg-gray-50"
                        onClick={() => togglePatient(patientKey)}
                      >
                        <div>
                          <span className="font-medium">{name}</span>
                          {email && (
                            <div className="text-xs text-gray-500">{email}</div>
                          )}
                        </div>
                        <span className="text-blue-500">{appts.length} appointments</span>
                      </div>
                      
                      {expandedPatient === patientKey && (
                        <ul className="pl-4 pb-2">
                          {appts.map((appt) => (
                            <li key={appt._id} className="py-1 text-sm">
                              <div className="flex justify-between items-center">
                                <div>
                                  <strong>{appt.symptom}</strong>
                                  {appt.age && appt.gender && (
                                    <span className="text-xs text-gray-500 ml-2">
                                      ({appt.age}y, {appt.gender})
                                    </span>
                                  )}
                                  <div>
                                    <span className="text-gray-600">Requested: {formatDate(appt.date)}</span>
                                    {appt.assignedDate && (
                                      <div className="text-green-600">
                                        Assigned: {formatDate(appt.assignedDate)} at {appt.appointmentTime}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <button 
                                  className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAssignClick(appt);
                                  }}
                                >
                                  {appt.assignedDate ? "Reassign" : "Assign Time"}
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })
              ) : (
                <p>No appointments found.</p>
              )}
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-2">Today's Appointments</h3>
          {loading ? <p>Loading...</p> : (
            <ul>
              {todayAppointments.length > 0 ? (
                todayAppointments.map((appt) => (
                  <li key={appt._id} className="border-b py-2">
                    <div>
                      <strong>{appt.name}</strong>
                      {appt.email && (
                        <div className="text-xs text-gray-500">{appt.email}</div>
                      )}
                    </div>
                    <div className="text-sm flex justify-between">
                      <div>
                        {appt.symptom}
                        {appt.age && appt.gender && (
                          <span className="text-xs text-gray-500 ml-2">
                            ({appt.age}y, {appt.gender})
                          </span>
                        )}
                        {appt.assignedDate && (
                          <div className="text-green-600">
                            Assigned: {formatDate(appt.assignedDate)} at {appt.appointmentTime}
                          </div>
                        )}
                      </div>
                      <div>
                        <button 
                          className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
                          onClick={() => handleAssignClick(appt)}
                        >
                          {appt.assignedDate ? "Reassign" : "Assign Time"}
                        </button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p>No appointments today.</p>
              )}
            </ul>
          )}
        </div>
      </div>

      {/* Assign Date/Time Modal */}
      {assignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Assign Appointment Time</h3>
            <div className="mb-4">
              <p><strong>Patient:</strong> {selectedAppointment?.name}</p>
              <p><strong>Symptom:</strong> {selectedAppointment?.symptom}</p>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Appointment Date</label>
              <input 
                type="date" 
                className="w-full p-2 border border-gray-300 rounded"
                value={assignDate}
                onChange={(e) => setAssignDate(e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Appointment Time</label>
              <input 
                type="time" 
                className="w-full p-2 border border-gray-300 rounded"
                value={assignTime}
                onChange={(e) => setAssignTime(e.target.value)}
              />
            </div>
            
            <div className="flex justify-end">
              <button 
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded mr-2"
                onClick={closeAssignModal}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button 
                className={`bg-blue-500 text-white px-4 py-2 rounded ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-600'}`}
                onClick={handleAssignAppointment}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Save & Notify Patient'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;