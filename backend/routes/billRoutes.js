/**
 * Billing Routes (routes/billRoutes.js)
 * ------------------------------------------------------------
 * Defines endpoints for Bill / Invoice operations:
 * - GET    /api/bills      -> View all bills
 * - GET    /api/bills/:id  -> View single bill
 * - POST   /api/bills      -> Generate a bill
 * - DELETE /api/bills/:id  -> Delete a bill
 */

const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');

// Map HTTP methods to controller methods
router.get('/', billController.getAllBills);
router.get('/:id', billController.getBillById);
router.post('/', billController.createBill);
router.delete('/:id', billController.deleteBill);

module.exports = router;
