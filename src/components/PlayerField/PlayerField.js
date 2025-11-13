// src/components/PlayerField/PlayerField.js
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectPlayerCard } from '../../store/slices/gameSlice';
import Card from '../Card/Card';
import './PlayerField.css';

const PlayerField = () => {
  const dispatch = useAppDispatch();
  
  // Получаем состояние игры из Redux store
  const { 
    playerCards, 
    selectedPlayerCard, 
    battleMode, 
    isPlayerTurn,
    isBattleActive
  } = useAppSelector(state => state.game);

  // Обработчик выбора карты игрока
  const handleCardSelect = (card) => {
    // В автоматическом режиме выбор карт отключен
    if (battleMode === 'auto') {
      return;
    }

    // Можно выбрать только живую карту во время своего хода
    if (card.health > 0 && isPlayerTurn && isBattleActive) {
      dispatch(selectPlayerCard(card));
    }
  };

  return (
    <div className="cardsContainer player-field">
      {/* Заголовок поля */}
      <div className="field-header">
        <h3>Ваши карты</h3>
        {battleMode === 'auto' && (
          <div className="auto-mode-indicator">🤖 Автоматический режим</div>
        )}
      </div>
      
      {/* Сетка карт игрока */}
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
            frameType="player" // Специальная рамка для игрока
          />
        ))}
      </div>

      {/* ✅ ДОБАВЛЕНО: информация о состоянии поля */}
      <div className="field-info">
        {!isBattleActive && (
          <div className="battle-ended-banner">Бой завершен</div>
        )}
        {isPlayerTurn && battleMode === 'manual' && !selectedPlayerCard && (
          <div className="selection-hint">
            Выберите карту для атаки
          </div>
        )}
        {isPlayerTurn && battleMode === 'manual' && selectedPlayerCard && (
          <div className="selection-hint selected">
            Выбрана карта {selectedPlayerCard.id}. Теперь выберите цель.
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerField;
