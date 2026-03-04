import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/api";

const AppointmentBookingCopilot = ({ token, user }) => {
  const [appointmentData, setAppointmentData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    symptom: "",
    date: "",
  });

  // Make user context available to Copilot
  useCopilotReadable({
    description: "Current logged-in user information",
    value: user ? {
      name: user.name,
      email: user.email,
      isLoggedIn: true,
    } : {
      isLoggedIn: false,
    },
  });

  // Make appointment booking state readable by Copilot
  useCopilotReadable({
    description: "Current appointment booking data being collected",
    value: appointmentData,
  });

  // Action: Start appointment booking process
  useCopilotAction({
    name: "startAppointmentBooking",
    description: "Initiates the appointment booking process. Call this when user wants to book an appointment.",
    parameters: [],
    handler: async () => {
      if (!token || !user) {
        return "Please log in first to book an appointment. You can log in at the Login page.";
      }
      return "Great! I'll help you book an appointment. I need a few details: your full name, age, gender, phone number, symptoms or reason for visit, and your preferred appointment date (in YYYY-MM-DD format). You can provide all at once or one by one.";
    },
  });

  // Action: Collect appointment information
  useCopilotAction({
    name: "collectAppointmentInfo",
    description: "Collects and stores appointment details from the user. Extract information from user's message.",
    parameters: [
      {
        name: "name",
        type: "string",
        description: "Patient's full name",
        required: false,
      },
      {
        name: "age",
        type: "number",
        description: "Patient's age",
        required: false,
      },
      {
        name: "gender",
        type: "string",
        description: "Patient's gender (Male, Female, or Other)",
        required: false,
      },
      {
        name: "phone",
        type: "string",
        description: "Patient's 10-digit phone number",
        required: false,
      },
      {
        name: "symptom",
        type: "string",
        description: "Symptoms or reason for visit",
        required: false,
      },
      {
        name: "date",
        type: "string",
        description: "Preferred appointment date in YYYY-MM-DD format",
        required: false,
      },
    ],
    handler: async ({ name, age, gender, phone, symptom, date }) => {
      const updated = { ...appointmentData };
      
      if (name) updated.name = name;
      if (age) updated.age = age.toString();
      if (gender) updated.gender = gender;
      if (phone) updated.phone = phone;
      if (symptom) updated.symptom = symptom;
      if (date) updated.date = date;

      setAppointmentData(updated);

      // Check what's still missing
      const missing = [];
      if (!updated.name) missing.push("name");
      if (!updated.age) missing.push("age");
      if (!updated.gender) missing.push("gender");
      if (!updated.phone) missing.push("phone");
      if (!updated.symptom) missing.push("symptoms");
      if (!updated.date) missing.push("preferred date");

      if (missing.length === 0) {
        return `Perfect! Here's what I have:\n\n📋 Name: ${updated.name}\n🎂 Age: ${updated.age}\n👤 Gender: ${updated.gender}\n📱 Phone: ${updated.phone}\n🏥 Symptoms: ${updated.symptom}\n📅 Date: ${updated.date}\n\nIs this correct? If yes, I'll proceed with payment (₹500). If you want to change anything, just let me know!`;
      } else {
        return `Got it! I still need: ${missing.join(", ")}. Please provide the missing information.`;
      }
    },
  });

  // Action: Confirm and proceed to payment
  useCopilotAction({
    name: "proceedToPayment",
    description: "Confirms appointment details and initiates payment process. Call this when user confirms the details.",
    parameters: [],
    handler: async () => {
      const { name, age, gender, phone, symptom, date } = appointmentData;

      if (!name || !age || !gender || !phone || !symptom || !date) {
        return "Some information is still missing. Please provide all required details first.";
      }

      if (!token) {
        return "Please log in to complete the booking.";
      }

      // Initiate Razorpay payment
      try {
        // Load Razorpay script
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        document.body.appendChild(script);

        await new Promise((resolve) => {
          script.onload = resolve;
          script.onerror = () => resolve();
        });

        // Create order
        const orderData = await axios.post(
          `${API_URL}/payment/create-order`,
          { amount: 500 },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!orderData.data.success) {
          return "Failed to create payment order. Please try again.";
        }

        // Open Razorpay checkout
        const options = {
          key: orderData.data.key_id,
          amount: orderData.data.amount,
          currency: "INR",
          name: "Utkarsha nursing home",
          description: "AI Assisted Appointment Booking",
          order_id: orderData.data.order_id,
          handler: async (response) => {
            try {
              // Verify payment
              const verifyData = await axios.post(
                `${API_URL}/payment/verify-payment`,
                response,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (verifyData.data.success) {
                // Book appointment
                const appointmentResponse = await axios.post(
                  `${API_URL}/book/appointment`,
                  {
                    name: appointmentData.name,
                    age: parseInt(appointmentData.age),
                    gender: appointmentData.gender,
                    phone: appointmentData.phone,
                    symptom: appointmentData.symptom,
                    date: appointmentData.date,
                    paymentId: response.razorpay_payment_id,
                    orderId: response.razorpay_order_id,
                    amount: 500,
                  },
                  { headers: { Authorization: `Bearer ${token}` } }
                );

                if (appointmentResponse.data.success) {
                  // Reset appointment data
                  setAppointmentData({
                    name: "",
                    age: "",
                    gender: "",
                    phone: "",
                    symptom: "",
                    date: "",
                  });
                  
                  alert(" Appointment booked successfully! Check your profile for details.");
                }
              }
            } catch (error) {
              console.error("Booking error:", error);
              alert("Error booking appointment. Please try again.");
            }
          },
          prefill: {
            name: appointmentData.name,
            email: user?.email || "",
            contact: appointmentData.phone,
          },
          theme: { color: "#10B981" },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

        return "Opening payment gateway... Please complete the payment to confirm your appointment.";
      } catch (error) {
        console.error("Payment error:", error);
        return "Failed to initiate payment. Please try again or use the regular booking form.";
      }
    },
  });

  // Action: Cancel/reset appointment booking
  useCopilotAction({
    name: "cancelAppointmentBooking",
    description: "Cancels the current appointment booking process and clears all collected data",
    parameters: [],
    handler: async () => {
      setAppointmentData({
        name: "",
        age: "",
        gender: "",
        phone: "",
        symptom: "",
        date: "",
      });
      return "Appointment booking cancelled. All data cleared. Let me know if you want to start over or need any other help!";
    },
  });

  return null; // This component doesn't render anything
};

export default AppointmentBookingCopilot;
