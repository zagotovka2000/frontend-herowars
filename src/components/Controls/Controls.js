import React from 'react';
import { useGameState } from '../../hooks/useGameState';
import { useBattle } from '../../hooks/useBattle';
import styles from './Controls.module.css';

const Controls = () => {
  const { state } = useGameState();
  const { performAttack, resetGame } = useBattle();

  const canAttack = state.isPlayerTurn && 
                   state.selectedPlayerCard && 
                   state.selectedEnemyCard;

  return (
    <div className={styles.controls}>
      <button 
        className={styles.attackButton}
        onClick={performAttack}
        disabled={!canAttack}
      >
        Атаковать!
      </button>
      <button 
        className={styles.resetButton}
        onClick={resetGame}
      >
        Новая игра
      </button>
    </div>
  );
};

export default Controls;
