// src/components/Common/LoadingState.js
import React from 'react';
import './LoadingState.css';

const LoadingState = ({ 
  message = "Загрузка...", 
  size = 'medium', 
  type = 'primary',
  progress,
  className = '' 
}) => {
  // Функция для получения иконки в зависимости от типа
  const getSpinnerIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'danger':
        return '❌';
      case 'info':
        return 'ℹ️';
      default:
        return '⏳';
    }
  };

  return (
    <div className={`loading-state ${size} ${type} ${className}`}>
      {/* Спиннер/иконка */}
      <div className="loading-spinner">{getSpinnerIcon()}</div>
      
      {/* Сообщение загрузки */}
      <p className="loading-message">{message}</p>
      
      {/* Прогресс-бар если передан progress */}
      {progress !== undefined && (
        <div className="loading-progress">
          <div 
            className="loading-progress-bar" 
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
          <span className="progress-text">{progress}%</span>
        </div>
      )}
    </div>
  );
};

// Примеры использования:
// 
// Простая загрузка:
// <LoadingState />
//
// Загрузка с прогрессом:
// <LoadingState message="Загрузка данных..." progress={75} />
//
// Большая загрузка:
// <LoadingState size="large" message="Пожалуйста, подождите" />
//
// Успешное состояние:
// <LoadingState type="success" message="Данные успешно загружены" />
//
// Ошибка:
// <LoadingState type="danger" message="Ошибка загрузки" />

export default LoadingState;
