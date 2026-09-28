import React from 'react';
import { Calendar, Shield } from 'lucide-react';

/**
 * Top Navbar Component
 * ------------------------------------------------------------
 * Displays current date, admin identity, and header status.
 */
const Navbar = () => {
  // Format current date nicely: e.g. "Sunday, Sep 6, 2026"
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="navbar">
      <div className="navbar-title">
        Hospital Administration
      </div>

      <div className="navbar-right">
        {/* Live Date display */}
        <div className="live-date">
          <Calendar size={15} />
          <span>{today}</span>
        </div>

        {/* Administrator profile badge */}
        <div className="admin-profile">
          <div className="admin-avatar">
            AD
          </div>
          <div className="admin-info">
            <div className="admin-name">Admin User</div>
            <div className="admin-role">Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
