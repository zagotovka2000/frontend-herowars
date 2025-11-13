// src/components/GameInfo/GameInfo.js
import React from 'react';
import { useAppSelector } from '../../store/hooks';
import './GameInfo.css';

const GameInfo = () => {
  // Получаем состояние игры из Redux store
  const { 
    playerCards, 
    enemyCards, 
    isPlayerTurn, 
    battleMode, 
    isBattleActive,
    playerHealth,
    enemyHealth
  } = useAppSelector(state => state.game);
  
  // Подсчитываем живые карты
  const alivePlayerCards = playerCards.filter(card => card.health > 0).length;
  const aliveEnemyCards = enemyCards.filter(card => card.health > 0).length;

  // Определяем текст для индикатора хода
  const getTurnText = () => {
    if (!isBattleActive) return 'Бой завершен';
    return isPlayerTurn ? '🎯 Ваш ход' : '⚡ Ход противника';
  };

  // Определяем текст для индикатора режима
  const getModeText = () => {
    return battleMode === 'manual' ? '⚔️ Ручной' : '🤖 Автоматический';
  };

  return (
    <div className="game-info">
      {/* Счетчик карт */}
      <div className="cards-count">
        <div className="count-item player-count">
          <span className="count-label">Ваши карты:</span>
          <span className="count-value">{alivePlayerCards}/5</span>
        </div>
        <div className="count-item enemy-count">
          <span className="count-label">Карты противника:</span>
          <span className="count-value">{aliveEnemyCards}/5</span>
        </div>
      </div>
      
      {/* Здоровье игроков (если есть в состоянии) */}
      {(playerHealth !== undefined || enemyHealth !== undefined) && (
        <div className="health-info">
          {playerHealth !== undefined && (
            <div className="health-item player-health">
              <span className="health-label">Ваше здоровье:</span>
              <span className="health-value">❤️ {playerHealth}</span>
            </div>
          )}
          {enemyHealth !== undefined && (
            <div className="health-item enemy-health">
              <span className="health-label">Здоровье противника:</span>
              <span className="health-value">❤️ {enemyHealth}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Информация о битве */}
      <div className="battle-info">
        <div className={`turn-indicator ${isPlayerTurn ? 'player-turn' : 'enemy-turn'}`}>
          {getTurnText()}
        </div>
        <div className={`mode-indicator ${battleMode}`}>
          Режим: {getModeText()}
        </div>
        {!isBattleActive && (
          <div className="battle-ended">
            Ожидание завершения...
          </div>
        )}
      </div>
    </div>
  );
};

export default GameInfo;
