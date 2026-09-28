import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { 
  UserCheck, 
  Search, 
  Edit2, 
  Trash2, 
  Stethoscope, 
  Phone, 
  CalendarDays 
} from 'lucide-react';

/**
 * Doctor Management Module
 * ------------------------------------------------------------
 * Handles CRUD operations for Doctors:
 * - View doctors list
 * - Add a doctor (Modal)
 * - Edit doctor details (Modal)
 * - Delete doctor with confirmation
 * Fields: id, name, specialization, phone, available_days
 */
const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    phone: '',
    available_days: 'Mon, Wed, Fri'
  });

  // Load doctors from backend
  const loadDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.getDoctors();
      if (res.success) {
        setDoctors(res.data);
        setFilteredDoctors(res.data);
      }
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to load doctors.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  // Filter doctors by name or specialization
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDoctors(doctors);
    } else {
      const q = searchQuery.toLowerCase();
      setFilteredDoctors(
        doctors.filter(
          (d) =>
            d.name.toLowerCase().includes(q) ||
            d.specialization.toLowerCase().includes(q) ||
            d.available_days.toLowerCase().includes(q)
        )
      );
    }
  }, [searchQuery, doctors]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenAddModal = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      specialization: '',
      phone: '',
      available_days: 'Mon to Fri'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      phone: doctor.phone,
      available_days: doctor.available_days
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDoctor(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.specialization || !formData.phone || !formData.available_days) {
      setAlert({ type: 'error', message: 'Please fill out all doctor fields.' });
      return;
    }

    try {
      if (editingDoctor) {
        await api.updateDoctor(editingDoctor.id, formData);
        setAlert({ type: 'success', message: 'Doctor details updated successfully!' });
      } else {
        await api.createDoctor(formData);
        setAlert({ type: 'success', message: 'New doctor added successfully!' });
      }

      handleCloseModal();
      loadDoctors();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to save doctor.' });
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove Dr. ${name}? Associated appointments will also be removed.`)) {
      return;
    }

    try {
      await api.deleteDoctor(id);
      setAlert({ type: 'success', message: `Dr. ${name} removed from hospital records.` });
      loadDoctors();
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete doctor.' });
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Doctor Management</h1>
          <p className="page-desc">Manage doctors, departmental specializations, and schedule availability.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <UserCheck size={18} />
          <span>Add New Doctor</span>
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
              placeholder="Search by doctor name, specialty..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredDoctors.length}</strong> doctors
          </span>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : filteredDoctors.length > 0 ? (
          <div className="responsive-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Doctor Name</th>
                  <th>Specialization</th>
                  <th>Phone Number</th>
                  <th>Available Days</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.map((doc) => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>#{doc.id}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{doc.name}</div>
                    </td>
                    <td>
                      <span className="badge badge-neutral" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                        {doc.specialization}
                      </span>
                    </td>
                    <td>{doc.phone}</td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
                        <CalendarDays size={14} />
                        {doc.available_days}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-secondary btn-icon" 
                          onClick={() => handleOpenEditModal(doc)}
                          title="Edit Doctor"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          className="btn btn-danger btn-icon" 
                          onClick={() => handleDelete(doc.id, doc.name)}
                          title="Delete Doctor"
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
            <Stethoscope size={42} className="empty-icon" />
            <div className="empty-title">No Doctors Found</div>
            <p>Add medical specialists or check your search keyword.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Doctor Modal */}
      <Modal 
        isOpen={isModalOpen} 
        title={editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor'}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleSubmit}>
          {/* Doctor Name */}
          <div className="form-group">
            <label className="form-label">Doctor Name *</label>
            <input 
              type="text" 
              name="name" 
              className="form-control" 
              placeholder="e.g. Dr. Rajesh Iyer"
              value={formData.name} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          {/* Specialization */}
          <div className="form-group">
            <label className="form-label">Specialization / Department *</label>
            <input 
              type="text" 
              name="specialization" 
              className="form-control" 
              placeholder="e.g. Cardiology, Orthopedics, Pediatrics"
              value={formData.specialization} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          {/* Contact Phone */}
          <div className="form-group">
            <label className="form-label">Phone Number *</label>
            <input 
              type="tel" 
              name="phone" 
              className="form-control" 
              placeholder="e.g. 9123456780"
              value={formData.phone} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          {/* Available Working Days */}
          <div className="form-group">
            <label className="form-label">Available Days *</label>
            <input 
              type="text" 
              name="available_days" 
              className="form-control" 
              placeholder="e.g. Mon, Wed, Fri or Mon to Sat"
              value={formData.available_days} 
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
              {editingDoctor ? 'Update Doctor' : 'Save Doctor'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Doctors;
