import React from 'react';
import { useAppSelector } from '../../store/hooks';
import './Card.css';

const Card = ({ 
  card, 
  type, 
  isSelected, 
  isDefeated,
  onClick,
  battleMode
}) => {
  const gameState = useAppSelector(state => state.game);
  
  const isAttacking = gameState.attackingCardId === card.id;
  const isDefending = gameState.defendingCardId === card.id;

  const handleClick = () => {
    if (onClick && !isDefeated && card.health > 0) {
      onClick(card);
    }
  };

  const cardClasses = [
    'card',
    type,
    isSelected ? 'selected' : '',
    isAttacking ? 'attacking' : '',
    isDefending ? 'defending' : '',
    isDefeated ? 'defeated' : '',
    battleMode === 'auto' ? 'auto-mode' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={handleClick}>
      <div className="card-value">⚔️ {card.value}</div>
      
      <div className="card-health">❤️ {card.health}/{card.maxHealth}</div>
      
      {card.health < card.maxHealth && card.health > 0 && (
        <div className="health-bar">
          <div 
            className="health-fill" 
            style={{ 
              width: `${(card.health / card.maxHealth) * 100}%` 
            }} 
          />
        </div>
      )}
      
      {card.health <= 0 && (
        <div className="dead-overlay">💀</div>
      )}
      
      {battleMode === 'auto' && (
        <div className="auto-badge">🤖</div>
      )}
    </div>
  );
};

export default Card;
