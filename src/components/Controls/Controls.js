import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setBattleMode, resetGame } from '../../store/slices/gameSlice';
import { useBattle } from '../../hooks/useBattle';
import './Controls.css';

const Controls = () => {
  const dispatch = useAppDispatch();
  const { 
    battleMode, 
    selectedPlayerCard, 
    selectedEnemyCard, 
    isPlayerTurn,
    playerCards,
    enemyCards 
  } = useAppSelector(state => state.game);
  
  const { performAttack, autoPlayerAttack } = useBattle();

  const handleAttack = () => {
    if (selectedPlayerCard && selectedEnemyCard) {
      console.log(`🎯 Атака: игрок ${selectedPlayerCard.id} → враг ${selectedEnemyCard.id}`);
      performAttack(selectedPlayerCard, selectedEnemyCard, false);
    } else {
      console.log('❌ Не выбраны карты для атаки');
    }
  };

  const handleAutoAttack = () => {
    console.log('🤖 Запуск авто-атаки');
    autoPlayerAttack();
  };

  const handleModeToggle = () => {
    const newMode = battleMode === 'manual' ? 'auto' : 'manual';
    dispatch(setBattleMode(newMode));
    console.log(`🎮 Режим битвы изменен на: ${newMode}`);
  };

  const handleReset = () => {
    console.log('🔄 Сброс игры');
    dispatch(resetGame());
  };

  const canAttack = selectedPlayerCard && selectedEnemyCard && isPlayerTurn && battleMode === 'manual';
  const canAutoAttack = isPlayerTurn && battleMode === 'auto' && playerCards.length > 0 && enemyCards.length > 0;

  return (
    <div className='controls'>
      {/* Кнопка ручной атаки */}
      <button 
        className='attackButton'
        onClick={handleAttack}
        disabled={!canAttack}
      >
        {canAttack ? `Атаковать (${selectedPlayerCard.value}⚔️)` : 'Атаковать!'}
      </button>
      
      {/* Кнопка авто-атаки */}
      <button 
        className='autoAttackButton'
        onClick={handleAutoAttack}
        disabled={!canAutoAttack}
      >
        Авто-атака
      </button>
      
      {/* Переключение режима */}
      <button 
        className={`mode-toggle ${battleMode}`}
        onClick={handleModeToggle}
      >
        {battleMode === 'manual' ? '⚔️ Ручной' : '🤖 Авто'}
      </button>

      {/* Сброс игры */}
      <button 
        className='resetButton'
        onClick={handleReset}
      >
        Новая игра
      </button>
    </div>
  );
};

export default Controls;
