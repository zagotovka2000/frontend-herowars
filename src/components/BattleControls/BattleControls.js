// src/components/BattleControls/BattleControls.js
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setBattleMode, resetGame } from '../../store/slices/gameSlice';
import { useBattle } from '../../hooks/useBattle';
import './BattleControls.css';

const BattleControls = () => {
  const dispatch = useAppDispatch();
  const { 
    battleMode, 
    selectedPlayerCard, 
    selectedEnemyCard, 
    isPlayerTurn,
    playerCards,
    enemyCards,
    isBattleActive
  } = useAppSelector(state => state.game);
  
  const { 
    performAttack, 
    startAutoAttack, 
    stopAutoAttack, 
    closeBattleResultModal 
  } = useBattle();

  const handleAttack = () => {
    if (selectedPlayerCard && selectedEnemyCard) {
      console.log(`🎯 Атака: игрок ${selectedPlayerCard.id} → враг ${selectedEnemyCard.id}`);
      performAttack(selectedPlayerCard, selectedEnemyCard, false);
    } else {
      console.log('❌ Выберите карту игрока и карту врага для атаки');
    }
  };

  const handleSuperAttack = () => {
    if (selectedPlayerCard && selectedEnemyCard && selectedPlayerCard.superAttack >= 100) {
      console.log(`💥 СУПЕР АТАКА: игрок ${selectedPlayerCard.id} → враг ${selectedEnemyCard.id}`);
      performAttack(selectedPlayerCard, selectedEnemyCard, true);
    } else {
      console.log('❌ Недостаточно энергии для супер атаки');
    }
  };

  const handleAutoToggle = () => {
    if (battleMode === 'manual') {
      // Включаем авто-режим
      dispatch(setBattleMode('auto'));
      console.log('🤖 Включен авто-режим');
    } else {
      // Выключаем авто-режим
      dispatch(setBattleMode('manual'));
      stopAutoAttack();
      console.log('⚔️ Включен ручной режим');
    }
  };

  const handleReset = () => {
    console.log('🔄 Сброс игры');
    stopAutoAttack();
    dispatch(resetGame());
  };

  const canAttack = selectedPlayerCard && selectedEnemyCard && isPlayerTurn && battleMode === 'manual';
  const canSuperAttack = canAttack && selectedPlayerCard.superAttack >= 100 && !selectedPlayerCard.hasUsedSuperAttack;
  const isAutoModeActive = battleMode === 'auto' && isPlayerTurn && isBattleActive;

  return (
    <div className='battle-controls'>
      <div className="controls-row">
        {/* Ручная атака */}
        <button 
          className='control-button attack-button'
          onClick={handleAttack}
          disabled={!canAttack}
        >
          {canAttack ? `⚔️ Атака (${selectedPlayerCard.value})` : '⚔️ Атака'}
        </button>
        
        {/* Супер атака */}
        <button 
          className='control-button super-attack-button'
          onClick={handleSuperAttack}
          disabled={!canSuperAttack}
        >
          {canSuperAttack ? `💥 Супер атака!` : `Супер ${selectedPlayerCard ? Math.floor(selectedPlayerCard.superAttack) : 0}%`}
        </button>
      </div>

      <div className="controls-row">
        {/* Переключение режима */}
        <button 
          className={`control-button mode-button ${battleMode}`}
          onClick={handleAutoToggle}
        >
          {battleMode === 'manual' ? '🤖 Авто-бой' : '🛑 Стоп авто'}
        </button>
        
        {/* Сброс игры */}
        <button 
          className='control-button reset-button'
          onClick={handleReset}
        >
          🔄 Новая игра
        </button>
      </div>

      {/* Информация о ходе */}
      <div className="turn-info">
        <div className={`turn-indicator ${isPlayerTurn ? 'player-turn' : 'enemy-turn'}`}>
          {isPlayerTurn ? '🎮 Ваш ход' : '🤖 Ход противника'}
        </div>
        <div className={`mode-info ${isAutoModeActive ? 'auto-active' : ''}`}>
          Режим: {battleMode === 'manual' ? 'Ручной' : 'Авто'} 
          {isAutoModeActive && ' ⚡'}
        </div>
      </div>
    </div>
  );
};

export default BattleControls;
