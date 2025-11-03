import React from 'react';
import './EnergyModal.css';

const EnergyModal = ({ isOpen, onClose, requiredEnergy, currentEnergy }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content energy-modal">
        <button className="modal-close-button" onClick={onClose}>
          ✕
        </button>
        
        <div className="energy-modal-icon">⚡</div>
        
        <h2 className="energy-modal-title">Недостаточно энергии!</h2>
        
        <p className="energy-modal-message">
          Для начала этого уровня нужно {requiredEnergy} энергии.
        </p>
        
        <div className="energy-info">
          <div className="energy-current">
            Доступно: <span className="energy-value">{currentEnergy} ⚡</span>
          </div>
          <div className="energy-required">
            Требуется: <span className="energy-value">{requiredEnergy} ⚡</span>
          </div>
        </div>
        
        <div className="energy-tip">
          💡 Энергия восстанавливается со временем
        </div>
      </div>
    </div>
  );
};

export default EnergyModal;
