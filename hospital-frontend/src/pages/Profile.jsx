import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

const Profile = ({ user, token }) => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md text-center">
                <h2 className="text-3xl font-bold">Welcome, {user?.name || "User"}!</h2>
                <p className="text-lg text-gray-600">Role: {user?.role || "Patient"}</p>
                
                <h3 className="text-xl font-semibold mt-4">Your Appointments</h3>
                
                {loading && <p className="text-gray-600">Loading appointments...</p>}
                
                {error && <p className="text-red-500">{error}</p>}
                
                {!loading && !error && appointments.length > 0 ? (
                    <ul className="mt-2 text-gray-700">
                        {appointments.map((appt, index) => (
                            <li key={index} className="border-b py-2 text-left">
                                <p><span className="font-semibold">Name:</span> {appt.name}</p>
                                <p><span className="font-semibold">Age:</span> {appt.age}</p>
                                <p><span className="font-semibold">Gender:</span> {appt.gender}</p>
                                <p><span className="font-semibold">Symptoms:</span> {appt.symptom}</p>
                                <p><span className="font-semibold">Requested Date:</span> {formatDate(appt.date)}</p>
                                
                                {appt.assignedDate ? (
                                    <div className="mt-2 bg-green-50 p-2 rounded">
                                        <p className="font-semibold text-green-700">Appointment Confirmed</p>
                                        <p><span className="font-semibold">Date:</span> {formatDate(appt.assignedDate)}</p>
                                        <p><span className="font-semibold">Time:</span> {appt.appointmentTime}</p>
                                    </div>
                                ) : (
                                    <p className="text-yellow-600 mt-2">Waiting for confirmation</p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    !loading && !error && <p className="text-gray-500">No appointments yet.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;