/**
 * Patient Controller (controllers/patientController.js)
 * ------------------------------------------------------------
 * Handles all business logic and SQL queries for Patients.
 * 
 * Operations:
 * - getAllPatients: View all registered patients
 * - getPatientById: View single patient details
 * - createPatient:  Add a new patient
 * - updatePatient:  Edit existing patient information
 * - deletePatient:  Remove a patient record
 */

const db = require('../config/db');
const mockStore = require('../config/mockStore');

// 1. GET ALL PATIENTS
// Endpoint: GET /api/patients
exports.getAllPatients = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM patients ORDER BY id DESC');
    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.warn('MySQL unavailable, using demo fallback data:', error.message);
    return res.status(200).json({
      success: true,
      isDemoMode: true,
      count: mockStore.patients.length,
      data: [...mockStore.patients].reverse()
    });
  }
};

// 2. GET SINGLE PATIENT BY ID
// Endpoint: GET /api/patients/:id
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM patients WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    const patient = mockStore.patients.find(p => p.id === Number(req.params.id));
    if (!patient) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }
    return res.status(200).json({ success: true, isDemoMode: true, data: patient });
  }
};

// 3. CREATE NEW PATIENT
// Endpoint: POST /api/patients
// Body: { name, age, gender, phone, address }
exports.createPatient = async (req, res) => {
  const { name, age, gender, phone, address } = req.body;

  if (!name || !age || !gender || !phone || !address) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: name, age, gender, phone, address.'
    });
  }

  try {
    const sql = 'INSERT INTO patients (name, age, gender, phone, address) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.query(sql, [name, age, gender, phone, address]);

    return res.status(201).json({
      success: true,
      message: 'Patient registered successfully.',
      data: {
        id: result.insertId,
        name,
        age: Number(age),
        gender,
        phone,
        address
      }
    });
  } catch (error) {
    console.warn('MySQL unavailable, saving to demo memory store:', error.message);
    const newId = mockStore.patients.length > 0 ? Math.max(...mockStore.patients.map(p => p.id)) + 1 : 1;
    const newPatient = {
      id: newId,
      name,
      age: Number(age),
      gender,
      phone,
      address,
      created_at: new Date().toISOString()
    };
    mockStore.patients.push(newPatient);

    return res.status(201).json({
      success: true,
      isDemoMode: true,
      message: 'Patient registered successfully (Demo Mode).',
      data: newPatient
    });
  }
};

// 4. UPDATE PATIENT
// Endpoint: PUT /api/patients/:id
// Body: { name, age, gender, phone, address }
exports.updatePatient = async (req, res) => {
  const { id } = req.params;
  const { name, age, gender, phone, address } = req.body;

  if (!name || !age || !gender || !phone || !address) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields: name, age, gender, phone, address.'
    });
  }

  try {
    const sql = 'UPDATE patients SET name = ?, age = ?, gender = ?, phone = ?, address = ? WHERE id = ?';
    const [result] = await db.query(sql, [name, age, gender, phone, address, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Patient updated successfully.',
      data: { id: Number(id), name, age: Number(age), gender, phone, address }
    });
  } catch (error) {
    console.warn('MySQL unavailable, updating demo memory store:', error.message);
    const index = mockStore.patients.findIndex(p => p.id === Number(id));
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }
    mockStore.patients[index] = {
      ...mockStore.patients[index],
      name,
      age: Number(age),
      gender,
      phone,
      address
    };

    return res.status(200).json({
      success: true,
      isDemoMode: true,
      message: 'Patient updated successfully (Demo Mode).',
      data: mockStore.patients[index]
    });
  }
};

// 5. DELETE PATIENT
// Endpoint: DELETE /api/patients/:id
exports.deletePatient = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM patients WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Patient with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Patient with ID ${id} deleted successfully.`
    });
  } catch (error) {
    console.warn('MySQL unavailable, deleting from demo memory store:', error.message);
    const index = mockStore.patients.findIndex(p => p.id === Number(id));
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Patient not found.' });
    }
    mockStore.patients.splice(index, 1);
    // Also remove cascade appointments & bills in mock store
    mockStore.appointments = mockStore.appointments.filter(a => a.patient_id !== Number(id));
    mockStore.bills = mockStore.bills.filter(b => b.patient_id !== Number(id));

    return res.status(200).json({
      success: true,
      isDemoMode: true,
      message: `Patient with ID ${id} deleted successfully (Demo Mode).`
    });
  }
};
