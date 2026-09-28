/**
 * Doctor Controller (controllers/doctorController.js)
 * ------------------------------------------------------------
 * Handles all business logic and SQL queries for Doctors.
 * 
 * Operations:
 * - getAllDoctors: View all doctors in hospital
 * - getDoctorById: View single doctor details
 * - createDoctor:  Add a new doctor
 * - updateDoctor:  Edit existing doctor profile
 * - deleteDoctor:  Remove a doctor record
 */

const db = require('../config/db');
const mockStore = require('../config/mockStore');

// 1. GET ALL DOCTORS
// Endpoint: GET /api/doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM doctors ORDER BY id DESC');
    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.warn('MySQL unavailable, using demo fallback doctors:', error.message);
    return res.status(200).json({
      success: true,
      isDemoMode: true,
      count: mockStore.doctors.length,
      data: [...mockStore.doctors].reverse()
    });
  }
};

// 2. GET SINGLE DOCTOR BY ID
// Endpoint: GET /api/doctors/:id
exports.getDoctorById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM doctors WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Doctor with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    const doctor = mockStore.doctors.find(d => d.id === Number(req.params.id));
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }
    return res.status(200).json({ success: true, isDemoMode: true, data: doctor });
  }
};

// 3. CREATE NEW DOCTOR
// Endpoint: POST /api/doctors
// Body: { name, specialization, phone, available_days }
exports.createDoctor = async (req, res) => {
  const { name, specialization, phone, available_days } = req.body;

  if (!name || !specialization || !phone || !available_days) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: name, specialization, phone, available_days.'
    });
  }

  try {
    const sql = 'INSERT INTO doctors (name, specialization, phone, available_days) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(sql, [name, specialization, phone, available_days]);

    return res.status(201).json({
      success: true,
      message: 'Doctor added successfully.',
      data: {
        id: result.insertId,
        name,
        specialization,
        phone,
        available_days
      }
    });
  } catch (error) {
    console.warn('MySQL unavailable, saving doctor to demo store:', error.message);
    const newId = mockStore.doctors.length > 0 ? Math.max(...mockStore.doctors.map(d => d.id)) + 1 : 1;
    const newDoctor = {
      id: newId,
      name,
      specialization,
      phone,
      available_days,
      created_at: new Date().toISOString()
    };
    mockStore.doctors.push(newDoctor);

    return res.status(201).json({
      success: true,
      isDemoMode: true,
      message: 'Doctor added successfully (Demo Mode).',
      data: newDoctor
    });
  }
};

// 4. UPDATE DOCTOR
// Endpoint: PUT /api/doctors/:id
// Body: { name, specialization, phone, available_days }
exports.updateDoctor = async (req, res) => {
  const { id } = req.params;
  const { name, specialization, phone, available_days } = req.body;

  if (!name || !specialization || !phone || !available_days) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: name, specialization, phone, available_days.'
    });
  }

  try {
    const sql = 'UPDATE doctors SET name = ?, specialization = ?, phone = ?, available_days = ? WHERE id = ?';
    const [result] = await db.query(sql, [name, specialization, phone, available_days, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Doctor with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Doctor updated successfully.',
      data: { id: Number(id), name, specialization, phone, available_days }
    });
  } catch (error) {
    console.warn('MySQL unavailable, updating doctor in demo store:', error.message);
    const index = mockStore.doctors.findIndex(d => d.id === Number(id));
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }
    mockStore.doctors[index] = {
      ...mockStore.doctors[index],
      name,
      specialization,
      phone,
      available_days
    };

    return res.status(200).json({
      success: true,
      isDemoMode: true,
      message: 'Doctor updated successfully (Demo Mode).',
      data: mockStore.doctors[index]
    });
  }
};

// 5. DELETE DOCTOR
// Endpoint: DELETE /api/doctors/:id
exports.deleteDoctor = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM doctors WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Doctor with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Doctor with ID ${id} deleted successfully.`
    });
  } catch (error) {
    console.warn('MySQL unavailable, deleting doctor from demo store:', error.message);
    const index = mockStore.doctors.findIndex(d => d.id === Number(id));
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Doctor not found.' });
    }
    mockStore.doctors.splice(index, 1);
    mockStore.appointments = mockStore.appointments.filter(a => a.doctor_id !== Number(id));

    return res.status(200).json({
      success: true,
      isDemoMode: true,
      message: `Doctor with ID ${id} deleted successfully (Demo Mode).`
    });
  }
};
