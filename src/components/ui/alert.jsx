// src/components/Alert.jsx
import React from 'react';
import './Alert.css'; // Импортируем файл со стилями

const Alert = ({ message, type, onClose }) => {
  if (!message) return null;

  const alertClass = `alert alert-${type}`; // alert-success, alert-error, alert-warning

  return (
    <div className={alertClass}>
      <p>{message}</p>
      {onClose && (
        <button className="alert-close-button" onClick={onClose}>
          &times; {/* Символ "умножить" для кнопки закрытия */}
        </button>
      )}
    </div>
  );
};

export default Alert;
