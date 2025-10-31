import React from 'react';
import Card from '../Card/Card';
import { useGameState } from '../../hooks/useGameState';
import styles from './PlayerField.module.css';

const PlayerField = () => {
  const { state, dispatch } = useGameState();

  const handleCardSelect = (card) => {
    if (state.isPlayerTurn) {
      dispatch({ type: 'SELECT_PLAYER_CARD', card });
    }
  };

  return (
    <div className={styles.cardsContainer}>
      <div className={styles.cardsGrid}>
        {state.playerCards.map(card => (
          <Card
            key={card.id}
            card={card}
            type="player"
            isSelected={state.selectedPlayerCard?.id === card.id}
            isDefeated={card.health <= 0}
            onClick={handleCardSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerField;
