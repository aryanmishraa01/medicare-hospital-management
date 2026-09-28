-- ==========================================================
-- MediCare Hospital Management System - Database Script
-- Database Name: hospital_management_db
-- ==========================================================

-- 1. Create the Database if it does not already exist
CREATE DATABASE IF NOT EXISTS hospital_management_db;

-- 2. Switch to the hospital_management_db database
USE hospital_management_db;

-- ==========================================================
-- 3. Create Table: patients
-- Stores patient personal and contact information
-- ==========================================================
CREATE TABLE IF NOT EXISTS patients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    phone VARCHAR(15) NOT NULL,
    address VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 4. Create Table: doctors
-- Stores doctor profiles, specialization, and availability
-- ==========================================================
CREATE TABLE IF NOT EXISTS doctors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    available_days VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================================
-- 5. Create Table: appointments
-- Links patients with doctors for scheduled consultations
-- ==========================================================
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL,
    status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- ==========================================================
-- 6. Create Table: bills
-- Stores billing details, amount, and payment status for patients
-- ==========================================================
CREATE TABLE IF NOT EXISTS bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status ENUM('Paid', 'Pending') DEFAULT 'Pending',
    bill_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- ==========================================================
-- 7. Insert Sample Data
-- ==========================================================

-- Sample Patients
INSERT INTO patients (name, age, gender, phone, address) VALUES
('Rahul Sharma', 34, 'Male', '9876543210', '124 Park Avenue, Mumbai'),
('Priya Patel', 28, 'Female', '9823456781', '45 MG Road, Pune'),
('Amit Verma', 45, 'Male', '9712345678', '78 Lake View, Bengaluru'),
('Sunita Rao', 52, 'Female', '9654321876', '12 Civil Lines, Delhi'),
('Vikram Singh', 22, 'Male', '9543216789', '90 Sector 17, Chandigarh');

-- Sample Doctors
INSERT INTO doctors (name, specialization, phone, available_days) VALUES
('Dr. Rajesh Iyer', 'Cardiology', '9123456780', 'Mon, Wed, Fri'),
('Dr. Ananya Sen', 'Pediatrics', '9234567891', 'Tue, Thu, Sat'),
('Dr. Kabir Mehta', 'Orthopedics', '9345678902', 'Mon, Tue, Wed, Fri'),
('Dr. Sneha Roy', 'Dermatology', '9456789013', 'Wed, Thu, Sat'),
('Dr. Manoj Kulkarni', 'General Medicine', '9567890124', 'Mon to Sat');

-- Sample Appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, status) VALUES
(1, 1, '2026-09-10', '10:30 AM', 'Scheduled'),
(2, 2, '2026-09-11', '11:00 AM', 'Scheduled'),
(3, 3, '2026-09-08', '02:00 PM', 'Completed'),
(4, 5, '2026-09-09', '04:30 PM', 'Scheduled'),
(5, 4, '2026-09-07', '09:00 AM', 'Cancelled');

-- Sample Bills
INSERT INTO bills (patient_id, amount, payment_status, bill_date) VALUES
(1, 1500.00, 'Paid', '2026-09-05'),
(2, 800.00, 'Pending', '2026-09-06'),
(3, 2500.00, 'Paid', '2026-09-04'),
(4, 500.00, 'Pending', '2026-09-06'),
(5, 1200.00, 'Paid', '2026-09-03');
