# 🏥 MediCare Hospital Management System

A beginner-friendly, clean, and modern full-stack web application designed for hospital administration and college viva presentations.

---

## 📑 Table of Contents

- [Project Overview](#-project-overview)
- [Tech Stack](#-tech-stack)
- [Key Features](#-key-features)
- [Project Folder Structure](#-project-folder-structure)
- [Database Schema (MySQL)](#-database-schema-mysql)
- [Step-by-Step Setup Guide](#-step-by-step-setup-guide)
  - [1. Clone / Open Project](#1-clone--open-project)
  - [2. Setup MySQL Database](#2-setup-mysql-database)
  - [3. Configure & Run Backend](#3-configure--run-backend)
  - [4. Configure & Run Frontend](#4-configure--run-frontend)
- [API Endpoints & Postman Testing](#-api-endpoints--postman-testing)
- [Code Architecture Explained Simply (For Viva)](#-code-architecture-explained-simply-for-viva)
- [Frequently Asked Viva Questions & Answers](#-frequently-asked-viva-questions--answers)
- [Screenshots & UI Preview](#-screenshots--ui-preview)

---

## 🌟 Project Overview

**MediCare Hospital Management System** is a lightweight, single-admin hospital portal. It eliminates complex authentication, payment gateways, and heavy third-party libraries so that students can easily understand, modify, and defend every line of code during their final college evaluation and viva examinations.

### Why this project is beginner-friendly:
- **No Complex Authentication**: Direct access to Admin Dashboard without confusing JWT/cookies.
- **Pure JavaScript**: No TypeScript overhead.
- **Native Fetch**: Frontend uses standard JavaScript `fetch()` instead of heavy wrapper libraries.
- **Clear Separation of Concerns**: Backend organized into `config/`, `controllers/`, and `routes/`.
- **Fail-Safe Demo Mode**: If MySQL is not running or credentials have not been configured yet during a viva, the backend gracefully falls back to memory data so your project presentation never crashes!

---

## 💻 Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React (v19) + Vite | Fast, modern component-based UI |
| **Routing** | React Router (v7) | Client-side page navigation |
| **Icons** | Lucide React | Clean, modern medical icons |
| **Styling** | Vanilla CSS3 | Custom medical theme with cards, modals, and responsive layout |
| **Backend** | Node.js & Express.js | RESTful API server with modular controllers & routes |
| **Database** | MySQL | Relational database with Foreign Key constraints |
| **DB Driver** | `mysql2/promise` | Connection pooling with clean `async/await` syntax |
| **Testing** | Postman | Pre-configured collection file included |

---

## 🚀 Key Features

### 1. 📊 Dashboard Module
- Summary statistics cards: Total Patients, Total Doctors, Total Appointments, Total Bills.
- Revenue overview: Total Collected vs Total Pending.
- Recent appointments quick glance with status badges.
- Fast navigation shortcuts to add patients, book appointments, or create bills.

### 2. 👥 Patient Management Module
- Register new patient (`name`, `age`, `gender`, `phone`, `address`).
- View all patients in a structured table.
- Search patients in real time by name, phone, or address.
- Edit existing patient details.
- Delete patient records (cascades related appointments and bills).

### 3. 🩺 Doctor Management Module
- Add doctor profile (`name`, `specialization`, `phone`, `available_days`).
- View all doctors and departmental specializations.
- Search doctors by department or name.
- Edit doctor details and schedules.
- Delete doctor records.

### 4. 📅 Appointment Management Module
- Book appointments by selecting patients and doctors from dynamic dropdowns.
- Choose appointment date and time slots.
- Real-time SQL JOIN shows patient name, phone, doctor name, and specialization.
- Instant status updater: Change between `Scheduled`, `Completed`, or `Cancelled`.
- Filter appointments by status tabs (`All`, `Scheduled`, `Completed`, `Cancelled`).
- Delete or cancel appointments.

### 5. 🧾 Billing & Invoice Module
- Generate invoices linked to registered patients.
- Specify billing amount, bill date, and payment status (`Paid` or `Pending`).
- Real-time calculations of Total Invoiced, Received, and Outstanding amounts.
- Filter bills by payment status (`Paid`, `Pending`).
- Delete bills.

---

## 📁 Project Folder Structure

```text
medicare-hospital-management/
│
├── database.sql                  # MySQL database creation and sample data script
├── postman_collection.json       # Pre-configured Postman API collection
├── README.md                     # Comprehensive project documentation & Viva guide
│
├── backend/                      # Node.js + Express REST API Server
│   ├── config/
│   │   ├── db.js                 # MySQL connection pool setup using mysql2/promise
│   │   └── mockStore.js          # In-memory sample data fallback (failsafe for viva)
│   ├── controllers/
│   │   ├── dashboardController.js# Counts and recent appointments logic
│   │   ├── patientController.js  # CRUD operations for patients
│   │   ├── doctorController.js   # CRUD operations for doctors
│   │   ├── appointmentController.js # Appointment scheduling & status update
│   │   └── billController.js     # Billing & invoice generation logic
│   ├── routes/
│   │   ├── dashboardRoutes.js    # Routes for /api/dashboard
│   │   ├── patientRoutes.js      # Routes for /api/patients
│   │   ├── doctorRoutes.js       # Routes for /api/doctors
│   │   ├── appointmentRoutes.js  # Routes for /api/appointments
│   │   └── billRoutes.js         # Routes for /api/bills
│   ├── .env                      # Local environment configuration (Port, DB credentials)
│   ├── .env.example              # Template environment file
│   ├── package.json              # Backend dependencies (express, cors, mysql2, dotenv)
│   └── server.js                 # Express server configuration, middleware, and route mounting
│
└── frontend/                     # React + Vite Frontend Application
    ├── public/                   # Static assets
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx       # Side navigation bar with active route highlighting
    │   │   ├── Navbar.jsx        # Top header displaying live date & admin profile
    │   │   ├── Alert.jsx         # Reusable success / error feedback banner
    │   │   └── Modal.jsx         # Reusable popup dialog for forms
    │   ├── pages/
    │   │   ├── Dashboard.jsx     # Overview page with summary cards & recent list
    │   │   ├── Patients.jsx      # Patients table, search, Add/Edit modal, Delete
    │   │   ├── Doctors.jsx       # Doctors table, search, Add/Edit modal, Delete
    │   │   ├── Appointments.jsx  # Appointments table, booking modal, status switcher
    │   │   └── Bills.jsx         # Invoices table, billing modal, financial summary
    │   ├── services/
    │   │   └── api.js            # Centralized API fetch helper targeting localhost:5001
    │   ├── App.jsx               # React Router routes and main layout wrapper
    │   ├── index.css             # Unified modern CSS design system
    │   └── main.jsx              # React DOM mounting entry point
    ├── index.html                # HTML entry point with title and meta tags
    ├── package.json              # Frontend dependencies (react, react-router-dom, lucide-react)
    └── vite.config.js            # Vite configuration
```

---

## 🗄️ Database Schema (MySQL)

Database Name: `hospital_management_db`

### 1. `patients` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | AUTO_INCREMENT PRIMARY KEY | Unique patient ID |
| `name` | VARCHAR(100) | NOT NULL | Patient full name |
| `age` | INT | NOT NULL | Patient age |
| `gender` | ENUM | 'Male', 'Female', 'Other' | Patient gender |
| `phone` | VARCHAR(15) | NOT NULL | Contact number |
| `address` | VARCHAR(255) | NOT NULL | Residential address |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Registration timestamp |

### 2. `doctors` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | AUTO_INCREMENT PRIMARY KEY | Unique doctor ID |
| `name` | VARCHAR(100) | NOT NULL | Doctor full name |
| `specialization`| VARCHAR(100) | NOT NULL | Department (e.g. Cardiology) |
| `phone` | VARCHAR(15) | NOT NULL | Contact number |
| `available_days`| VARCHAR(100) | NOT NULL | Available days (e.g. Mon, Wed, Fri) |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Creation timestamp |

### 3. `appointments` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | AUTO_INCREMENT PRIMARY KEY | Unique appointment ID |
| `patient_id` | INT | FOREIGN KEY -> patients(id) ON DELETE CASCADE | Selected patient |
| `doctor_id` | INT | FOREIGN KEY -> doctors(id) ON DELETE CASCADE | Selected doctor |
| `appointment_date`| DATE | NOT NULL | Date of consultation |
| `appointment_time`| VARCHAR(20) | NOT NULL | Time slot (e.g. 10:30 AM) |
| `status` | ENUM | 'Scheduled', 'Completed', 'Cancelled' | Appointment status |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Booking timestamp |

### 4. `bills` Table
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | INT | AUTO_INCREMENT PRIMARY KEY | Unique bill ID |
| `patient_id` | INT | FOREIGN KEY -> patients(id) ON DELETE CASCADE | Billed patient |
| `amount` | DECIMAL(10,2) | NOT NULL | Total amount in INR |
| `payment_status`| ENUM | 'Paid', 'Pending' | Payment status |
| `bill_date` | DATE | NOT NULL | Invoice date |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Generation timestamp |

---

## ⚙️ Step-by-Step Setup Guide

### Prerequisites
Make sure you have the following installed on your computer:
1. **Node.js** (v18 or higher): [Download Node.js](https://nodejs.org/)
2. **MySQL Server** (or XAMPP / WampServer / MySQL Workbench): [Download MySQL](https://dev.mysql.com/downloads/)

---

### 1. Open Project Directory
Open your terminal (macOS/Linux) or Command Prompt / PowerShell (Windows) and navigate to the project root:
```bash
cd /Users/vivekkumar/.gemini/antigravity-ide/scratch/medicare-hospital-management
```

---

### 2. Setup MySQL Database

#### Option A: Using MySQL Command Line
Run the following command in terminal:
```bash
mysql -u root -p < database.sql
```
*(Enter your MySQL root password when prompted)*

#### Option B: Using MySQL Workbench or phpMyAdmin (XAMPP)
1. Open MySQL Workbench or phpMyAdmin (`http://localhost/phpmyadmin`).
2. Open the file `database.sql` inside the editor.
3. Click **Execute / Run**.
4. The database `hospital_management_db` will be created along with all tables and sample records.

---

### 3. Configure & Run Backend

1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Configure environment variables in `backend/.env`:
   ```ini
   PORT=5001
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_actual_mysql_password
   DB_NAME=hospital_management_db
   DB_PORT=3306
   ```

4. Start the backend server:
   ```bash
   # Production mode:
   npm start

   # Or development mode with auto-reload:
   npm run dev
   ```

5. You will see:
   ```text
   ====================================================
   🚀 MediCare Server running on: http://localhost:5001
   📋 API Health Check:         http://localhost:5001/
   📊 Dashboard Stats API:      http://localhost:5001/api/dashboard/stats
   ====================================================
   ✅ Successfully connected to MySQL database: hospital_management_db
   ```

---

### 4. Configure & Run Frontend

1. Open a **new terminal tab or window** and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Install dependencies (if not already installed):
   ```bash
   npm install
   ```

3. Start the Vite React development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit:
   ```text
   http://localhost:5173
   ```

---

## 📡 API Endpoints & Postman Testing

You can import the included file `postman_collection.json` directly into Postman (**File -> Import -> postman_collection.json**).

| Module | Method | URL Endpoint | Description | Sample Request Body |
|---|---|---|---|---|
| **Dashboard** | `GET` | `http://localhost:5001/api/dashboard/stats` | Get counts & recent appointments | None |
| **Patients** | `GET` | `http://localhost:5001/api/patients` | Get all patients | None |
| **Patients** | `GET` | `http://localhost:5001/api/patients/:id` | Get patient by ID | None |
| **Patients** | `POST` | `http://localhost:5001/api/patients` | Register new patient | `{"name":"Rohan","age":30,"gender":"Male","phone":"9876543210","address":"Mumbai"}` |
| **Patients** | `PUT` | `http://localhost:5001/api/patients/:id` | Update patient | `{"name":"Rohan","age":31,"gender":"Male","phone":"9876543210","address":"Pune"}` |
| **Patients** | `DELETE` | `http://localhost:5001/api/patients/:id` | Delete patient | None |
| **Doctors** | `GET` | `http://localhost:5001/api/doctors` | Get all doctors | None |
| **Doctors** | `GET` | `http://localhost:5001/api/doctors/:id` | Get doctor by ID | None |
| **Doctors** | `POST` | `http://localhost:5001/api/doctors` | Add doctor | `{"name":"Dr. Meera","specialization":"Neurology","phone":"9988776655","available_days":"Mon, Wed"}` |
| **Doctors** | `PUT` | `http://localhost:5001/api/doctors/:id` | Update doctor | `{"name":"Dr. Meera","specialization":"Neurology","phone":"9988776655","available_days":"Mon to Fri"}` |
| **Doctors** | `DELETE` | `http://localhost:5001/api/doctors/:id` | Delete doctor | None |
| **Appointments** | `GET` | `http://localhost:5001/api/appointments` | Get all appointments (JOINed) | None |
| **Appointments** | `POST` | `http://localhost:5001/api/appointments` | Book appointment | `{"patient_id":1,"doctor_id":2,"appointment_date":"2026-09-15","appointment_time":"11:00 AM","status":"Scheduled"}` |
| **Appointments** | `PUT` | `http://localhost:5001/api/appointments/:id`| Update status / time | `{"status":"Completed"}` |
| **Appointments** | `DELETE` | `http://localhost:5001/api/appointments/:id`| Cancel appointment | None |
| **Bills** | `GET` | `http://localhost:5001/api/bills` | Get all bills (JOINed) | None |
| **Bills** | `POST` | `http://localhost:5001/api/bills` | Generate invoice | `{"patient_id":1,"amount":1500.00,"payment_status":"Paid","bill_date":"2026-09-06"}` |
| **Bills** | `DELETE` | `http://localhost:5001/api/bills/:id` | Delete bill | None |

---

## 🧠 Code Architecture Explained Simply (For Viva)

### 1. Why `server.js` is separate from `controllers` and `routes`:
- **Separation of Concerns**: `server.js` only configures middleware (`cors`, `express.json`) and starts the server.
- `routes/` defines the URL endpoints and maps them to HTTP methods (`GET`, `POST`, `PUT`, `DELETE`).
- `controllers/` contains the actual SQL logic and database interaction.

### 2. Why use a Connection Pool (`mysql2/promise` in `config/db.js`):
- Instead of creating and closing a brand-new database socket connection for every user request, a connection pool creates a pool of reusable connections.
- It provides much higher throughput and prevents database connection exhaustion.

### 3. Why SQL `JOIN` is used in Appointments & Bills:
- In `appointments`, we only store `patient_id` and `doctor_id` (foreign keys) to prevent duplicate data (normalization).
- During `GET /api/appointments`, we perform `JOIN patients p ON a.patient_id = p.id` and `JOIN doctors d ON a.doctor_id = d.id` to return human-readable names and contact details in a single query.

### 4. What `ON DELETE CASCADE` does:
- If a patient record is deleted from the `patients` table, any corresponding appointments or bills belonging to that patient are automatically removed by MySQL, preventing orphaned records.

---

## 🎓 Frequently Asked Viva Questions & Answers

### Q1: What is the difference between SQL and NoSQL? Why did you choose MySQL?
> **Answer**: SQL databases (like MySQL) are relational, table-based, and enforce structured schemas with foreign keys and ACID transactions. NoSQL databases (like MongoDB) are document-based. We chose MySQL because hospital data (patients, doctors, appointments, invoices) is strictly relational, requiring strong integrity constraints and foreign keys.

### Q2: What is REST API and what HTTP methods did you use?
> **Answer**: REST (Representational State Transfer) is an architectural style for building stateless web services. We used:
> - `GET`: To retrieve records (patients, doctors, appointments, bills).
> - `POST`: To create new records.
> - `PUT`: To update existing records.
> - `DELETE`: To remove a record.

### Q3: What is CORS and why is it needed?
> **Answer**: CORS stands for Cross-Origin Resource Sharing. Because our React frontend runs on port `5173` and our Node backend runs on port `5001`, the browser blocks cross-origin requests by default for security. The `cors()` middleware in Express enables our frontend to securely communicate with the backend.

### Q4: How does React Router work in single-page applications (SPA)?
> **Answer**: React Router intercepts browser navigation events and dynamically re-renders components without reloading the entire webpage, creating a fast and seamless user experience.

### Q5: How do you prevent SQL Injection in your code?
> **Answer**: We use parameterized queries with `?` placeholders (e.g., `db.query('SELECT * FROM patients WHERE id = ?', [id])`). The MySQL driver automatically sanitizes the input values, preventing malicious SQL code injection.

---

## 📷 Screenshots & UI Preview

| Module | Preview Description |
|---|---|
| **Admin Dashboard** | Summary metric cards, recent appointments, and financial highlights |
| **Patient Management** | Full CRUD table with instant search and responsive Add/Edit modal |
| **Doctor Management** | Departmental listing, doctor profiles, and availability schedules |
| **Appointment Booking** | Dropdown selection of patients and doctors with inline status switcher |
| **Billing & Invoices** | Patient billing history, paid vs pending totals, and invoice generation |

---

## 👨‍💻 Author & Credits
- **Project**: MediCare Hospital Management System
- **Stack**: React (Vite) + Node.js (Express) + MySQL
- **License**: MIT (Free for academic and educational presentation)
