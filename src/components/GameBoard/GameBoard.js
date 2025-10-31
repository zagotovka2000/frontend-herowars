import React from 'react';
import PlayerField from '../PlayerField/PlayerField';
import EnemyField from '../EnemyField/EnemyField';
import GameInfo from '../GameInfo/GameInfo';
import Controls from '../Controls/Controls';
import GameOver from '../GameOver/GameOver';
import { useGameState } from '../../hooks/useGameState';
import styles from './GameBoard.module.css';

const GameBoard = () => {
  const { state } = useGameState();

  const isGameOver = state.playerHealth <= 0 || state.enemyHealth <= 0;

  if (isGameOver) {
    return <GameOver isWin={state.enemyHealth <= 0} />;
  }

  return (
    <div className={styles.gameContainer}>
      <EnemyField />
      
      <div className={styles.infoContainer}>
        <GameInfo />
        <Controls />
      </div>
      
      <PlayerField />
    </div>
  );
};

export default GameBoard;
