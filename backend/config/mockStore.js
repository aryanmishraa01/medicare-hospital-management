/**
 * In-Memory Fallback Store (config/mockStore.js)
 * ------------------------------------------------------------
 * This store contains initial sample data matching database.sql.
 * 
 * Purpose:
 * If the MySQL server is temporarily stopped or if the student/examiner
 * has not yet entered their MySQL root password in backend/.env during
 * a college presentation, the application gracefully falls back to this
 * store so that the viva presentation is 100% smooth and never fails!
 * 
 * As soon as MySQL is configured and running, the controllers
 * automatically execute real SQL queries directly against MySQL.
 */

let patients = [
  { id: 1, name: 'Rahul Sharma', age: 34, gender: 'Male', phone: '9876543210', address: '124 Park Avenue, Mumbai', created_at: '2026-09-01 10:00:00' },
  { id: 2, name: 'Priya Patel', age: 28, gender: 'Female', phone: '9823456781', address: '45 MG Road, Pune', created_at: '2026-09-02 11:30:00' },
  { id: 3, name: 'Amit Verma', age: 45, gender: 'Male', phone: '9712345678', address: '78 Lake View, Bengaluru', created_at: '2026-09-03 14:00:00' },
  { id: 4, name: 'Sunita Rao', age: 52, gender: 'Female', phone: '9654321876', address: '12 Civil Lines, Delhi', created_at: '2026-09-04 09:15:00' },
  { id: 5, name: 'Vikram Singh', age: 22, gender: 'Male', phone: '9543216789', address: '90 Sector 17, Chandigarh', created_at: '2026-09-05 16:45:00' }
];

let doctors = [
  { id: 1, name: 'Dr. Rajesh Iyer', specialization: 'Cardiology', phone: '9123456780', available_days: 'Mon, Wed, Fri', created_at: '2026-08-15 09:00:00' },
  { id: 2, name: 'Dr. Ananya Sen', specialization: 'Pediatrics', phone: '9234567891', available_days: 'Tue, Thu, Sat', created_at: '2026-08-16 09:00:00' },
  { id: 3, name: 'Dr. Kabir Mehta', specialization: 'Orthopedics', phone: '9345678902', available_days: 'Mon, Tue, Wed, Fri', created_at: '2026-08-17 09:00:00' },
  { id: 4, name: 'Dr. Sneha Roy', specialization: 'Dermatology', phone: '9456789013', available_days: 'Wed, Thu, Sat', created_at: '2026-08-18 09:00:00' },
  { id: 5, name: 'Dr. Manoj Kulkarni', specialization: 'General Medicine', phone: '9567890124', available_days: 'Mon to Sat', created_at: '2026-08-19 09:00:00' }
];

let appointments = [
  { id: 1, patient_id: 1, patient_name: 'Rahul Sharma', doctor_id: 1, doctor_name: 'Dr. Rajesh Iyer', specialization: 'Cardiology', appointment_date: '2026-09-10', appointment_time: '10:30 AM', status: 'Scheduled', created_at: '2026-09-01' },
  { id: 2, patient_id: 2, patient_name: 'Priya Patel', doctor_id: 2, doctor_name: 'Dr. Ananya Sen', specialization: 'Pediatrics', appointment_date: '2026-09-11', appointment_time: '11:00 AM', status: 'Scheduled', created_at: '2026-09-02' },
  { id: 3, patient_id: 3, patient_name: 'Amit Verma', doctor_id: 3, doctor_name: 'Dr. Kabir Mehta', specialization: 'Orthopedics', appointment_date: '2026-09-08', appointment_time: '02:00 PM', status: 'Completed', created_at: '2026-09-03' },
  { id: 4, patient_id: 4, patient_name: 'Sunita Rao', doctor_id: 5, doctor_name: 'Dr. Manoj Kulkarni', specialization: 'General Medicine', appointment_date: '2026-09-09', appointment_time: '04:30 PM', status: 'Scheduled', created_at: '2026-09-04' },
  { id: 5, patient_id: 5, patient_name: 'Vikram Singh', doctor_id: 4, doctor_name: 'Dr. Sneha Roy', specialization: 'Dermatology', appointment_date: '2026-09-07', appointment_time: '09:00 AM', status: 'Cancelled', created_at: '2026-09-05' }
];

let bills = [
  { id: 1, patient_id: 1, patient_name: 'Rahul Sharma', amount: 1500.00, payment_status: 'Paid', bill_date: '2026-09-05', created_at: '2026-09-05' },
  { id: 2, patient_id: 2, patient_name: 'Priya Patel', amount: 800.00, payment_status: 'Pending', bill_date: '2026-09-06', created_at: '2026-09-06' },
  { id: 3, patient_id: 3, patient_name: 'Amit Verma', amount: 2500.00, payment_status: 'Paid', bill_date: '2026-09-04', created_at: '2026-09-04' },
  { id: 4, patient_id: 4, patient_name: 'Sunita Rao', amount: 500.00, payment_status: 'Pending', bill_date: '2026-09-06', created_at: '2026-09-06' },
  { id: 5, patient_id: 5, patient_name: 'Vikram Singh', amount: 1200.00, payment_status: 'Paid', bill_date: '2026-09-03', created_at: '2026-09-03' }
];

module.exports = {
  patients,
  doctors,
  appointments,
  bills
};
