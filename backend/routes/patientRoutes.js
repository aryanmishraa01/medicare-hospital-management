/**
 * Patient Routes (routes/patientRoutes.js)
 * ------------------------------------------------------------
 * Defines endpoints for Patient operations:
 * - GET    /api/patients      -> View all patients
 * - GET    /api/patients/:id  -> View single patient
 * - POST   /api/patients      -> Add new patient
 * - PUT    /api/patients/:id  -> Update patient
 * - DELETE /api/patients/:id  -> Delete patient
 */

const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

// Map HTTP methods to controller methods
router.get('/', patientController.getAllPatients);
router.get('/:id', patientController.getPatientById);
router.post('/', patientController.createPatient);
router.put('/:id', patientController.updatePatient);
router.delete('/:id', patientController.deletePatient);

module.exports = router;
