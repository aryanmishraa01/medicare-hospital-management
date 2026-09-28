import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { 
  CalendarCheck, 
  Search, 
  Trash2, 
  Clock, 
  Calendar, 
  PlusCircle, 
  User, 
  Stethoscope,
  Filter
} from 'lucide-react';

/**
 * Appointment Management Module
 * ------------------------------------------------------------
 * Handles Appointment Operations:
 * - Book an appointment (select patient & doctor from dropdown)
 * - View all appointments with Patient Name & Doctor Name
 * - Update status (Scheduled / Completed / Cancelled)
 * - Delete an appointment
 * Fields: id, patient_id, doctor_id, appointment_date, appointment_time, status
 */
const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Modal State for Booking
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patient_id: '',
    doctor_id: '',
    appointment_date: '',
    appointment_time: '10:00 AM',
    status: 'Scheduled'
  });

  // Load all initial data (Appointments, Patients, Doctors)
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [apptRes, patRes, docRes] = await Promise.all([
        api.getAppointments(),
        api.getPatients(),
        api.getDoctors()
      ]);

      if (apptRes.success) setAppointments(apptRes.data);
      if (patRes.success) setPatients(patRes.data);
      if (docRes.success) setDoctors(docRes.data);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to load appointment records.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Filter appointments by search query and status filter
  useEffect(() => {
    let result = appointments;

    // Filter by status tab
    if (statusFilter !== 'All') {
      result = result.filter((a) => a.status === statusFilter);
    }

    // Filter by search keyword (Patient Name or Doctor Name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          (a.patient_name && a.patient_name.toLowerCase().includes(q)) ||
          (a.doctor_name && a.doctor_name.toLowerCase().includes(q)) ||
          (a.specialization && a.specialization.toLowerCase().includes(q))
      );
    }

    setFilteredAppointments(result);
  }, [appointments, statusFilter, searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenBookModal = () => {
    setFormData({
      patient_id: patients.length > 0 ? patients[0].id : '',
      doctor_id: doctors.length > 0 ? doctors[0].id : '',
      appointment_date: new Date().toISOString().split('T')[0],
      appointment_time: '10:00 AM',
      status: 'Scheduled'
    });
    setIsBookModalOpen(true);
  };

  // Submit new booking
  const handleBookSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patient_id || !formData.doctor_id || !formData.appointment_date || !formData.appointment_time) {
      setAlert({ type: 'error', message: 'Please fill in all appointment fields.' });
      return;
    }

    try {
      await api.createAppointment(formData);
      setAlert({ type: 'success', message: 'Appointment booked successfully!' });
      setIsBookModalOpen(false);
      // Reload appointments
      const res = await api.getAppointments();
      if (res.success) setAppointments(res.data);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to book appointment.' });
    }
  };

  // Update Status directly from the table
  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.updateAppointment(id, { status: newStatus });
      setAlert({ type: 'success', message: `Appointment status updated to "${newStatus}".` });
      
      // Update local state smoothly
      setAppointments((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to update status.' });
    }
  };

  // Delete / Cancel Appointment
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and delete this appointment?')) {
      return;
    }

    try {
      await api.deleteAppointment(id);
      setAlert({ type: 'success', message: 'Appointment deleted successfully.' });
      setAppointments((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete appointment.' });
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Completed':
        return 'badge-success';
      case 'Scheduled':
        return 'badge-warning';
      case 'Cancelled':
        return 'badge-danger';
      default:
        return 'badge-neutral';
    }
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Appointment Management</h1>
          <p className="page-desc">Schedule, track, and update consultation appointments.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleOpenBookModal}
          disabled={patients.length === 0 || doctors.length === 0}
        >
          <PlusCircle size={18} />
          <span>Book Appointment</span>
        </button>
      </div>

      {/* Warning if no patients or doctors exist */}
      {(patients.length === 0 || doctors.length === 0) && !loading && (
        <Alert 
          type="info" 
          message="Tip: Make sure you have at least one Patient and one Doctor registered before booking an appointment." 
        />
      )}

      {/* Alert Notification */}
      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert(null)} 
        />
      )}

      {/* Table & Filter Toolbar */}
      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="search-box">
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text"
                placeholder="Search patient or doctor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Status Filter Buttons */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['All', 'Scheduled', 'Completed', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  className={`btn btn-sm ${statusFilter === status ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredAppointments.length}</strong> appointments
          </span>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : filteredAppointments.length > 0 ? (
          <div className="responsive-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Patient Name</th>
                  <th>Doctor & Department</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Current Status</th>
                  <th>Update Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appt) => (
                  <tr key={appt.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>#{appt.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{appt.patient_name}</div>
                      {appt.patient_phone && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {appt.patient_phone}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{appt.doctor_name}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--primary)' }}>
                        {appt.doctor_specialization || appt.specialization}
                      </div>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} color="var(--text-muted)" />
                        {appt.appointment_date}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Clock size={14} color="var(--text-muted)" />
                        {appt.appointment_time}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(appt.status)}`}>
                        {appt.status}
                      </span>
                    </td>
                    <td>
                      {/* Interactive dropdown to quickly change status */}
                      <select
                        className="form-control"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.82rem', width: 'auto' }}
                        value={appt.status}
                        onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                      >
                        <option value="Scheduled">Scheduled</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td>
                      <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-danger btn-icon" 
                          onClick={() => handleDelete(appt.id)}
                          title="Cancel/Delete Appointment"
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
            <CalendarCheck size={42} className="empty-icon" />
            <div className="empty-title">No Appointments Found</div>
            <p>No appointments match the selected filter. Click "Book Appointment" to add one.</p>
          </div>
        )}
      </div>

      {/* Book Appointment Modal */}
      <Modal 
        isOpen={isBookModalOpen} 
        title="Book New Patient Appointment" 
        onClose={() => setIsBookModalOpen(false)}
      >
        <form onSubmit={handleBookSubmit}>
          {/* Select Existing Patient */}
          <div className="form-group">
            <label className="form-label">Select Patient *</label>
            <select 
              name="patient_id" 
              className="form-control" 
              value={formData.patient_id} 
              onChange={handleInputChange} 
              required
            >
              <option value="">-- Choose Patient --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (ID: #{p.id}, {p.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Select Existing Doctor */}
          <div className="form-group">
            <label className="form-label">Select Doctor *</label>
            <select 
              name="doctor_id" 
              className="form-control" 
              value={formData.doctor_id} 
              onChange={handleInputChange} 
              required
            >
              <option value="">-- Choose Doctor --</option>
              {doctors.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.specialization}) - {d.available_days}
                </option>
              ))}
            </select>
          </div>

          {/* Appointment Date and Time */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Appointment Date *</label>
              <input 
                type="date" 
                name="appointment_date" 
                className="form-control" 
                value={formData.appointment_date} 
                onChange={handleInputChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time Slot *</label>
              <select 
                name="appointment_time" 
                className="form-control" 
                value={formData.appointment_time} 
                onChange={handleInputChange} 
                required
              >
                <option value="09:00 AM">09:00 AM</option>
                <option value="09:30 AM">09:30 AM</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:00 PM">02:00 PM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="04:30 PM">04:30 PM</option>
                <option value="05:00 PM">05:00 PM</option>
              </select>
            </div>
          </div>

          {/* Initial Status */}
          <div className="form-group">
            <label className="form-label">Status</label>
            <select 
              name="status" 
              className="form-control" 
              value={formData.status} 
              onChange={handleInputChange}
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* Modal Actions */}
          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsBookModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Confirm Booking
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Appointments;
