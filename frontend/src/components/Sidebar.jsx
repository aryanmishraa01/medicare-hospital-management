import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  UserCheck, 
  CalendarCheck, 
  Receipt, 
  Activity,
  HeartPulse
} from 'lucide-react';

/**
 * Sidebar Navigation Component
 * ------------------------------------------------------------
 * Renders the persistent left sidebar with brand identity,
 * navigation links with active indicators, and system status.
 */
const Sidebar = () => {
  const navLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'Doctors', path: '/doctors', icon: UserCheck },
    { name: 'Appointments', path: '/appointments', icon: CalendarCheck },
    { name: 'Billing', path: '/bills', icon: Receipt },
  ];

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="brand-icon">
          <HeartPulse size={24} />
        </div>
        <div>
          <div className="brand-title">MediCare</div>
          <div className="brand-subtitle">Hospital System</div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              end={link.path === '/'}
            >
              <Icon size={19} />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* System Status Footer */}
      <div className="sidebar-footer">
        <div className="system-badge">
          <span className="pulse-dot"></span>
          <span>System Online</span>
        </div>
        <span>MediCare HMS v1.0</span>
      </div>
    </aside>
  );
};

export default Sidebar;
