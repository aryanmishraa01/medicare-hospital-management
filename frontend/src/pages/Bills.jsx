import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import { 
  Receipt, 
  Search, 
  Trash2, 
  PlusCircle, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  DollarSign, 
  CreditCard 
} from 'lucide-react';

/**
 * Billing Management Module
 * ------------------------------------------------------------
 * Handles Patient Invoices / Bills:
 * - Create a bill for a patient (Modal)
 * - View all bills with Patient Name
 * - Filter by Paid / Pending
 * - Delete a bill
 * Fields: id, patient_id, amount, payment_status, bill_date
 */
const Bills = () => {
  const [bills, setBills] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filteredBills, setFilteredBills] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    patient_id: '',
    amount: '',
    payment_status: 'Pending',
    bill_date: new Date().toISOString().split('T')[0]
  });

  // Load Bills and Patients
  const loadData = async () => {
    try {
      setLoading(true);
      const [billsRes, patRes] = await Promise.all([
        api.getBills(),
        api.getPatients()
      ]);

      if (billsRes.success) setBills(billsRes.data);
      if (patRes.success) setPatients(patRes.data);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to load billing records.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter bills
  useEffect(() => {
    let result = bills;

    if (statusFilter !== 'All') {
      result = result.filter((b) => b.payment_status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          (b.patient_name && b.patient_name.toLowerCase().includes(q)) ||
          b.amount.toString().includes(q)
      );
    }

    setFilteredBills(result);
  }, [bills, statusFilter, searchQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = () => {
    setFormData({
      patient_id: patients.length > 0 ? patients[0].id : '',
      amount: '',
      payment_status: 'Pending',
      bill_date: new Date().toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  // Submit new Bill
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.patient_id || !formData.amount || !formData.bill_date) {
      setAlert({ type: 'error', message: 'Please provide patient, amount, and date.' });
      return;
    }

    try {
      await api.createBill(formData);
      setAlert({ type: 'success', message: 'Invoice generated successfully!' });
      setIsModalOpen(false);
      // Reload bills
      const res = await api.getBills();
      if (res.success) setBills(res.data);
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to create bill.' });
    }
  };

  // Delete Bill
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) {
      return;
    }

    try {
      await api.deleteBill(id);
      setAlert({ type: 'success', message: 'Invoice deleted successfully.' });
      setBills((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      setAlert({ type: 'error', message: err.message || 'Failed to delete bill.' });
    }
  };

  // Calculate totals
  const totalBilled = bills.reduce((acc, b) => acc + Number(b.amount || 0), 0);
  const totalPaid = bills
    .filter((b) => b.payment_status === 'Paid')
    .reduce((acc, b) => acc + Number(b.amount || 0), 0);
  const totalPending = bills
    .filter((b) => b.payment_status === 'Pending')
    .reduce((acc, b) => acc + Number(b.amount || 0), 0);

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Billing & Invoices</h1>
          <p className="page-desc">Generate patient invoices, track payments, and reconcile accounts.</p>
        </div>
        <button 
          className="btn btn-primary" 
          onClick={handleOpenModal}
          disabled={patients.length === 0}
        >
          <PlusCircle size={18} />
          <span>Create New Bill</span>
        </button>
      </div>

      {patients.length === 0 && !loading && (
        <Alert 
          type="info" 
          message="Tip: Register a patient first before generating an invoice." 
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

      {/* Mini Financial Summary Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stat-card blue">
          <div>
            <div className="stat-label">Total Invoiced</div>
            <div className="stat-value">₹{totalBilled.toLocaleString('en-IN')}</div>
            <div className="stat-subtext">Across {bills.length} bills</div>
          </div>
          <div className="stat-icon-wrapper">
            <Receipt size={24} />
          </div>
        </div>

        <div className="stat-card emerald">
          <div>
            <div className="stat-label">Received Amount</div>
            <div className="stat-value" style={{ color: 'var(--success)' }}>
              ₹{totalPaid.toLocaleString('en-IN')}
            </div>
            <div className="stat-subtext">Settled payments</div>
          </div>
          <div className="stat-icon-wrapper">
            <CheckCircle size={24} />
          </div>
        </div>

        <div className="stat-card teal">
          <div>
            <div className="stat-label">Outstanding Pending</div>
            <div className="stat-value" style={{ color: 'var(--warning)' }}>
              ₹{totalPending.toLocaleString('en-IN')}
            </div>
            <div className="stat-subtext">Awaiting payment</div>
          </div>
          <div className="stat-icon-wrapper">
            <AlertCircle size={24} />
          </div>
        </div>
      </div>

      {/* Table & Filter Toolbar */}
      <div className="table-container">
        <div className="table-toolbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="search-box">
              <Search size={18} color="var(--text-muted)" />
              <input 
                type="text"
                placeholder="Search patient name, amount..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {['All', 'Paid', 'Pending'].map((status) => (
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
            Showing <strong>{filteredBills.length}</strong> invoices
          </span>
        </div>

        {loading ? (
          <div className="spinner"></div>
        ) : filteredBills.length > 0 ? (
          <div className="responsive-table">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Patient Name</th>
                  <th>Amount (INR)</th>
                  <th>Payment Status</th>
                  <th>Bill Date</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => (
                  <tr key={bill.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-muted)' }}>#INV-{bill.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{bill.patient_name}</div>
                      {bill.patient_phone && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {bill.patient_phone}
                        </div>
                      )}
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>
                        ₹{Number(bill.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${bill.payment_status === 'Paid' ? 'badge-success' : 'badge-warning'}`}>
                        {bill.payment_status}
                      </span>
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} color="var(--text-muted)" />
                        {bill.bill_date}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                        <button 
                          className="btn btn-danger btn-icon" 
                          onClick={() => handleDelete(bill.id)}
                          title="Delete Invoice"
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
            <Receipt size={42} className="empty-icon" />
            <div className="empty-title">No Invoices Found</div>
            <p>No billing records found matching your filter.</p>
          </div>
        )}
      </div>

      {/* Create Bill Modal */}
      <Modal 
        isOpen={isModalOpen} 
        title="Generate New Patient Invoice" 
        onClose={() => setIsModalOpen(false)}
      >
        <form onSubmit={handleSubmit}>
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

          {/* Amount (INR) */}
          <div className="form-group">
            <label className="form-label">Billing Amount (₹ INR) *</label>
            <input 
              type="number" 
              name="amount" 
              step="0.01"
              min="0"
              className="form-control" 
              placeholder="e.g. 1500.00"
              value={formData.amount} 
              onChange={handleInputChange} 
              required 
            />
          </div>

          {/* Payment Status & Bill Date */}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Payment Status *</label>
              <select 
                name="payment_status" 
                className="form-control" 
                value={formData.payment_status} 
                onChange={handleInputChange}
              >
                <option value="Pending">Pending</option>
                <option value="Paid">Paid</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Bill Date *</label>
              <input 
                type="date" 
                name="bill_date" 
                className="form-control" 
                value={formData.bill_date} 
                onChange={handleInputChange} 
                required 
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="modal-footer" style={{ margin: '1.5rem -1.5rem -1.5rem', padding: '1rem 1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Generate Invoice
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Bills;
