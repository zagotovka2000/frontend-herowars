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

const GameBoard = ({ onBattleEnd }) => { // ✅ ДОБАВЛЕНО: принимаем onBattleEnd пропс
  const dispatch = useAppDispatch();
  const gameState = useAppSelector(state => state.game);

  const { 
    autoPlayerAttack, 
    closeBattleResultModal 
  } = useBattle();

  // ✅ ДОБАВЛЕНО: Эффект для определения конца битвы
  useEffect(() => {
    if (!gameState.isBattleActive) return;

    const playerAlive = gameState.playerCards.some(card => card.health > 0);
    const enemyAlive = gameState.enemyCards.some(card => card.health > 0);

    console.log('🎯 Проверка состояния битвы:', { 
      playerAlive, 
      enemyAlive,
      playerCards: gameState.playerCards.map(c => ({id: c.id, health: c.health})),
      enemyCards: gameState.enemyCards.map(c => ({id: c.id, health: c.health}))
    });
    const battleEnded = !playerAlive || !enemyAlive;

    if (battleEnded) {
      const isVictory = !enemyAlive && playerAlive;
      console.log('🏁 Битва завершена! Результат:', isVictory ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ');
      if (isVictory) {
         dispatch(setBattleResult('victory'));
         dispatch(showBattleResultModal(true));
       } else {
         dispatch(setBattleResult('defeat'));
         dispatch(showBattleResultModal(true));
       }
      // Вызываем колбэк завершения битвы
      if (onBattleEnd) {
        onBattleEnd(isVictory);
      }
    }
  }, [gameState.playerCards, gameState.enemyCards, gameState.isBattleActive, onBattleEnd]);
  
// В GameBoard.js - улучшенный эффект для определения конца битвы
useEffect(() => {
   if (!gameState.isBattleActive) return;
 
   const playerAlive = gameState.playerCards.some(card => card.health > 0);
   const enemyAlive = gameState.enemyCards.some(card => card.health > 0);
 
   console.log('🎯 Проверка состояния битвы:', { 
     playerAlive, 
     enemyAlive,
     playerCards: gameState.playerCards.map(c => ({id: c.id, health: c.health})),
     enemyCards: gameState.enemyCards.map(c => ({id: c.id, health: c.health}))
   });
 
   // ✅ ИСПРАВЛЕНО: Более точная проверка конца битвы
   const battleEnded = !playerAlive || !enemyAlive;
   
   if (battleEnded) {
     const isVictory = !enemyAlive && playerAlive; // Победа если враги мертвы, а игрок жив
     console.log('🏁 Битва завершена! Результат:', isVictory ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ');
     
     // Вызываем колбэк завершения битвы
     if (onBattleEnd) {
       onBattleEnd(isVictory);
     }
   }
 }, [gameState.playerCards, gameState.enemyCards, gameState.isBattleActive, onBattleEnd]);
  // Эффект для очистки анимации через время
  useEffect(() => {
    if (gameState.attackingCardId || gameState.defendingCardId) {
      const timer = setTimeout(() => {
        dispatch(clearAnimation());
      }, 600);
      
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
    </div>
  );
};

export default GameBoard;
