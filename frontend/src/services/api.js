/**
 * API Service (services/api.js)
 * ------------------------------------------------------------
 * Centralized API calls using standard JavaScript fetch().
 * 
 * Base URL points to the Express backend (port 5001).
 * Easy to explain in viva: No Axios needed, pure native fetch!
 */

const API_BASE_URL = 'http://localhost:5001/api';

// Helper function to handle JSON fetch requests and error checking
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // 1. Dashboard Stats
  getDashboardStats: () => request('/dashboard/stats'),

  // 2. Patient Management
  getPatients: () => request('/patients'),
  getPatientById: (id) => request(`/patients/${id}`),
  createPatient: (patientData) => request('/patients', {
    method: 'POST',
    body: JSON.stringify(patientData)
  }),
  updatePatient: (id, patientData) => request(`/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(patientData)
  }),
  deletePatient: (id) => request(`/patients/${id}`, {
    method: 'DELETE'
  }),

  // 3. Doctor Management
  getDoctors: () => request('/doctors'),
  getDoctorById: (id) => request(`/doctors/${id}`),
  createDoctor: (doctorData) => request('/doctors', {
    method: 'POST',
    body: JSON.stringify(doctorData)
  }),
  updateDoctor: (id, doctorData) => request(`/doctors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(doctorData)
  }),
  deleteDoctor: (id) => request(`/doctors/${id}`, {
    method: 'DELETE'
  }),

  // 4. Appointment Management
  getAppointments: () => request('/appointments'),
  getAppointmentById: (id) => request(`/appointments/${id}`),
  createAppointment: (appointmentData) => request('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData)
  }),
  updateAppointment: (id, updateData) => request(`/appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updateData)
  }),
  deleteAppointment: (id) => request(`/appointments/${id}`, {
    method: 'DELETE'
  }),

  // 5. Billing Management
  getBills: () => request('/bills'),
  getBillById: (id) => request(`/bills/${id}`),
  createBill: (billData) => request('/bills', {
    method: 'POST',
    body: JSON.stringify(billData)
  }),
  deleteBill: (id) => request(`/bills/${id}`, {
    method: 'DELETE'
  })
};
