import React from 'react';
import { useGameState } from '../../hooks/useGameState';
import styles from './GameInfo.module.css';

const GameInfo = () => {
  const { state } = useGameState();

  return (
    <div className={styles.gameInfo}>
      <div className={styles.playerInfo}>
        <div className={styles.playerName}>Игрок</div>
        <div className={styles.playerHealth}>❤️ {state.playerHealth}</div>
      </div>
      
      <div className={styles.turnIndicator}>
        {state.isPlayerTurn ? "Ваш ход!" : "Ход противника..."}
      </div>
      
      <div className={styles.playerInfo}>
        <div className={styles.playerName}>Противник</div>
        <div className={styles.playerHealth}>❤️ {state.enemyHealth}</div>
      </div>
    </div>
  );
};

export default GameInfo;
