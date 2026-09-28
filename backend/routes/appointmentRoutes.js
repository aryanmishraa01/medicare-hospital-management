/**
 * Appointment Routes (routes/appointmentRoutes.js)
 * ------------------------------------------------------------
 * Defines endpoints for Appointment operations:
 * - GET    /api/appointments      -> View all appointments
 * - GET    /api/appointments/:id  -> View single appointment
 * - POST   /api/appointments      -> Book appointment
 * - PUT    /api/appointments/:id  -> Update appointment status / schedule
 * - DELETE /api/appointments/:id  -> Cancel/Delete appointment
 */

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Map HTTP methods to controller methods
router.get('/', appointmentController.getAllAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.post('/', appointmentController.createAppointment);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
