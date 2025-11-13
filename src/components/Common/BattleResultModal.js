// src/components/Common/BattleResultModal.js
import React, { useEffect } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { hideBattleResultModal } from '../../store/slices/gameSlice';
import './BattleResultModal.css';

const BattleResultModal = ({ 
  isOpen, 
  onClose, 
  isVictory, 
  onBattleComplete,
  showContinueButton = true 
}) => {
  const dispatch = useAppDispatch();

  // Эффект для обработки завершения битвы при открытии модального окна
  useEffect(() => {
    if (isOpen && onBattleComplete) {
      onBattleComplete(isVictory);
    }
  }, [isOpen, isVictory, onBattleComplete]);

  // Обработчик закрытия модального окна
  const handleClose = () => {
    dispatch(hideBattleResultModal());
    if (onClose) onClose();
  };

  // Если модальное окно закрыто - не рендерим
  if (!isOpen) return null;

  // Данные для отображения в зависимости от результата
  const resultData = {
    victory: {
      title: '🎉 Победа!',
      message: 'Вы успешно прошли уровень!',
      color: '#4CAF50',
      icon: '🏆'
    },
    defeat: {
      title: '💀 Поражение',
      message: 'Попробуйте еще раз!',
      color: '#F44336',
      icon: '☠️'
    }
  };

  const data = resultData[isVictory ? 'victory' : 'defeat'];

  return (
    <div className="modal-overlay">
      <div className="modal-content campaign-result" style={{ borderColor: data.color }}>
        
        {/* Кнопка закрытия */}
        <button className="modal-close-button" onClick={handleClose}>
          ✕
        </button>
        
        {/* Иконка результата */}
        <div className="result-icon" style={{ color: data.color }}>
          {data.icon}
        </div>
        
        {/* Заголовок результата */}
        <h2 className="result-title" style={{ color: data.color }}>
          {data.title}
        </h2>
        
        {/* Сообщение результата */}
        <p className="result-message">
          {data.message}
        </p>
        
        {/* Дополнительная информация для победы */}
        {isVictory && (
          <div className="campaign-rewards">
            <h3>Уровень пройден!</h3>
            <div className="rewards-tip">
              Следующий уровень теперь доступен
            </div>
          </div>
        )}
        
        {/* Кнопка продолжения */}
        {showContinueButton && (
          <button 
            className="confirm-button" 
            onClick={handleClose}
            style={{ backgroundColor: data.color }}
          >
            Продолжить
          </button>
        )}
      </div>
    </div>
  );
};

export default BattleResultModal;
