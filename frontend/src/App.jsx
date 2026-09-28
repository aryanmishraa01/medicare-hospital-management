import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Doctors from './pages/Doctors';
import Appointments from './pages/Appointments';
import Bills from './pages/Bills';

/**
 * Main Application Component
 * ------------------------------------------------------------
 * Configures React Router and root layout with persistent
 * Sidebar, top Navbar, and dynamic page views.
 */
function App() {
  return (
    <Router>
      <div className="app-layout">
        {/* Left Sidebar Navigation */}
        <Sidebar />

        {/* Right Main Content Area */}
        <div className="main-content">
          {/* Top Header Bar */}
          <Navbar />

          {/* Dynamic Page Routes */}
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/bills" element={<Bills />} />
              {/* Fallback to Dashboard */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
