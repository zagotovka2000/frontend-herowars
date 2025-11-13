// src/components/EnemyField/EnemyField.js
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectEnemyCard } from '../../store/slices/gameSlice';
import Card from '../Card/Card';
import './EnemyField.css';

const EnemyField = () => {
  const dispatch = useAppDispatch();
  
  // Получаем состояние игры из Redux store
  const { 
    enemyCards, 
    selectedEnemyCard, 
    selectedPlayerCard, 
    battleMode,
    isPlayerTurn,
    isBattleActive
  } = useAppSelector(state => state.game);

  // Обработчик выбора карты противника
  const handleCardSelect = (card) => {
    // В автоматическом режиме выбор карт отключен
    if (battleMode === 'auto') {
      return;
    }

    // Можно выбрать карту противника только если выбрана своя карта и ход игрока
    if (selectedPlayerCard && isPlayerTurn && isBattleActive) {
      dispatch(selectEnemyCard(card));
    }
  };

  return (
    <div className="cardsContainer enemy-field">
      {/* Заголовок поля */}
      <div className="field-header">
        <h3>Карты противника</h3>
        {battleMode === 'auto' && (
          <div className="auto-mode-indicator">🤖 Автоматический режим</div>
        )}
      </div>
      
      {/* Сетка карт противника */}
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
            frameType="enemy" // Специальная рамка для противника
          />
        ))}
      </div>

      {/* ✅ ДОБАВЛЕНО: информация о состоянии поля */}
      <div className="field-info">
        {!isBattleActive && (
          <div className="battle-ended-banner">Бой завершен</div>
        )}
        {isPlayerTurn && battleMode === 'manual' && (
          <div className="selection-hint">
            {selectedPlayerCard ? 'Выберите карту противника для атаки' : 'Сначала выберите свою карту'}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnemyField;
