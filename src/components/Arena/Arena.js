// src/components/Arena/Arena.js
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { navigateBack } from '../../store/slices/navigationSlice';
import { initGame } from '../../store/slices/gameSlice';
import GameBoard from '../GameBoard/GameBoard';
import Controls from '../Controls/Controls';
import './Arena.css';

const Arena = () => {
  const dispatch = useAppDispatch();
  const [battleInitialized, setBattleInitialized] = useState(false);

  // Эффект для инициализации битвы при монтировании компонента
  useEffect(() => {
    // ✅ Инициализируем битву только один раз
    if (!battleInitialized) {
      console.log('🎮 Инициализация арены...');
      dispatch(initGame());
      setBattleInitialized(true);
    }
  }, [dispatch, battleInitialized]);

  // Обработчик выхода из арены
  const handleExit = () => {
    console.log('🎮 Выход из арены');
    dispatch(navigateBack());
  };

  return (
    <div className="arena">
      <div className="arena-header">
        <button className="back-button" onClick={handleExit}>
          ← Назад
        </button>
        <h1>⚔️ Арена</h1>
        <div className="battle-info">
          <span>Режим: PvP</span>
          <span>Ход: Игрока</span>
        </div>
      </div>
      
      <div className="arena-content">
        <GameBoard />
        <Controls />
      </div>
    </div>
  );
};

export default Arena;
