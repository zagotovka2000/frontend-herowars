import React from 'react';
import { useAppDispatch } from '../../store/hooks';
import { resetToMain } from '../../store/slices/navigationSlice';
import './BattleResultModal.css';

const BattleResultModal = ({ isOpen, onClose, isVictory, onScreenChange }) => {
  const dispatch = useAppDispatch();

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      // Используем Redux для навигации
      dispatch(resetToMain());
    }, 300);
  };

  if (!isOpen) return null;

  const resultData = {
    victory: {
      title: '🎉 Победа!',
      message: 'Вы одержали победу над противником!',
      color: '#4CAF50',
      icon: '🏆'
    },
    defeat: {
      title: '💀 Поражение',
      message: 'Противник оказался сильнее...',
      color: '#F44336',
      icon: '☠️'
    }
  };

  const data = resultData[isVictory ? 'victory' : 'defeat'];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ borderColor: data.color }}>
        
        <button className="modal-close-button" onClick={handleClose}>
          ✕
        </button>
        
        <div className="result-icon" style={{ color: data.color }}>
          {data.icon}
        </div>
        
        <h2 className="result-title" style={{ color: data.color }}>
          {data.title}
        </h2>
        
        <p className="result-message">
          {data.message}
        </p>
        
        <div className="result-details">
          <div className="detail-item">
            <span className="detail-label">Режим:</span>
            <span className="detail-value">ПвП Арена</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Тип боя:</span>
            <span className="detail-value">5×5 карточный</span>
          </div>
        </div>
        
        <button 
          className="confirm-button" 
          onClick={handleClose}
          style={{ backgroundColor: data.color }}
        >
          На главную
        </button>
      </div>
    </div>
  );
};

export default BattleResultModal;
