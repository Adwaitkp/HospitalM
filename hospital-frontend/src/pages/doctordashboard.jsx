import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PrescriptionComponent from "../component/Prescription";

const DoctorDashboard = () => {
  const [groupedAppointments, setGroupedAppointments] = useState({});
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [prescriptionMode, setPrescriptionMode] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [viewMode, setViewMode] = useState(false);
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  // Add authentication check
  useEffect(() => {
    const token = localStorage.getItem("doctorToken");
    if (!token) {
      navigate("/doctor-login");
    }
  }, [navigate]);

  const showNotification = (message, type = "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  useEffect(() => {
    fetchAssignedAppointments();
    fetchTodayAppointments();
    fetchDoctorProfile();
  }, []);

  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem("doctorToken");
      const res = await axios.get("https://hospitalm-xexh.onrender.com/api/doctor/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setDoctorProfile(res.data);
    } catch (err) {
      console.error("Failed to fetch doctor profile:", err);
    }
  };

  const fetchAssignedAppointments = async () => {
    try {
      const token = localStorage.getItem("doctorToken");
      const res = await axios.get("https://hospitalm-xexh.onrender.com/api/doctor/appointments/assigned", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = Array.isArray(res.data) ? res.data : res.data?.appointments || [];
      setGroupedAppointments(groupByPatient(data));
    } catch (err) {
      console.error("Assigned fetch error:", err);
      setError("Failed to fetch assigned appointments.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayAppointments = async () => {
    try {
      const token = localStorage.getItem("doctorToken");
      const res = await axios.get("https://hospitalm-xexh.onrender.com/api/doctor/appointments/assigned/today", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = Array.isArray(res.data) ? res.data : res.data?.appointments || [];
      setTodayAppointments(data);
    } catch (err) {
      console.error("Today's fetch error:", err);
      setError("Failed to fetch today's appointments.");
    }
  };

  const fetchPrescriptionData = async (appointmentId) => {
    try {
      const token = localStorage.getItem("doctorToken");
      const res = await axios.get(`https://hospitalm-xexh.onrender.com/api/doctor/appointments/${appointmentId}/prescription`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      console.error("Failed to fetch prescription:", err);
      return null;
    }
  };

  const groupByPatient = (appointments) => {
    return appointments.reduce((acc, appt) => {
      const key = `${appt.name} (${appt.email || "no email"})`;
      if (!acc[key]) acc[key] = [];
      acc[key].push(appt);
      return acc;
    }, {});
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  const togglePatient = (key) => {
    setExpandedPatient(expandedPatient === key ? null : key);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("doctorToken");
      const res = await axios.get(`https://hospitalm-xexh.onrender.com/doctor/appointments/search?name=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = Array.isArray(res.data) ? res.data : res.data?.appointments || [];
      setGroupedAppointments(groupByPatient(data));
    } catch (err) {
      console.error("Search error:", err);
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const handlePrescribe = async (prescription) => {
    if (!prescription.trim()) return showNotification("Prescription cannot be empty.", "error");
    try {
      const token = localStorage.getItem("doctorToken");
      await axios.post(`https://hospitalm-xexh.onrender.com/api/doctor/appointments/prescribe/${selectedAppointmentId}`, {
        prescription
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification("Prescription saved!", "success");
      setPrescriptionMode(false);
      setSelectedAppointmentId(null);
      setSelectedPatient(null);
      setViewMode(false);
      setPrescriptionData(null);
      fetchAssignedAppointments();
      fetchTodayAppointments();
    } catch (err) {
      console.error("Prescription error:", err);
      showNotification("Failed to save prescription.", "error");
    }
  };

  const openPrescriptionForm = async (appt, isViewMode = false) => {
    setSelectedAppointmentId(appt._id);
    setSelectedPatient(appt);
    setViewMode(isViewMode);
    
    if (isViewMode && appt.prescription) {
      const prescriptionDetails = await fetchPrescriptionData(appt._id);
      setPrescriptionData(prescriptionDetails || appt.prescription);
    } else {
      setPrescriptionData(null);
    }
    
    setPrescriptionMode(true);
  };

  const closePrescriptionMode = () => {
    setPrescriptionMode(false);
    setSelectedAppointmentId(null);
    setSelectedPatient(null);
    setViewMode(false);
    setPrescriptionData(null);
  };

  const PrescriptionViewer = ({ prescription, patient, doctor }) => {
    const prescriptionText = typeof prescription === 'string' ? prescription : prescription?.text || JSON.stringify(prescription);
    
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="border-b pb-4 mb-4">
          <h3 className="text-xl font-bold text-center">PRESCRIPTION</h3>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Patient:</strong> {patient?.name}</p>
              <p><strong>Age:</strong> {patient?.age} years</p>
              <p><strong>Gender:</strong> {patient?.gender}</p>
              <p><strong>Email:</strong> {patient?.email}</p>
            </div>
            <div>
              <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Prescription Details:</h4>
          <div className="bg-gray-50 p-4 rounded border">
            <pre className="whitespace-pre-wrap text-sm">{prescriptionText}</pre>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(false)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Prescription
          </button>
          <button
            onClick={closePrescriptionMode}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    );
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
        <h2 className="text-3xl font-bold text-center mb-6">Doctor Dashboard</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 mb-4 border border-red-300 rounded">
            {error}
          </div>
        )}

        {prescriptionMode ? (
          <div className="w-full max-w-screen-md mx-auto">
            <button 
              onClick={closePrescriptionMode}
              className="mb-4 bg-gray-500 text-white px-4 py-1 rounded hover:bg-gray-600"
            >
              Back to Dashboard
            </button>
            
            {viewMode ? (
              <PrescriptionViewer 
                prescription={prescriptionData || selectedPatient?.prescription}
                patient={selectedPatient}
                doctor={doctorProfile}
              />
            ) : (
              <PrescriptionComponent 
                patientData={selectedPatient}
                doctorData={doctorProfile}
                onSave={handlePrescribe}
                existingPrescription={prescriptionData}
              />
            )}
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-center">
              <input
                type="text"
                placeholder="Search by patient name"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="p-2 border rounded-l-md"
              />
              <button onClick={handleSearch} className="bg-blue-500 text-white px-4 rounded-r-md">
                Search
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="bg-white p-4 rounded shadow-md">
                <h3 className="text-xl font-semibold mb-3">All Assigned Appointments</h3>
                {Object.keys(groupedAppointments).length > 0 ? (
                  Object.entries(groupedAppointments).map(([key, appts]) => (
                    <div key={key} className="border-b mb-2">
                      <div
                        className="cursor-pointer font-medium hover:bg-gray-100 p-2 flex justify-between items-center"
                        onClick={() => togglePatient(key)}
                      >
                        <div>
                          <div>{key.split(" (")[0]}</div>
                          <div className="text-xs text-gray-500">{key.split(" (")[1]?.replace(")", "")}</div>
                        </div>
                        <span className="text-blue-500">{appts.length} appointments</span>
                      </div>
                      {expandedPatient === key && (
                        <ul className="pl-4 pb-2">
                          {appts.map((appt) => (
                            <li key={appt._id} className="mb-2 text-sm pb-2">
                              <div className="flex justify-between items-start gap-4">
                                <div>
                                  <div><strong>{appt.symptom}</strong> ({appt.age}y, {appt.gender})</div>
                                  <div>Assigned: {formatDate(appt.assignedDate)} at {appt.appointmentTime}</div>
                                  {appt.prescription && (
                                    <div className="mt-1 text-green-800">
                                      <strong>Prescribed</strong>
                                    </div>
                                  )}
                                </div>
                                <div className="text-right">
                                  {!appt.prescription ? (
                                    <button
                                      onClick={() => openPrescriptionForm(appt, false)}
                                      className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600"
                                    >
                                      Write Prescription
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => openPrescriptionForm(appt, true)}
                                      className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600"
                                    >
                                      View Prescription
                                    </button>
                                  )}
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No assigned appointments.</p>
                )}
              </div>

              <div className="bg-white p-4 rounded shadow-md">
                <h3 className="text-xl font-semibold mb-3">Todays assign Appointments</h3>
                {todayAppointments.length > 0 ? (
                  <ul>
                    {todayAppointments.map((appt) => (
                      <li key={appt._id} className="border-b pb-3 mb-3">
                        <div className="font-medium">{appt.name}</div>
                        <div className="text-xs text-gray-500">{appt.email}</div>
                        <div className="flex justify-between items-start gap-4 mt-1">
                          <div className="text-sm">
                            {appt.symptom} ({appt.age}y, {appt.gender})<br />
                            <span className="text-green-600">
                              Assigned: {formatDate(appt.assignedDate)} at {appt.appointmentTime}
                            </span>
                            {appt.prescription && (
                              <div className="text-sm mt-1 text-green-800">
                                <strong>Prescribed</strong>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            {!appt.prescription ? (
                              <button
                                onClick={() => openPrescriptionForm(appt, false)}
                                className="bg-blue-500 text-white text-xs px-3 py-1 rounded hover:bg-blue-600"
                              >
                                Write Prescription
                              </button>
                            ) : (
                              <button
                                onClick={() => openPrescriptionForm(appt, true)}
                                className="bg-green-500 text-white text-xs px-3 py-1 rounded hover:bg-green-600"
                              >
                                View Prescription
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No appointments today.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;