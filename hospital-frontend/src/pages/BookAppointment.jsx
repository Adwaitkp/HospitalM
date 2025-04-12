import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api";

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
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const makePayment = async () => {
    setLoading(true);
    try {
      // Initialize Razorpay SDK
      const res = await initializeRazorpay();
      
      if (!res) {
        showNotification("Razorpay SDK failed to load. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // Make API call to create Razorpay order
      const orderData = await axios.post(
        `${API_URL}/payment/create-order`, 
        { amount: 500 }, // ₹500 as shown in your UI
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (!orderData.data.success) {
        showNotification("Failed to create payment order.");
        setLoading(false);
        return;
      }

      // Configure Razorpay options
      const options = {
        key: orderData.data.key_id,
        amount: orderData.data.amount,
        currency: "INR",
        name: "Hospital Name",
        description: "Appointment Booking",
        order_id: orderData.data.order_id,
        handler: async function (response) {
          try {
            // Verify payment
            const verifyData = await axios.post(
              `${API_URL}/payment/verify-payment`,
              response,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            
            if (verifyData.data.success) {
              // If payment verified, book the appointment
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
              showNotification("Payment verification failed. Please try again.");
            }
          } catch (error) {
            console.error("Payment verification error:", error);
            showNotification("Error verifying payment. Please contact support.");
          }
          setLoading(false);
        },
        prefill: {
          name: form.name || user?.name || "",
          email: user?.email || "",
          contact: form.phone || ""
        },
        theme: {
          color: "#10B981" // Green color to match your button
        }
      };

      // Initialize payment
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
    
    // Validate form
    if (!form.name || !form.age || !form.gender || !form.symptom || !form.date || !form.phone) {
      showNotification("Please fill all required fields");
      return;
    }
    
    // Initiate payment
    makePayment();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {notification.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md max-w-sm ${
          notification.type === "success" ? "bg-green-100 border-l-4 border-green-500 text-green-700" : 
          "bg-red-100 border-l-4 border-red-500 text-red-700"
        }`}>
          {notification.message}
        </div>
      )}
      
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-2xl font-bold mb-4">Book Appointment</h2>
        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
          <input 
            type="text" 
            name="name" 
            placeholder="Name" 
            value={form.name}
            onChange={handleChange} 
            className="w-full p-2 border mb-2 rounded" 
            required 
          />
          <input 
            type="tel" 
            name="phone" 
            placeholder="Phone Number" 
            value={form.phone}
            onChange={handleChange} 
            className="w-full p-2 border mb-2 rounded" 
            required 
          />
          <input 
            type="number" 
            name="age" 
            placeholder="Age" 
            value={form.age}
            onChange={handleChange} 
            className="w-full p-2 border mb-2 rounded" 
            required 
          />
          <select 
            name="gender" 
            value={form.gender}
            onChange={handleChange} 
            className="w-full p-2 border mb-2 rounded" 
            required
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <textarea 
            name="symptom" 
            placeholder="Symptom" 
            value={form.symptom}
            onChange={handleChange} 
            className="w-full p-2 border mb-2 rounded" 
            required
          ></textarea>
          <input 
            type="date" 
            name="date" 
            value={form.date}
            onChange={handleChange} 
            className="w-full p-2 border mb-2 rounded" 
            required 
          />
          <button 
            type="submit" 
            className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            disabled={loading}
          >
            {loading ? "Processing..." : "Pay ₹500"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookAppointment;