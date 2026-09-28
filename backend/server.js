/**
 * ============================================================
 * MediCare Hospital Management System - Server Entry Point
 * File: backend/server.js
 * ============================================================
 * This file configures the Express application, sets up middleware,
 * mounts API routes, and starts the HTTP server.
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. Load environment variables from .env file
dotenv.config();

// 2. Import route modules
const dashboardRoutes = require('./routes/dashboardRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const billRoutes = require('./routes/billRoutes');

// 3. Initialize Express application
const app = express();
const PORT = process.env.PORT || 5001;

// 4. Global Middleware
// Enable Cross-Origin Resource Sharing so React (running on port 5173) can talk to Express (port 5000)
app.use(cors());

// Parse incoming requests with JSON payloads (replaces body-parser)
app.use(express.json());

// Parse URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

// 5. Basic Welcome / Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🏥 Welcome to MediCare Hospital Management System API',
    status: 'Server is running smoothly',
    documentation: {
      dashboard: '/api/dashboard/stats',
      patients: '/api/patients',
      doctors: '/api/doctors',
      appointments: '/api/appointments',
      bills: '/api/bills'
    }
  });
});

// 6. Mount API Route Handlers
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/bills', billRoutes);

// 7. 404 Route Handler for undefined endpoints
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} does not exist.`
  });
});

// 8. Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error occurred.',
    error: err.message
  });
});

// 9. Start the Server
app.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 MediCare Server running on: http://localhost:${PORT}`);
  console.log(`📋 API Health Check:         http://localhost:${PORT}/`);
  console.log(`📊 Dashboard Stats API:      http://localhost:${PORT}/api/dashboard/stats`);
  console.log('====================================================');
});
