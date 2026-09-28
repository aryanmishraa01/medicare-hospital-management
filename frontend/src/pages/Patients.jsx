import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { 
  UserPlus, 
  Search, 
  Edit2, 
  Trash2, 
  User, 
  Phone, 
  MapPin, 
  Calendar 
} from 'lucide-react';

/**
 * Patient Management Module
 * ------------------------------------------------------------
 * Handles CRUD operations for Patients:
 * - View patients list
 * - Add a patient (Modal)
 * - Edit patient details (Modal)
 * - Delete patient with confirmation
 * Fields: id, name, age, gender, phone, address
 */
const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    address: ''
  });

  // Fetch all patients from API
  const loadPatients = async () => {
    try {
      setLoading(true);
      const res = await api.getPatients();
      if (res.success) {
        setPatients(res.data);
        setFilteredPatients(res.data);
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to load patients.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  // Filter patients by name or phone
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPatients(patients);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredPatients(
        patients.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.phone.toLowerCase().includes(q) ||
            p.address.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, patients]);

  // Handle Form Inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open Add Patient Modal
  const handleOpenAddModal = () => {
    setEditingPatient(null);
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      phone: '',
      address: ''
    });
    setIsModalOpen(true);
  };

  // Open Edit Patient Modal
  const handleOpenEditModal = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address
    });
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  // Handle Form Submit (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic form validation
    if (!formData.name || !formData.age || !formData.phone || !formData.address) {
      setAlert({ type: 'error', message: 'Please fill out all patient fields.' });
      return;
    }

    try {
      if (editingPatient) {
        // Update Existing Patient
        const res = await api.updatePatient(editingPatient.id, formData);
        setAlert({ type: 'success', message: 'Patient updated successfully!' });
      } else {
        // Add New Patient
        const res = await api.createPatient(formData);
        setAlert({ type: 'success', message: 'Patient registered successfully!' });
      }

      handleCloseModal();
      loadPatients(); // Refresh list
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Operation failed.' });
    }
  };

  // Handle Delete Patient
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete patient "${name}"? This will also remove their appointments and bills.`)) {
      return;
    }

    try {
      await api.deletePatient(id);
      setAlert({ type: 'success', message: `Patient "${name}" deleted successfully!` });
      loadPatients();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete patient.' });
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Patient Management</h1>
          <p className="page-desc">Register, view, update, and manage hospital patients.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <UserPlus size={18} />
          <span>Add New Patient</span>
        </button>
      </div>

      {/* Alert Notification */}
      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert(null)} 
        />
      )}

      {/* Table & Toolbar Container */}
      <div className="table-container">
        <div className="table-toolbar">
          <div className="search-box">
            <Search size={18} color="var(--text-muted)" />
            <input 
              type="text"
              placeholder="Search patients by name, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredPatients.length}</strong> patients
          </span>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : filteredPatients.length > 0 ? (
          <div className="responsive-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient Name</th>
                  <th>Age / Gender</th>
                  <th>Phone Number</th>
                  <th>Address</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>#{patient.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{patient.name}</div>
                    </td>
                    <td>
                      <span>{patient.age} yrs</span> •{' '}
                      <span className="badge badge-neutral">{patient.gender}</span>
                    </td>
                    <td>{patient.phone}</td>
                    <td style={{ color: 'var(--text-muted)', maxWidth: '240px' }}>{patient.address}</td>
                    <td>
                      <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-secondary btn-icon" 
                          onClick={() => handleOpenEditModal(patient)}
                          title="Edit Patient"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="btn btn-danger btn-icon" 
                          onClick={() => handleDelete(patient.id, patient.name)}
                          title="Delete Patient"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <User size={42} className="empty-icon" />
            <div className="empty-title">No Patients Found</div>
            <p>Try searching with another name or add a new patient to the system.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Patient Modal */}
      <Modal 
        isOpen={isModalOpen} 
        title={editingPatient ? 'Edit Patient Details' : 'Register New Patient'}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleSubmit}>
          {/* Patient Name */}
          <div className="form-group">
            <label className="form-label">Full Name *</label>
            <input 
              type="text" 
              name="name" 
              className="form-control" 
              placeholder="e.g. Rahul Sharma"
              value={formData.name} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          {/* Age and Gender in a row */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Age *</label>
              <input 
                type="number" 
                name="age" 
                min="1" 
                max="120"
                className="form-control" 
                placeholder="e.g. 35"
                value={formData.age} 
                onChange={handleInputChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender *</label>
              <select 
                name="gender" 
                className="form-control" 
                value={formData.gender} 
                onChange={handleInputChange}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Phone Number */}
          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input 
              type="tel" 
              name="phone" 
              className="form-control" 
              placeholder="e.g. 9876543210"
              value={formData.phone} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          {/* Residential Address */}
          <div className="form-group">
            <label className="form-label">Address *</label>
            <textarea 
              name="address" 
              className="form-control" 
              placeholder="e.g. Flat 204, Park Street, City"
              value={formData.address} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          {/* Modal Actions */}
          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingPatient ? 'Update Patient' : 'Save Patient'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Patients;
