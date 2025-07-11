import React from 'react';
import { AlertCircle } from 'lucide-react';

/**
 * Компонент для отображения ошибок валидации
 * @param {Array} errors - Массив ошибок для отображения
 * @param {string} className - Дополнительные CSS классы
 */
const ValidationError = ({ errors = [], className = '' }) => {
  if (!errors || errors.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-1 ${className}`}>
      {errors.map((error, index) => (
        <div 
          key={index} 
          className="flex items-start space-x-2 text-red-600 text-sm"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      ))}
    </div>
  );
};

export default ValidationError;

