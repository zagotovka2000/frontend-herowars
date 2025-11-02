import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectPlayerCard } from '../../store/slices/gameSlice';
import Card from '../Card/Card';
import './PlayerField.css';

const PlayerField = () => {
  const dispatch = useAppDispatch();
  const { playerCards, selectedPlayerCard, battleMode, isPlayerTurn } = useAppSelector(state => state.game);

  const handleCardSelect = (card) => {
    if (battleMode === 'auto') {
      return;
    }

    if (card.health > 0 && isPlayerTurn) {
      dispatch(selectPlayerCard(card));
    }
  };

  return (
    <div className="cardsContainer">
      <div className="field-header">
        <h3>Ваши карты</h3>
        {battleMode === 'auto' && (
          <div className="auto-mode-indicator">🤖 Автоматический режим</div>
        )}
      </div>
      
      <div className="cardsGrid">
        {playerCards.map(card => (
          <Card
            key={card.id}
            card={card}
            type="player"
            isSelected={selectedPlayerCard?.id === card.id}
            isDefeated={card.health <= 0}
            onClick={handleCardSelect}
            battleMode={battleMode}
          />
        ))}
      </div>
    </div>
  );
};

export default PlayerField;
