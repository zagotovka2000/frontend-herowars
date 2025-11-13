// src/components/Card/Card.js
import React from 'react';
import { useAppSelector } from '../../store/hooks';
import './Card.css';

const Card = ({ 
  card, 
  type, 
  isSelected, 
  isDefeated,
  onClick,
  battleMode,
  frameType = 'default'
}) => {
  const gameState = useAppSelector(state => state.game);
  
  // Флаги для анимаций
  const isAttacking = gameState.attackingCardId === card.id;
  const isDefending = gameState.defendingCardId === card.id;
  const isSuperAttackReady = card.superAttack >= 100;

  // Обработчик клика по карте
  const handleClick = () => {
    if (onClick && !isDefeated && card.health > 0) {
      onClick(card);
    }
  };

  // Формирование классов для wrapper
  const wrapperClasses = [
    'card-wrapper',
    type,
    `frame-${frameType}`,
    isSelected ? 'selected' : '',
    isAttacking ? 'attacking' : '',
    isDefending ? 'defending' : '',
    isDefeated ? 'defeated' : '',
    battleMode === 'auto' ? 'auto-mode' : '',
    isSuperAttackReady ? 'super-attack-ready' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses} onClick={handleClick}>
      {/* Полоска здоровья сверху */}
      {card.health > 0 && (
        <div className="health-bar-container">
          <div className="health-bar">
            <div 
              className="health-fill" 
              style={{ 
                width: `${(card.health / card.maxHealth) * 100}%` 
              }} 
            />
          </div>
        </div>
      )}
      
      {/* Полоска супер атаки снизу */}
      {card.health > 0 && (
        <div className="super-attack-bar-container">
          <div className="super-attack-bar">
            <div 
              className="super-attack-fill" 
              style={{ 
                width: `${card.superAttack}%` 
              }} 
            />
          </div>
        </div>
      )}
      
      {/* Рамка как внешний элемент */}
      <div className="card-frame"></div>
      
      {/* Основная карточка */}
      <div className="card">
        <div className="card-content">
          <div className="card-value">
            ⚔️ {card.value}
            {isSuperAttackReady && <span style={{color: 'gold', marginLeft: '5px'}}>✨</span>}
          </div>
          
          <div className="card-health">❤️ {card.health}/{card.maxHealth}</div>
          
          {card.health <= 0 && (
            <div className="dead-overlay">💀</div>
          )}
          
          {battleMode === 'auto' && (
            <div className="auto-badge">🤖</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
