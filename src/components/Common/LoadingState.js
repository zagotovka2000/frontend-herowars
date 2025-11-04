import React from 'react';
import './LoadingState.css';

const LoadingState = ({ 
  message = "Загрузка...", 
  size = 'medium', 
  type = 'primary',
  progress,
  className = '' 
}) => {
  const getSpinnerIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'danger':
        return '❌';
      default:
        return '⏳';
    }
  };

  return (
    <div className={`loading-state ${size} ${type} ${className}`}>
      <div className="loading-spinner">{getSpinnerIcon()}</div>
      <p className="loading-message">{message}</p>
      {progress !== undefined && (
        <div className="loading-progress">
          <div 
            className="loading-progress-bar" 
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};
// Простая загрузка
{/* <LoadingState />

// Загрузка с прогрессом
<LoadingState message="Загрузка данных..." progress={75} />

// Большая загрузка
<LoadingState size="large" message="Пожалуйста, подождите" />

// Ошибка с повторной попыткой
<ErrorState error="Не удалось загрузить данные" onRetry={fetchData} />

// Предупреждение
<ErrorState type="warning" error="Это действие нельзя отменить" /> */}
export default LoadingState;
