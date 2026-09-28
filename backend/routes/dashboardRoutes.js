/**
 * Dashboard Routes (routes/dashboardRoutes.js)
 * ------------------------------------------------------------
 * Defines endpoints for Admin Dashboard metrics:
 * - GET /api/dashboard/stats -> Total counts for summary cards
 */

const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Map to controller method
router.get('/stats', dashboardController.getDashboardStats);

module.exports = router;
