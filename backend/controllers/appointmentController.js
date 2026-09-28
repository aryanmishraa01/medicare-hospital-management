/**
 * Appointment Controller (controllers/appointmentController.js)
 * ------------------------------------------------------------
 * Handles all business logic and SQL queries for Appointments.
 * 
 * Operations:
 * - getAllAppointments: View all appointments with Patient and Doctor names (SQL JOIN)
 * - getAppointmentById: View single appointment details
 * - createAppointment:  Book a new appointment
 * - updateAppointment:  Update appointment status or schedule
 * - deleteAppointment:  Delete/Cancel an appointment record
 */

const db = require('../config/db');
const mockStore = require('../config/mockStore');

// 1. GET ALL APPOINTMENTS (Using SQL JOIN for patient & doctor names)
// Endpoint: GET /api/appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const sql = `
      SELECT 
        a.id,
        a.patient_id,
        p.name AS patient_name,
        p.phone AS patient_phone,
        a.doctor_id,
        d.name AS doctor_name,
        d.specialization AS doctor_specialization,
        DATE_FORMAT(a.appointment_date, '%Y-%m-%d') AS appointment_date,
        a.appointment_time,
        a.status,
        a.created_at
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.appointment_date DESC, a.appointment_time ASC
    `;

    const [rows] = await db.query(sql);
    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.warn('MySQL unavailable, using demo fallback appointments:', error.message);
    return res.status(200).json({
      success: true,
      isDemoMode: true,
      count: mockStore.appointments.length,
      data: [...mockStore.appointments].reverse()
    });
  }
};

// 2. GET SINGLE APPOINTMENT BY ID
// Endpoint: GET /api/appointments/:id
exports.getAppointmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT 
        a.id,
        a.patient_id,
        p.name AS patient_name,
        a.doctor_id,
        d.name AS doctor_name,
        d.specialization AS doctor_specialization,
        DATE_FORMAT(a.appointment_date, '%Y-%m-%d') AS appointment_date,
        a.appointment_time,
        a.status
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      WHERE a.id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Appointment with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    const appt = mockStore.appointments.find(a => a.id === Number(req.params.id));
    if (!appt) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    return res.status(200).json({ success: true, isDemoMode: true, data: appt });
  }
};

// 3. BOOK / CREATE NEW APPOINTMENT
// Endpoint: POST /api/appointments
// Body: { patient_id, doctor_id, appointment_date, appointment_time, status }
exports.createAppointment = async (req, res) => {
  const { patient_id, doctor_id, appointment_date, appointment_time, status } = req.body;

  if (!patient_id || !doctor_id || !appointment_date || !appointment_time) {
    return res.status(400).json({
      success: false,
      message: 'Please provide patient_id, doctor_id, appointment_date, and appointment_time.'
    });
  }

  const appointmentStatus = status || 'Scheduled';

  try {
    const sql = `
      INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(sql, [
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      appointmentStatus
    ]);

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      data: {
        id: result.insertId,
        patient_id,
        doctor_id,
        appointment_date,
        appointment_time,
        status: appointmentStatus
      }
    });
  } catch (error) {
    console.warn('MySQL unavailable, booking in demo store:', error.message);
    const pat = mockStore.patients.find(p => p.id === Number(patient_id));
    const doc = mockStore.doctors.find(d => d.id === Number(doctor_id));

    const newId = mockStore.appointments.length > 0 ? Math.max(...mockStore.appointments.map(a => a.id)) + 1 : 1;
    const newAppt = {
      id: newId,
      patient_id: Number(patient_id),
      patient_name: pat ? pat.name : 'Unknown Patient',
      patient_phone: pat ? pat.phone : '',
      doctor_id: Number(doctor_id),
      doctor_name: doc ? doc.name : 'Unknown Doctor',
      doctor_specialization: doc ? doc.specialization : '',
      appointment_date,
      appointment_time,
      status: appointmentStatus,
      created_at: new Date().toISOString()
    };
    mockStore.appointments.push(newAppt);

    return res.status(201).json({
      success: true,
      isDemoMode: true,
      message: 'Appointment booked successfully (Demo Mode).',
      data: newAppt
    });
  }
};

// 4. UPDATE APPOINTMENT (Status, Date, Time)
// Endpoint: PUT /api/appointments/:id
// Body: { status, appointment_date, appointment_time }
exports.updateAppointment = async (req, res) => {
  const { id } = req.params;
  const { status, appointment_date, appointment_time } = req.body;

  const validStatuses = ['Scheduled', 'Completed', 'Cancelled'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be one of: Scheduled, Completed, Cancelled.'
    });
  }

  try {
    let sql = '';
    let params = [];

    if (appointment_date && appointment_time && status) {
      sql = 'UPDATE appointments SET status = ?, appointment_date = ?, appointment_time = ? WHERE id = ?';
      params = [status, appointment_date, appointment_time, id];
    } else if (status) {
      sql = 'UPDATE appointments SET status = ? WHERE id = ?';
      params = [status, id];
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide status to update.'
      });
    }

    const [result] = await db.query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Appointment with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment updated successfully.'
    });
  } catch (error) {
    console.warn('MySQL unavailable, updating demo store appointment:', error.message);
    const index = mockStore.appointments.findIndex(a => a.id === Number(id));
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }

    if (status) mockStore.appointments[index].status = status;
    if (appointment_date) mockStore.appointments[index].appointment_date = appointment_date;
    if (appointment_time) mockStore.appointments[index].appointment_time = appointment_time;

    return res.status(200).json({
      success: true,
      isDemoMode: true,
      message: 'Appointment updated successfully (Demo Mode).',
      data: mockStore.appointments[index]
    });
  }
};

// 5. DELETE APPOINTMENT
// Endpoint: DELETE /api/appointments/:id
exports.deleteAppointment = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM appointments WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Appointment with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Appointment with ID ${id} deleted successfully.`
    });
  } catch (error) {
    console.warn('MySQL unavailable, deleting demo store appointment:', error.message);
    const index = mockStore.appointments.findIndex(a => a.id === Number(id));
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Appointment not found.' });
    }
    mockStore.appointments.splice(index, 1);

    return res.status(200).json({
      success: true,
      isDemoMode: true,
      message: `Appointment with ID ${id} deleted successfully (Demo Mode).`
    });
  }
};
