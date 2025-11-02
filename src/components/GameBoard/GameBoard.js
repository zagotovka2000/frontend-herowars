import React from 'react';
import PlayerField from '../PlayerField/PlayerField';
import EnemyField from '../EnemyField/EnemyField';
import GameInfo from '../GameInfo/GameInfo';
import Controls from '../Controls/Controls';
import { useAppSelector } from '../../store/hooks';
import './GameBoard.css';
import { useBattle } from '../../hooks/useBattle';
import BattleResultModal from '../Common/BattleResultModal';

const GameBoard = ({ onScreenChange }) => {
  const gameState = useAppSelector(state => state.game);
  const { 
    performAttack, 
    closeBattleResultModal 
  } = useBattle();
 
  return (
    <div className='gameContainer'>
      <EnemyField />
      
      <div className='infoContainer'>
        <GameInfo />
        <Controls />
      </div>
      
      <PlayerField />
      
      <BattleResultModal 
        isOpen={gameState.showBattleResultModal}
        onClose={closeBattleResultModal}
        isVictory={gameState.battleResult === 'victory'}
        onScreenChange={onScreenChange}
      />
    </div>
  );
};

export default GameBoard;
