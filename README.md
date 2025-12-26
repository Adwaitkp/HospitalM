# 🏥 Hospital Management Website

A full-stack hospital management system built using **Node.js**, **Express**, **MongoDB**, and **React**.
This platform enables admins and doctors to manage patient records, appointments, and more. 
The app includes secure authentication, Razorpay payment integration, Google OAuth, and a user-friendly UI powered by Tailwind CSS.

🔗 **Live Demo**: [https://utkarsha.onrender.com](https://utkarsha.onrender.com)
Nurse page - https://utkarsha.onrender.com/adminlogin
Doctor page - https://utkarsha.onrender.com/doctorlogin
Nurse Login details = admin@example.com , adminpassword
Doctor login details = doctor@example.com , doctorpassword
--
## 📁 Project Structure

/backend - Express + MongoDB server (API)
├── .env - Environment variables
├── models, routes, controllers, config, etc.

/frontend - React client app
├── .env - Environment variables
├── pages, components, styles, etc.


---

## 🚀 Tech Stack

### Backend:
- Node.js
- Express
- MongoDB + Mongoose
- Passport (JWT & Google OAuth)
- Razorpay (payment integration)
- Nodemailer (email handling)
- BcryptJS (password hashing)

### Frontend:
- React 19
- Tailwind CSS 4
- React Router DOM 7
- CopilotKit (AI Copilot integration)
- GSAP (animations)
- Axios (HTTP client)

---

## 🔧 Setup Instructions

### ✅ Prerequisites:
- Node.js & npm
- MongoDB (local or Atlas)
- A code editor like VS Code

---

### 📦 Backend Setup
cd backend
npm install

If setting up manually, install these:
npm install express mongoose dotenv bcryptjs cors crypto nodemailer passport passport-jwt passport-google-oauth20 razorpay
npm install --save-dev nodemon

Create a .env file in /backend with your keys:

env
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
RAZORPAY_ID_KEY=your_razorpay_key
RAZORPAY_SECRET_KEY=your_razorpay_secret

Run Backend Server
npm run dev

run backend locally on - http://localhost:5000

🌐 Frontend Setup
cd frontend
npm install

If setting up manually, install these:
npm install react react-dom react-router-dom@7 axios tailwindcss @tailwindcss/vite motion @gsap/react
npm install @copilotkit/react-core @copilotkit/react-textarea @copilotkit/react-ui @copilotkit/runtime

Create a .env file in /frontend with:
VITE_API_URL=http://localhost:5000/api
VITE_COPILOT_API_KEY=your_copilot_api_key

Run Frontend
npm run dev
