# MediCare Hospital Management System

A simple full-stack web application for managing basic hospital activities such as patients, doctors, appointments, and bills.

## Features

- Patient management
- Doctor management
- Appointment management
- Bill management
- Hospital dashboard
- REST API for backend operations
- MySQL database

## Tech Stack

**Frontend**
- React.js
- CSS
- Vite

**Backend**
- Node.js
- Express.js

**Database**
- MySQL

## Project Structure

~~~text
medicare-hospital-management/
├── backend/
├── frontend/
├── database.sql
├── package.json
└── postman_collection.json
~~~

## How to Run

### 1. Open the project

Clone the repository and open the `medicare-hospital-management` folder in VS Code.

### 2. Set up the database

- Open MySQL.
- Create a database.
- Open the `database.sql` file and run it in MySQL.
- Create a `.env` file inside the `backend` folder.
- Add your MySQL database details to the `.env` file.

### 3. Start the Backend

In VS Code, go to:

**Terminal → New Terminal**

Run these commands one by one:

~~~bash
cd backend
npm install
npm start
~~~

Keep this terminal open.

### 4. Start the Frontend

Open a **second VS Code terminal**:

**Terminal → New Terminal**

Run:

~~~bash
cd frontend
npm install
npm run dev
~~~

The terminal will show a local URL. Open that URL in your browser.

### 5. Use the Application

Once both the backend and frontend are running, the MediCare Hospital Management System can be accessed through the browser.
