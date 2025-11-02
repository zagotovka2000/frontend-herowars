import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setBattleMode, resetGame } from '../../store/slices/gameSlice';
import { useBattle } from '../../hooks/useBattle';
import './Controls.css';

const Controls = () => {
  const dispatch = useAppDispatch();
  const { battleMode, selectedPlayerCard, selectedEnemyCard, isPlayerTurn } = useAppSelector(state => state.game);
  const { performAttack } = useBattle();

  const handleAttack = () => {
    performAttack();
  };

  const handleModeToggle = () => {
    const newMode = battleMode === 'manual' ? 'auto' : 'manual';
    dispatch(setBattleMode(newMode));
  };

  const handleReset = () => {
    dispatch(resetGame());
  };

  const canAttack = selectedPlayerCard && selectedEnemyCard && isPlayerTurn && battleMode === 'manual';

  return (
    <div className='controls'>
      <button 
        className='attackButton'
        onClick={handleAttack}
        disabled={!canAttack}
      >
        Атаковать!
      </button>
      
      <button 
        className='resetButton'
        onClick={handleReset}
      >
        Новая игра
      </button>

      <button 
        className={`mode-toggle ${battleMode}`}
        onClick={handleModeToggle}
      >
        {battleMode === 'manual' ? '⚔️ Ручной' : '🤖 Авто'}
      </button>
    </div>
  );
};

export default Controls;
