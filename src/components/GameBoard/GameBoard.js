// src/components/GameBoard/GameBoard.js
import React, { useEffect } from 'react';
import PlayerField from '../PlayerField/PlayerField';
import EnemyField from '../EnemyField/EnemyField';
import GameInfo from '../GameInfo/GameInfo';
import Controls from '../Controls/Controls';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useBattle } from '../../hooks/useBattle';
import { enemyAttack, clearAnimation } from '../../store/slices/gameSlice';
import './GameBoard.css';
import BattleResultModal from '../Common/BattleResultModal';

const GameBoard = ({ onScreenChange }) => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector(state => state.game);

  const { 
    autoPlayerAttack, 
    closeBattleResultModal 
  } = useBattle();

  // Эффект для очистки анимации через время
  useEffect(() => {
    if (gameState.attackingCardId || gameState.defendingCardId) {
      const timer = setTimeout(() => {
        dispatch(clearAnimation());
      }, 600); // Время должно совпадать с длительностью CSS-анимации
      
      return () => clearTimeout(timer);
    }
  }, [gameState.attackingCardId, gameState.defendingCardId, dispatch]);

  // Эффект для автоматической атаки в авто-режиме
  useEffect(() => {
    if (gameState.battleMode === 'auto' && 
        gameState.isPlayerTurn && 
        gameState.isBattleActive) {
      
      const timer = setTimeout(() => {
        console.log('🤖 Автоматическая атака...');
        autoPlayerAttack();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.battleMode, gameState.isPlayerTurn, gameState.isBattleActive, autoPlayerAttack]);

  // Эффект для атаки противника
  useEffect(() => {
    if (!gameState.isPlayerTurn && gameState.isBattleActive) {
      const timer = setTimeout(() => {
        console.log('⚡ Ход противника');
        dispatch(enemyAttack());
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.isPlayerTurn, gameState.isBattleActive, dispatch]);

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
