# Hospital Management Website

A full-stack Hospital Management platform built with Node.js, Express, MongoDB, and React.
It supports role-based access for admins and doctors, appointment workflows, payment processing, email notifications, and AI-assisted appointment/chat features.

## Live Demo

- Main app: https://utkarsha.onrender.com
- Doctor login: https://utkarsha.onrender.com/doctorlogin
- Admin login: https://utkarsha.onrender.com/adminlogin

### Demo Credentials

Use these accounts for testing:

- Doctor
	- Email: doctor@example.com
	- Password: doctorpassword
- Admin
	- Email: admin@example.com
	- Password: adminpassword

## Features

- Role-based authentication (User, Doctor, Admin)
- JWT auth and Google OAuth support
- Appointment booking and management
- Admin and doctor dashboards
- Razorpay payment integration
- Notification service (email)
- AI appointment/chat integration
- React frontend with routed pages and reusable components

## Project Structure

```text
HospitalM/
|-- README.md
|-- hospital-backend/
|   |-- package.json
|   |-- passportConfig.js
|   |-- server.js
|   |-- controllers/
|   |   |-- aiChatController.js
|   |   |-- paymentController.js
|   |-- middleware/
|   |   |-- authMiddleware.js
|   |   |-- isadminMiddleware.js
|   |   |-- isdoctorMiddleware.js
|   |-- models/
|   |   |-- Admin.js
|   |   |-- Appointment.js
|   |   |-- Doctor.js
|   |   |-- Notification.js
|   |   |-- User.js
|   |-- Rolepage/
|   |   |-- createadmin.js
|   |   |-- createdocter.js
|   |-- routes/
|   |   |-- admindashboardRoutes.js
|   |   |-- adminloginRoutes.js
|   |   |-- aiChatRoutes.js
|   |   |-- appointmentRoutes.js
|   |   |-- authRoutes.js
|   |   |-- doctordashboardRoutes.js
|   |   |-- doctorloginRoutes.js
|   |   |-- paymentRoutes.js
|   |-- services/
|       |-- aiAppointmentService.js
|       |-- notificationService.js
|-- hospital-frontend/
    |-- eslint.config.js
    |-- index.html
    |-- package.json
    |-- README.md
    |-- vite.config.js
    |-- public/
    |-- src/
        |-- App.css
        |-- App.jsx
        |-- index.css
        |-- index.js
        |-- main.jsx
        |-- assets/
        |-- component/
        |   |-- adminnavbar.jsx
        |   |-- AppointmentBookingCopilot.jsx
        |   |-- doctornavbar.jsx
        |   |-- Navbarroute.jsx
        |   |-- OAuthCallback.jsx
        |   |-- Prescription.jsx
        |   |-- usernavbar.jsx
        |-- config/
        |   |-- api.js
        |-- pages/
            |-- AboutUs.jsx
            |-- admindashboard.jsx
            |-- Adminlogin.jsx
            |-- BookAppointment.jsx
            |-- doctordashboard.jsx
            |-- doctorlogin.jsx
            |-- Home.jsx
            |-- Login.jsx
            |-- Profile.jsx
            |-- Register.jsx
```

## Tech Stack

### Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- Passport (JWT + Google OAuth)
- Razorpay
- Nodemailer
- BcryptJS

### Frontend

- React 19
- React Router DOM 7
- Tailwind CSS 4
- Axios
- CopilotKit
- GSAP + Motion
- Vite

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- MongoDB (local or Atlas)

### 1. Clone and install

```bash
git clone <your-repository-url>
cd HospitalM
```

#### Backend install

```bash
cd hospital-backend
npm install
```

#### Frontend install

```bash
cd ../hospital-frontend
npm install
```

### 2. Environment variables

Create a `.env` file in `hospital-backend/`:

```env
PORT=5000
JWT_SECRET=your_jwt_secret

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

RAZORPAY_ID_KEY=your_razorpay_id_key
RAZORPAY_SECRET_KEY=your_razorpay_secret_key

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password

OPENAI_API_KEY=your_openai_api_key
```

Create a `.env` file in `hospital-frontend/`:

```env
VITE_COPILOT_API_KEY=your_copilotkit_public_api_key
```

Note: API base URL is currently configured in `hospital-frontend/src/config/api.js`.

### 3. Run the project

Run backend:

```bash
cd hospital-backend
npm run dev
```

Run frontend:

```bash
cd hospital-frontend
npm run dev
```

Frontend default: http://localhost:5173  
Backend default: http://localhost:5000

## Scripts

### Backend (`hospital-backend/package.json`)

- `npm run dev` - Start backend with nodemon
- `npm start` - Start backend with node

### Frontend (`hospital-frontend/package.json`)

- `npm run dev` - Start Vite dev server
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Routes (High Level)

- `/api/auth` - User auth and OAuth routes
- `/api/book` - Appointment booking routes
- `/api/admin` - Admin auth routes
- `/api/doctor` - Doctor auth routes
- `/api/admin/appointments` - Admin appointment management
- `/api/doctor/appointments` - Doctor appointment management
- `/api/payment` - Payment routes
- `/api/ai` - AI chat/assistant routes

## License

This project is licensed under the ISC License.
