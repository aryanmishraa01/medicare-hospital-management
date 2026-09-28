/**
 * Billing Controller (controllers/billController.js)
 * ------------------------------------------------------------
 * Handles all business logic and SQL queries for Patient Invoices/Bills.
 * 
 * Operations:
 * - getAllBills: View all hospital bills with Patient names (SQL JOIN)
 * - getBillById: View single invoice details
 * - createBill:  Generate a new bill for a patient
 * - deleteBill:  Remove a bill record
 */

const db = require('../config/db');
const mockStore = require('../config/mockStore');

// 1. GET ALL BILLS (Joined with patient name)
// Endpoint: GET /api/bills
exports.getAllBills = async (req, res) => {
  try {
    const sql = `
      SELECT 
        b.id,
        b.patient_id,
        p.name AS patient_name,
        p.phone AS patient_phone,
        b.amount,
        b.payment_status,
        DATE_FORMAT(b.bill_date, '%Y-%m-%d') AS bill_date,
        b.created_at
      FROM bills b
      JOIN patients p ON b.patient_id = p.id
      ORDER BY b.id DESC
    `;

    const [rows] = await db.query(sql);
    return res.status(200).json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (error) {
    console.warn('MySQL unavailable, using demo fallback bills:', error.message);
    return res.status(200).json({
      success: true,
      isDemoMode: true,
      count: mockStore.bills.length,
      data: [...mockStore.bills].reverse()
    });
  }
};

// 2. GET SINGLE BILL BY ID
// Endpoint: GET /api/bills/:id
exports.getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const sql = `
      SELECT 
        b.id,
        b.patient_id,
        p.name AS patient_name,
        b.amount,
        b.payment_status,
        DATE_FORMAT(b.bill_date, '%Y-%m-%d') AS bill_date
      FROM bills b
      JOIN patients p ON b.patient_id = p.id
      WHERE b.id = ?
    `;

    const [rows] = await db.query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Bill with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    const bill = mockStore.bills.find(b => b.id === Number(req.params.id));
    if (!bill) {
      return res.status(404).json({ success: false, message: 'Bill not found.' });
    }
    return res.status(200).json({ success: true, isDemoMode: true, data: bill });
  }
};

// 3. CREATE / GENERATE NEW BILL
// Endpoint: POST /api/bills
// Body: { patient_id, amount, payment_status, bill_date }
exports.createBill = async (req, res) => {
  const { patient_id, amount, payment_status, bill_date } = req.body;

  if (!patient_id || amount === undefined || !bill_date) {
    return res.status(400).json({
      success: false,
      message: 'Please provide patient_id, amount, and bill_date.'
    });
  }

  const status = payment_status || 'Pending';

  try {
    const sql = 'INSERT INTO bills (patient_id, amount, payment_status, bill_date) VALUES (?, ?, ?, ?)';
    const [result] = await db.query(sql, [patient_id, amount, status, bill_date]);

    return res.status(201).json({
      success: true,
      message: 'Bill created successfully.',
      data: {
        id: result.insertId,
        patient_id: Number(patient_id),
        amount: Number(amount),
        payment_status: status,
        bill_date
      }
    });
  } catch (error) {
    console.warn('MySQL unavailable, creating bill in demo store:', error.message);
    const pat = mockStore.patients.find(p => p.id === Number(patient_id));
    const newId = mockStore.bills.length > 0 ? Math.max(...mockStore.bills.map(b => b.id)) + 1 : 1;
    const newBill = {
      id: newId,
      patient_id: Number(patient_id),
      patient_name: pat ? pat.name : 'Unknown Patient',
      amount: Number(amount),
      payment_status: status,
      bill_date,
      created_at: new Date().toISOString()
    };
    mockStore.bills.push(newBill);

    return res.status(201).json({
      success: true,
      isDemoMode: true,
      message: 'Bill created successfully (Demo Mode).',
      data: newBill
    });
  }
};

// 4. DELETE BILL
// Endpoint: DELETE /api/bills/:id
exports.deleteBill = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM bills WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: `Bill with ID ${id} not found.`
      });
    }

    return res.status(200).json({
      success: true,
      message: `Bill with ID ${id} deleted successfully.`
    });
  } catch (error) {
    console.warn('MySQL unavailable, deleting bill from demo store:', error.message);
    const index = mockStore.bills.findIndex(b => b.id === Number(id));
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Bill not found.' });
    }
    mockStore.bills.splice(index, 1);

    return res.status(200).json({
      success: true,
      isDemoMode: true,
      message: `Bill with ID ${id} deleted successfully (Demo Mode).`
    });
  }
};
