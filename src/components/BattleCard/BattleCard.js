// src/components/BattleCard/BattleCard.js
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectPlayerCard, selectEnemyCard } from '../../store/slices/gameSlice';
import './BattleCard.css';

const BattleCard = ({ card, isPlayer, onAttack }) => {
  const dispatch = useAppDispatch();
  const { 
    selectedPlayerCard, 
    selectedEnemyCard, 
    isPlayerTurn,
    battleMode 
  } = useAppSelector(state => state.game);

  const isSelected = isPlayer 
    ? selectedPlayerCard?.id === card.id 
    : selectedEnemyCard?.id === card.id;

  const canSelect = isPlayer 
    ? isPlayerTurn && battleMode === 'manual' && card.health > 0
    : selectedPlayerCard && isPlayerTurn && battleMode === 'manual' && card.health > 0;

  const handleClick = () => {
    if (!canSelect) return;

    if (isPlayer) {
      console.log(`🎯 Выбрана карта игрока: ${card.id}`);
      dispatch(selectPlayerCard(card));
    } else {
      console.log(`🎯 Выбрана карта врага: ${card.id}`);
      dispatch(selectEnemyCard(card));
      
      // Если уже выбрана карта игрока, можно атаковать
      if (selectedPlayerCard) {
        console.log(`⚔️ Авто-атака после выбора врага`);
        onAttack(selectedPlayerCard, card, false);
      }
    }
  };

  if (card.health <= 0) {
    return (
      <div className="battle-card dead">
        <div className="card-content">
          <div className="card-value">💀</div>
          <div className="card-health">0/{card.maxHealth}</div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`battle-card ${isPlayer ? 'player' : 'enemy'} ${isSelected ? 'selected' : ''} ${!canSelect ? 'disabled' : ''}`}
      onClick={handleClick}
    >
      <div className="card-content">
        <div className="card-value">{card.value}⚔️</div>
        <div className="card-health">{card.health}/{card.maxHealth}❤️</div>
        <div className="card-super">
          <div 
            className="super-bar" 
            style={{ width: `${card.superAttack}%` }}
            title={`Супер атака: ${Math.floor(card.superAttack)}%`}
          >
            {card.superAttack >= 100 && !card.hasUsedSuperAttack ? '💥 ГОТОВО!' : ''}
          </div>
        </div>
        {card.hasUsedSuperAttack && (
          <div className="super-used">💥</div>
        )}
      </div>
    </div>
  );
};

export default BattleCard;
