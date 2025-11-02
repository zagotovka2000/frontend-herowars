import React from 'react';
import { useAppSelector } from '../../store/hooks';
import './GameInfo.css';

const GameInfo = () => {
  const { playerCards, enemyCards, isPlayerTurn, battleMode } = useAppSelector(state => state.game);
  
  const alivePlayerCards = playerCards.filter(card => card.health > 0).length;
  const aliveEnemyCards = enemyCards.filter(card => card.health > 0).length;

  return (
    <div className="game-info">
      <div className="cards-count">
        <div className="count-item">
          <span>Ваши карты: {alivePlayerCards}/5</span>
        </div>
        <div className="count-item">
          <span>Карты противника: {aliveEnemyCards}/5</span>
        </div>
      </div>
      
      <div className="battle-info">
        <div className={`turn-indicator ${isPlayerTurn ? 'player-turn' : 'enemy-turn'}`}>
          {isPlayerTurn ? '🎯 Ваш ход' : '⚡ Ход противника'}
        </div>
        <div className={`mode-indicator ${battleMode}`}>
          Режим: {battleMode === 'manual' ? '⚔️ Ручной' : '🤖 Автоматический'}
        </div>
      </div>
    </div>
  );
};

export default GameInfo;
