import React, { useEffect, useState } from "react";
import axios from "axios";
import PrescriptionComponent from "../component/Prescription";

const API_URL = "https://hospitalm-xexh.onrender.com/api";

const Profile = ({ user, token }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewingPrescription, setViewingPrescription] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            if (!token) return;

            setLoading(true);
            try {
                // Use the correct endpoint from your appointmentRoutes.js
                const response = await axios.get(`${API_URL}/book/appointments`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("Appointments Fetched:", response.data);
                
                // Get appointments from response
                const fetchedAppointments = response.data.appointments || [];
                
                // Sort appointments by date (most recent first)
                const sortedAppointments = fetchedAppointments.sort((a, b) => {
                    // First prioritize assigned dates if available
                    const dateA = a.assignedDate || a.date;
                    const dateB = b.assignedDate || b.date;
                    return new Date(dateB) - new Date(dateA);
                });
                
                setAppointments(sortedAppointments);
                setError(null);
            } catch (error) {
                console.error("Error fetching appointments:", error.response?.data || error.message);
                setError("Unable to fetch appointments. Please check your connection or try again later.");
            } finally {
                setLoading(false);
            }
        };
        
        fetchAppointments();
    }, [token]);

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (error) {
            return dateString;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
            {/* Welcome Section - Outside the main box */}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    Welcome, {user?.name || "User"}!
                </h1>
                <p className="text-xl text-gray-600 bg-white px-4 py-2 rounded-full inline-block shadow-sm">
                    Role: {user?.role || "Patient"}
                </p>
            </div>

            {viewingPrescription ? (
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white p-8 rounded-xl shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Prescription Details</h3>
                            <button 
                                onClick={() => setViewingPrescription(null)}
                                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
                            >
                                ← Back
                            </button>
                        </div>
                        
                        <PrescriptionComponent
                            patientData={viewingPrescription}
                            doctorData={{
                                name: "Tushar Pande", // This would ideally come from the appointment's doctor details
                                qualification: "MBBS",
                                regNo: "REG/123456",
                                address: "Manish Nagar, Nagpur",
                                phone: "1234567890",
                            }}
                            readOnly={true}
                        />
                    </div>
                </div>
            ) : (
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-xl shadow-xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-3xl font-bold text-gray-800">Your Appointments</h3>
                            <div className="text-sm text-gray-500">
                                {appointments.length > 0 && `${appointments.length} appointment(s)`}
                            </div>
                        </div>
                        
                        {loading && (
                            <div className="text-center py-12">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <p className="text-gray-600 mt-4">Loading appointments...</p>
                            </div>
                        )}
                        
                        {error && (
                            <div className="text-center py-12">
                                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                                    <p className="text-red-600">{error}</p>
                                </div>
                            </div>
                        )}
                        
                        {!loading && !error && appointments.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {appointments.map((appt, index) => (
                                    <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200">
                                        {/* Patient Info Header */}
                                        <div className="mb-4">
                                            <h4 className="text-xl font-bold text-gray-800 mb-2">{appt.name}</h4>
                                            <div className="flex gap-4 text-sm text-gray-600">
                                                <span className="bg-blue-100 px-2 py-1 rounded-full">
                                                    Age: {appt.age}
                                                </span>
                                                <span className="bg-purple-100 px-2 py-1 rounded-full">
                                                    {appt.gender}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Symptoms */}
                                        <div className="mb-4">
                                            <p className="text-sm font-medium text-gray-700 mb-1">Symptoms:</p>
                                            <p className="text-gray-600 text-sm bg-white p-2 rounded-lg">{appt.symptom}</p>
                                        </div>

                                        {/* Request Date */}
                                        <div className="mb-4">
                                            <p className="text-xs text-gray-500">
                                                <span className="font-medium">Requested:</span> {formatDate(appt.date)}
                                            </p>
                                        </div>
                                        
                                        {/* Status Section */}
                                        {appt.assignedDate ? (
                                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                                <div className="flex items-center mb-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                    <p className="font-semibold text-green-700">Confirmed</p>
                                                </div>
                                                <div className="space-y-1 text-sm">
                                                    <p><span className="font-medium">Date:</span> {formatDate(appt.assignedDate)}</p>
                                                    <p><span className="font-medium">Time:</span> {appt.appointmentTime}</p>
                                                </div>
                                                
                                                {/* Prescription Section */}
                                                {appt.prescription && (
                                                    <div className="mt-3 pt-3 border-t border-green-200">
                                                        <div className="flex justify-between items-center">
                                                            <div className="flex items-center">
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                                                <p className="font-medium text-blue-700 text-sm">Prescription Ready</p>
                                                            </div>
                                                            <button 
                                                                onClick={() => setViewingPrescription(appt)} 
                                                                className="bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                                                            >
                                                                View
                                                            </button>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                                                    <p className="text-yellow-700 font-medium text-sm">Waiting for confirmation</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            !loading && !error && (
                                <div className="text-center py-16">
                                    <div className="max-w-md mx-auto">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v8m6-8v8m-6-4h6"></path>
                                            </svg>
                                        </div>
                                        <h4 className="text-xl font-semibold text-gray-600 mb-2">No Appointments Yet</h4>
                                        <p className="text-gray-500">Your appointment history will appear here once you book your first appointment.</p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;