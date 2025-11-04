import React from 'react';
import './ErrorState.css';

const ErrorState = ({ error, onRetry, type = 'error', className = '' }) => {
  const getErrorIcon = () => {
    switch (type) {
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      case 'success':
        return '✅';
      default:
        return '❌';
    }
  };

  return (
    <div className={`error-state ${type} ${className}`}>
      <div className="error-icon">{getErrorIcon()}</div>
      <p className="error-message">{error || 'Произошла ошибка'}</p>
      {onRetry && (
        <button className="retry-button" onClick={onRetry}>
          Попробовать снова
        </button>
      )}
    </div>
  );
};

export default ErrorState;
