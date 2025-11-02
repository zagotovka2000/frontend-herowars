import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectEnemyCard } from '../../store/slices/gameSlice';
import Card from '../Card/Card';
import './EnemyField.css';

const EnemyField = () => {
  const dispatch = useAppDispatch();
  const { enemyCards, selectedEnemyCard, selectedPlayerCard, battleMode } = useAppSelector(state => state.game);

  const handleCardSelect = (card) => {
    if (battleMode === 'auto') {
      return;
    }

    if (selectedPlayerCard) {
      dispatch(selectEnemyCard(card));
    }
  };

  return (
    <div className="cardsContainer">
      <div className="field-header">
        <h3>Карты противника</h3>
        {battleMode === 'auto' && (
          <div className="auto-mode-indicator">🤖 Автоматический режим</div>
        )}
      </div>
      
      <div className="cardsGrid">
        {enemyCards.map(card => (
          <Card
            key={card.id}
            card={card}
            type="enemy"
            isSelected={selectedEnemyCard?.id === card.id}
            isDefeated={card.health <= 0}
            onClick={handleCardSelect}
            battleMode={battleMode}
          />
        ))}
      </div>
    </div>
  );
};

export default EnemyField;
