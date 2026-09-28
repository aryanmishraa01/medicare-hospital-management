import React from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

/**
 * Alert Banner Component
 * ------------------------------------------------------------
 * Displays feedback messages after user actions (Add, Update, Delete).
 * Props:
 * - type: 'success' | 'error' | 'info'
 * - message: string
 * - onClose: function
 */
const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={18} />;
      case 'error':
        return <AlertCircle size={18} />;
      default:
        return <Info size={18} />;
    }
  };

  return (
    <div className={`alert-banner ${type}`}>
      <div className="alert-content">
        {getIcon()}
        <span>{message}</span>
      </div>
      {onClose && (
        <button 
          className="alert-close" 
          onClick={onClose} 
          aria-label="Close notification"
          title="Close"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default Alert;
