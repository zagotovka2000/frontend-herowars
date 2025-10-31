import React from 'react';
import Card from '../Card/Card';
import { useGameState } from '../../hooks/useGameState';
import styles from './EnemyField.module.css';

const EnemyField = () => {
  const { state, dispatch } = useGameState();

  const handleCardSelect = (card) => {
    if (state.isPlayerTurn && state.selectedPlayerCard) {
      dispatch({ type: 'SELECT_ENEMY_CARD', card });
    }
  };

  return (
    <div className={styles.cardsContainer}>
      <div className={styles.cardsGrid}>
        {state.enemyCards.map(card => (
          <Card
            key={card.id}
            card={card}
            type="enemy"
            isSelected={state.selectedEnemyCard?.id === card.id}
            isDefeated={card.health <= 0}
            onClick={handleCardSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default EnemyField;
