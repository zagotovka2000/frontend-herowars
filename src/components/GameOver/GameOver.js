import React from 'react';
import { useBattle } from '../../hooks/useBattle';
import styles from './GameOver.module.css';

const GameOver = ({ isWin }) => {
  const { resetGame } = useBattle();

  return (
    <div className={styles.gameOver}>
      <div className={`${styles.message} animate__animated animate__bounceIn`}>
        {isWin ? "🎉 Победа! 🎉" : "💔 Поражение 💔"}
      </div>
      <button 
        className={styles.playAgainButton}
        onClick={resetGame}
        style={{
          background: isWin ? 
            'linear-gradient(135deg, #4ecdc4, #44a08d)' : 
            'linear-gradient(135deg, #ff6b6b, #ee5a24)'
        }}
      >
        Играть снова
      </button>
    </div>
  );
};

export default GameOver;
