// src/components/Common/BattleResultModal.js
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { hideBattleResultModal } from '../../store/slices/gameSlice';
import './BattleResultModal.css';

const BattleResultModal = ({ 
  isOpen, 
  onClose, 
  isVictory, 
  onBattleComplete,
  showContinueButton = true,
  rewards = null // Новый пропс для наград
}) => {
  
  const dispatch = useAppDispatch();
  const [showItems, setShowItems] = useState(false);
  const [hasHandledComplete, setHasHandledComplete] = useState(false);

  useEffect(() => {
   if (isOpen && isVictory && onBattleComplete && !hasHandledComplete) {
     console.log('🏆 BattleResultModal: Вызов onBattleComplete');
     setHasHandledComplete(true);
     onBattleComplete(isVictory);
   }
 }, [isOpen, isVictory, onBattleComplete, hasHandledComplete]);


  useEffect(() => {
   if (!isOpen) {
     setHasHandledComplete(false);
     setShowItems(false);
   }
 }, [isOpen]);
  // Эффект для показа предметов с задержкой
  useEffect(() => {
    if (isOpen && isVictory && rewards && rewards.items && rewards.items.length > 0) {
      const timer = setTimeout(() => {
        setShowItems(true);
      }, 500);
      return () => clearTimeout(timer);
   } else {
      setShowItems(false);
   }
}, [isOpen, isVictory, rewards]);
console.log(" rewards:", rewards)

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
        
        {/* Награды за победу */}
{isVictory && rewards && (
  <div className="campaign-rewards">
    <h3>Полученные награды:</h3>
    
    {/* ✅ ЗАЩИТА ОТ ОТСУТСТВИЯ ДАННЫХ */}
    <div className="basic-rewards">
      {(rewards.gold > 0 || rewards.gold === 0) && (
        <div className="reward-item gold">
          <span className="reward-icon">💰</span>
          <span className="reward-text">+{rewards.gold} золота</span>
        </div>
      )}
      {(rewards.experience > 0 || rewards.experience === 0) && (
        <div className="reward-item exp">
          <span className="reward-icon">⭐</span>
          <span className="reward-text">+{rewards.experience} опыта</span>
        </div>
      )}
    </div>

    {/* ✅ ЗАЩИТА ОТ ОТСУТСТВИЯ ПРЕДМЕТОВ */}
    {showItems && rewards.items && Array.isArray(rewards.items) && rewards.items.length > 0 && (
      <div className="item-rewards">
        <h4>🎁 Полученные предметы:</h4>
        <div className="items-grid">
          {rewards.items.map((item, index) => (
            <div 
              key={index} 
              className={`item-reward ${item.color || 'gray'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="item-image-container">
                <img 
                  src={item.imageUrl || `/images/items/${item.color || 'gray'}/default.png`} 
                  alt={item.name || 'Предмет'}
                  className="item-image"
                  onError={(e) => {
                    e.target.src = '/images/items/default.png';
                  }}
                />
                {item.quantity > 1 && (
                  <div className="item-quantity">x{item.quantity}</div>
                )}
              </div>
              <div className="item-name">{item.name || 'Неизвестный предмет'}</div>
              {item.description && (
                <div className="item-description">{item.description}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
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
