// src/components/Common/EnergyModal/EnergyModal.js
import React from 'react';
import './EnergyModal.css';

const EnergyModal = ({ isOpen, onClose, requiredEnergy, currentEnergy }) => {
  // Если модальное окно закрыто - не рендерим
  if (!isOpen) return null;

  // ✅ ИСПРАВЛЕНО: защита от неправильных значений
  const safeRequiredEnergy = requiredEnergy || 5;
  const safeCurrentEnergy = currentEnergy || 0;

  return (
    <div className="modal-overlay">
      <div className="modal-content energy-modal">
        {/* Кнопка закрытия */}
        <button className="modal-close-button" onClick={onClose}>
          ✕
        </button>
        
        {/* Иконка энергии */}
        <div className="energy-modal-icon">⚡</div>
        
        {/* Заголовок */}
        <h2 className="energy-modal-title">Недостаточно энергии!</h2>
        
        {/* Сообщение */}
        <p className="energy-modal-message">
          Для начала этого уровня нужно {safeRequiredEnergy} энергии.
        </p>
        
        {/* Информация об энергии */}
        <div className="energy-info">
          <div className="energy-current">
            Доступно: <span className="energy-value">{safeCurrentEnergy} ⚡</span>
          </div>
          <div className="energy-required">
            Требуется: <span className="energy-value">{safeRequiredEnergy} ⚡</span>
          </div>
        </div>
        
        {/* Подсказка для пользователя */}
        <div className="energy-tip">
          💡 Энергия восстанавливается со временем
        </div>

        {/* ✅ ДОБАВЛЕНО: кнопка для быстрого перехода к восстановлению энергии */}
        <button className="energy-recovery-button" onClick={onClose}>
          Понятно
        </button>
      </div>
    </div>
  );
};

export default EnergyModal;
