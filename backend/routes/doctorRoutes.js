/**
 * Doctor Routes (routes/doctorRoutes.js)
 * ------------------------------------------------------------
 * Defines endpoints for Doctor operations:
 * - GET    /api/doctors      -> View all doctors
 * - GET    /api/doctors/:id  -> View single doctor
 * - POST   /api/doctors      -> Add new doctor
 * - PUT    /api/doctors/:id  -> Update doctor
 * - DELETE /api/doctors/:id  -> Delete doctor
 */

const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');

// Map HTTP methods to controller methods
router.get('/', doctorController.getAllDoctors);
router.get('/:id', doctorController.getDoctorById);
router.post('/', doctorController.createDoctor);
router.put('/:id', doctorController.updateDoctor);
router.delete('/:id', doctorController.deleteDoctor);

module.exports = router;
