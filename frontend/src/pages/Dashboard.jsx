import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import Alert from '../components/Alert';
import { 
  Users, 
  UserCheck, 
  CalendarCheck, 
  Receipt, 
  ArrowRight, 
  PlusCircle, 
  DollarSign, 
  Clock,
  Sparkles
} from 'lucide-react';

/**
 * Dashboard Page
 * ------------------------------------------------------------
 * Module: Dashboard
 * - Displays summary metric cards:
 *   1. Total Patients
 *   2. Total Doctors
 *   3. Total Appointments
 *   4. Total Bills
 * - Displays financial overview (Revenue & Pending)
 * - Displays recent appointments table with status badges
 */
const Dashboard = () => {
  const [stats, setStats] = useState({
    total_patients: 0,
    total_doctors: 0,
    total_appointments: 0,
    total_bills: 0,
    total_revenue: 0,
    total_pending: 0,
    recent_appointments: []
  });

  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Fetch dashboard statistics from backend API
  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardStats();
      if (res.success) {
        setStats(res.data);
        if (res.isDemoMode) {
          setIsDemoMode(true);
        }
      }
    } catch (err) {
      setAlert({
        type: 'error',
        message: 'Could not connect to backend server. Make sure the Node server is running on port 5001.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const getStatusBadgeClass = (status) => {
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
          <h1 className="page-title">Hospital Overview</h1>
          <p className="page-desc">Real-time summary of hospital operations and departments.</p>
        </div>
        {isDemoMode && (
          <div className="demo-mode-tag">
            <Sparkles size={14} />
            <span>Demo Data Mode (Connect MySQL to persist live)</span>
          </div>
        )}
      </div>

      {/* Alert banner if connection error */}
      {alert && (
        <Alert 
          type={alert.type} 
          message={alert.message} 
          onClose={() => setAlert(null)} 
        />
      )}

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <>
          {/* Summary Metric Cards */}
          <div className="stats-grid">
            {/* 1. Total Patients */}
            <div className="stat-card blue">
              <div>
                <div className="stat-label">Total Patients</div>
                <div className="stat-value">{stats.total_patients}</div>
                <div className="stat-subtext">Registered in records</div>
              </div>
              <div className="stat-icon-wrapper">
                <Users size={26} />
              </div>
            </div>

            {/* 2. Total Doctors */}
            <div className="stat-card teal">
              <div>
                <div className="stat-label">Total Doctors</div>
                <div className="stat-value">{stats.total_doctors}</div>
                <div className="stat-subtext">Across all departments</div>
              </div>
              <div className="stat-icon-wrapper">
                <UserCheck size={26} />
              </div>
            </div>

            {/* 3. Total Appointments */}
            <div className="stat-card indigo">
              <div>
                <div className="stat-label">Total Appointments</div>
                <div className="stat-value">{stats.total_appointments}</div>
                <div className="stat-subtext">Scheduled & completed</div>
              </div>
              <div className="stat-icon-wrapper">
                <CalendarCheck size={26} />
              </div>
            </div>

            {/* 4. Total Bills */}
            <div className="stat-card emerald">
              <div>
                <div className="stat-label">Total Bills</div>
                <div className="stat-value">{stats.total_bills}</div>
                <div className="stat-subtext">Invoices processed</div>
              </div>
              <div className="stat-icon-wrapper">
                <Receipt size={26} />
              </div>
            </div>
          </div>

          {/* Grid: Recent Appointments & Quick Actions */}
          <div className="dashboard-grid">
            {/* Recent Appointments List */}
            <div className="card">
              <div className="card-header">
                <h2 className="card-title">
                  <Clock size={18} />
                  <span>Recent Appointments</span>
                </h2>
                <Link to="/appointments" className="btn btn-secondary btn-sm">
                  <span>View All</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                {stats.recent_appointments && stats.recent_appointments.length > 0 ? (
                  <div className="responsive-table">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Patient</th>
                          <th>Doctor</th>
                          <th>Department</th>
                          <th>Date & Time</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recent_appointments.map((appt) => (
                          <tr key={appt.id}>
                            <td style={{ fontWeight: 600 }}>{appt.patient_name}</td>
                            <td>{appt.doctor_name}</td>
                            <td>
                              <span className="badge badge-neutral">
                                {appt.specialization}
                              </span>
                            </td>
                            <td>
                              {appt.appointment_date} at {appt.appointment_time}
                            </td>
                            <td>
                              <span className={`badge ${getStatusBadgeClass(appt.status)}`}>
                                {appt.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="empty-state">
                    <p>No appointments recorded yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions & Financial Highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Quick Actions */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">Quick Actions</h2>
                </div>
                <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <Link to="/patients" className="btn btn-primary" style={{ justifyContent: 'flex-start' }}>
                    <PlusCircle size={18} />
                    <span>Register New Patient</span>
                  </Link>

                  <Link to="/appointments" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                    <CalendarCheck size={18} />
                    <span>Book Appointment</span>
                  </Link>

                  <Link to="/bills" className="btn btn-secondary" style={{ justifyContent: 'flex-start' }}>
                    <Receipt size={18} />
                    <span>Create New Invoice</span>
                  </Link>
                </div>
              </div>

              {/* Financial Highlight */}
              <div className="card">
                <div className="card-header">
                  <h2 className="card-title">
                    <DollarSign size={18} />
                    <span>Billing Summary</span>
                  </h2>
                </div>
                <div className="card-body">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Collected Revenue:</span>
                    <span style={{ fontWeight: 700, color: 'var(--success)' }}>
                      ₹{stats.total_revenue?.toLocaleString('en-IN') || '0'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Pending Payments:</span>
                    <span style={{ fontWeight: 700, color: 'var(--warning)' }}>
                      ₹{stats.total_pending?.toLocaleString('en-IN') || '0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
