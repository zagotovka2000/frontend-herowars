import React from 'react';
import { useGameState } from '../../hooks/useGameState';
import styles from './Card.module.css';

const Card = ({ 
  card, 
  type, 
  isSelected, 
  isDefeated,
  onClick 
}) => {
  const { state } = useGameState();
  
  // Определяем, является ли эта карта атакующей или защищающейся
  // Теперь ID уникальны, так что не будет конфликтов
  const isAttacking = state.attackingCardId === card.id;
  const isDefending = state.defendingCardId === card.id;

  const handleClick = () => {
    if (onClick && !isDefeated && card.health > 0) {
      onClick(card);
    }
  };

  // Формируем классы для карточки
  const cardClasses = [
    styles.card,
    isSelected ? styles.selected : '',
    isAttacking ? styles.attacking : '',
    isDefending ? styles.defending : '',
    isDefeated ? styles.defeated : '',
    isAttacking ? 'animate__animated animate__pulse' : '',
    isDefending ? 'shake-constant shake-horizontal' : '',
    isDefeated ? 'animate__animated animate__bounceOut' : ''
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses} onClick={handleClick}>
      <div className={styles.cardValue}>{card.value}</div>
      {card.health < card.maxHealth && card.health > 0 && (
        <div className={styles.healthBar}>
          <div 
            className={styles.healthFill} 
            style={{ 
              width: `${(card.health / card.maxHealth) * 100}%` 
            }} 
          />
        </div>
      )}
      {card.health <= 0 && (
        <div className={styles.deadOverlay}>💀</div>
      )}
    </div>
  );
};

export default Card;
