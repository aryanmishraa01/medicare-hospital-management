/**
 * Dashboard Controller (controllers/dashboardController.js)
 * ------------------------------------------------------------
 * Computes summary metrics for the Admin Dashboard cards:
 * - Total Patients
 * - Total Doctors
 * - Total Appointments
 * - Total Bills generated
 * Also returns latest appointments for quick dashboard preview.
 */

const db = require('../config/db');
const mockStore = require('../config/mockStore');

// GET DASHBOARD SUMMARY METRICS
// Endpoint: GET /api/dashboard/stats
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Total Patients
    const [[{ total_patients }]] = await db.query('SELECT COUNT(*) AS total_patients FROM patients');

    // 2. Total Doctors
    const [[{ total_doctors }]] = await db.query('SELECT COUNT(*) AS total_doctors FROM doctors');

    // 3. Total Appointments
    const [[{ total_appointments }]] = await db.query('SELECT COUNT(*) AS total_appointments FROM appointments');

    // 4. Total Bills
    const [[{ total_bills }]] = await db.query('SELECT COUNT(*) AS total_bills FROM bills');

    // 5. Total Revenue & Pending Amounts
    const [[revenue]] = await db.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN payment_status = 'Paid' THEN amount ELSE 0 END), 0) AS total_revenue,
        COALESCE(SUM(CASE WHEN payment_status = 'Pending' THEN amount ELSE 0 END), 0) AS total_pending
      FROM bills
    `);

    // 6. Recent 5 Appointments
    const [recentAppointments] = await db.query(`
      SELECT 
        a.id,
        p.name AS patient_name,
        d.name AS doctor_name,
        d.specialization,
        DATE_FORMAT(a.appointment_date, '%Y-%m-%d') AS appointment_date,
        a.appointment_time,
        a.status
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date DESC, a.appointment_time ASC
      LIMIT 5
    `);

    return res.status(200).json({
      success: true,
      data: {
        total_patients: Number(total_patients),
        total_doctors: Number(total_doctors),
        total_appointments: Number(total_appointments),
        total_bills: Number(total_bills),
        total_revenue: Number(revenue.total_revenue),
        total_pending: Number(revenue.total_pending),
        recent_appointments: recentAppointments
      }
    });
  } catch (error) {
    console.warn('MySQL unavailable, computing dashboard metrics from demo store:', error.message);

    const total_revenue = mockStore.bills
      .filter(b => b.payment_status === 'Paid')
      .reduce((sum, b) => sum + Number(b.amount), 0);

    const total_pending = mockStore.bills
      .filter(b => b.payment_status === 'Pending')
      .reduce((sum, b) => sum + Number(b.amount), 0);

    const recentAppointments = [...mockStore.appointments].reverse().slice(0, 5);

    return res.status(200).json({
      success: true,
      isDemoMode: true,
      data: {
        total_patients: mockStore.patients.length,
        total_doctors: mockStore.doctors.length,
        total_appointments: mockStore.appointments.length,
        total_bills: mockStore.bills.length,
        total_revenue,
        total_pending,
        recent_appointments: recentAppointments
      }
    });
  }
};
