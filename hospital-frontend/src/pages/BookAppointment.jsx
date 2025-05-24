import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "https://hospitalm-9kap.onrender.com/api";

const BookAppointment = ({ token, user }) => {
  const [form, setForm] = useState({ 
    name: "", 
    phone: "", 
    age: "", 
    gender: "", 
    symptom: "", 
    date: "" 
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const showNotification = (message, type = "error") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const makePayment = async () => {
    setLoading(true);
    try {
      const res = await initializeRazorpay();
      if (!res) {
        showNotification("Razorpay SDK failed to load. Please check your internet connection.");
        setLoading(false);
        return;
      }

      const orderData = await axios.post(
        `${API_URL}/payment/create-order`, 
        { amount: 500 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (!orderData.data.success) {
        showNotification("Failed to create payment order.");
        setLoading(false);
        return;
      }

      const options = {
        key: orderData.data.key_id,
        amount: orderData.data.amount,
        currency: "INR",
        name: "Utkarsha nursing home",
        description: "Appointment Booking",
        order_id: orderData.data.order_id,
        handler: async (response) => {
          try {
            const verifyData = await axios.post(
              `${API_URL}/payment/verify-payment`,
              response,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (verifyData.data.success) {
              const appointmentResponse = await axios.post(
                `${API_URL}/book/appointment`,
                {
                  ...form,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  amount: 500
                },
                { headers: { Authorization: `Bearer ${token}` } }
              );
              
              showNotification("Appointment booked successfully!", "success");
              setTimeout(() => navigate("/profile"), 2000);
            } else {
              showNotification("Payment verification failed.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            showNotification("Error verifying payment.");
          }
          setLoading(false);
        },
        prefill: {
          name: form.name || user?.name || "",
          email: user?.email || "",
          contact: form.phone || ""
        },
        theme: { color: "#10B981" }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
      
    } catch (error) {
      console.error("Payment error:", error);
      showNotification("Payment failed. Please try again later.");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.name || !form.age || !form.gender || !form.symptom || !form.date || !form.phone) {
      showNotification("Please fill all required fields");
      return;
    }
    
    makePayment();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100 p-4">
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
          notification.type === "success" 
            ? "bg-green-100 border-l-4 border-green-500 text-green-700" 
            : "bg-red-100 border-l-4 border-red-500 text-red-700"
        }`}>
          {notification.message}
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Book Appointment</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Age</label>
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Gender</label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Symptoms</label>
            <textarea
              name="symptom"
              value={form.symptom}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 h-32"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Appointment Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-60"
          >
            {loading ? "Processing Payment..." : "Pay ₹500 & Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;