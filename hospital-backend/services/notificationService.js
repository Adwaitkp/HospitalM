const Notification = require("../models/Notification");
const nodemailer = require("nodemailer");
const { format } = require('date-fns');

const notificationService = {
  // Create a notification
  async createNotification(userId, title, message, symptom, type, relatedId = null) {
    try {
      const notification = new Notification({
        userId,
        title,
        message,
        symptom,
        type,
        relatedId
      });

      return await notification.save();
    } catch (error) {
      console.error("Error creating notification:", error.message);
      throw new Error("Failed to create notification.");
    }
  },

  // Send appointment confirmation
  async sendAppointmentConfirmation(appointment) {
    try {
      if (!appointment || !appointment.userId || !appointment.email) {
        throw new Error("Invalid appointment data");
      }

      // Format the date properly
      const appointmentDate = appointment.assignedDate || appointment.date;
      const formattedDate = typeof appointmentDate === 'string' 
        ? appointmentDate 
        : format(new Date(appointmentDate), 'MMM dd, yyyy');
      
      const appointmentMessage = `Your appointment is scheduled for ${formattedDate} at ${appointment.appointmentTime}.`;

      const inAppNotification = await this.createNotification(
        appointment.userId,
        "Appointment Scheduled",
        appointmentMessage,
        appointment.symptom || null,
        "appointment",
        appointment._id
      );

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #333; text-align: center;">Appointment Confirmation</h2>
          
          <p>Dear ${appointment.name},</p>
          
          <p>${appointmentMessage}</p>
          
          <p><strong>Symptom:</strong> ${appointment.symptom || "Not specified"}</p>
          
          <p>Please arrive 15 minutes before your scheduled time.</p>
          
          <p>Thank you for choosing our hospital.</p>
        </div>
      `;

      // Only attempt to send email if email credentials are configured
      let emailResult = null;
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        console.log("Sending email to:", appointment.email);
        emailResult = await this.sendEmail(
          appointment.email,
          "Your Appointment Has Been Scheduled",
          appointmentMessage,
          emailHtml
        );
      } else {
        console.warn("Email not sent: Missing email credentials in environment variables");
      }

      return {
        notification: inAppNotification,
        emailSent: !!emailResult
      };
    } catch (error) {
      console.error("Appointment confirmation error:", error.message);
      // Don't throw here to prevent app crashes
      return {
        notification: null,
        emailSent: false,
        error: error.message
      };
    }
  },

  // Send email function using nodemailer
  async sendEmail(to, subject, text, html) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("Email credentials not configured");
      return null;
    }
    
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        text,
        html
      };

      const result = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully:", result.messageId);
      return result;
    } catch (error) {
      console.error("Error sending email:", error.message);
      // Don't throw to prevent app crashes
      return null;
    }
  }
};

module.exports = notificationService;