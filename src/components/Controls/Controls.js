// src/components/Controls/Controls.js
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { initGame } from '../../store/slices/gameSlice'; // ✅ ИСПРАВЛЕНО: используем initGame вместо resetGame
import { useBattle } from '../../hooks/useBattle';
import './Controls.css';

const Controls = () => {
  const dispatch = useAppDispatch();
  
  // Получаем состояние игры из Redux store
  const { 
    selectedPlayerCard, 
    selectedEnemyCard,
    isPlayerTurn,
    isBattleActive
  } = useAppSelector(state => state.game);
  
  // Получаем функции из хука useBattle
  const { 
    performAttack, 
    toggleBattleMode,
    battleMode,
    closeBattleResultModal
  } = useBattle();

  // Обработчик ручной атаки
  const handleAttack = () => {
    if (selectedPlayerCard && selectedEnemyCard) {
      console.log(`🎯 Ручная атака: игрок ${selectedPlayerCard.id} → враг ${selectedEnemyCard.id}`);
      performAttack(selectedPlayerCard, selectedEnemyCard, false);
    }
  };

  // Обработчик сброса игры
  const handleReset = () => {
    console.log('🔄 Новая игра');
    dispatch(initGame()); // ✅ ИСПРАВЛЕНО: используем initGame
  };

  // Определяем, нужно ли показывать кнопку атаки
  const showAttackButton = battleMode === 'manual' && 
                          isPlayerTurn && 
                          isBattleActive && 
                          selectedPlayerCard && 
                          selectedEnemyCard;

  return (
    <div className='controls'>
      {/* Кнопка атаки - ТОЛЬКО в ручном режиме и когда карты выбраны */}
      {showAttackButton && (
        <button 
          className='attack-button'
          onClick={handleAttack}
        >
          Атаковать ({selectedPlayerCard.value}⚔️)
        </button>
      )}
      
      {/* Переключение режима боя */}
      <button 
        className={`mode-toggle ${battleMode}`}
        onClick={toggleBattleMode}
      >
        {battleMode === 'manual' ? '🤖 Авто' : '⚔️ Ручной'}
      </button>

      {/* Кнопка новой игры */}
      <button 
        className='reset-button'
        onClick={handleReset}
      >
        Новая игра
      </button>

      {/* ✅ ДОБАВЛЕНО: кнопка выхода (опционально) */}
      <button 
        className='exit-button'
        onClick={closeBattleResultModal}
      >
        Выйти
      </button>
    </div>
  );
};

export default Controls;
