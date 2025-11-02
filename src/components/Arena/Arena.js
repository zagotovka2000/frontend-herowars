import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../store/hooks';
import { initGame } from '../../store/slices/gameSlice';
import GameBoard from '../GameBoard/GameBoard';
import BackButton from '../Common/BackButton';
import ResourceBar from '../Common/ResourceBar';
import './Arena.css';

const Arena = ({ onScreenChange }) => {
  const dispatch = useAppDispatch();
  const [battleStarted, setBattleStarted] = useState(false);

  useEffect(() => {
    // Инициализируем игру при входе в арену
    dispatch(initGame());
    
    const timer = setTimeout(() => {
      setBattleStarted(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  if (!battleStarted) {
    return (
      <div className="arena-screen">
        <BackButton />
        <ResourceBar />
        <div className="arena-loading">
          <div className="loading-spinner">⚔️</div>
          <p>Поиск противника...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="arena-screen">
      <BackButton />
      <ResourceBar />
      
      <div className="arena-content">
        <div className="arena-header">
          <h2>⚔️ ПвП Арена</h2>
          <p>Сразитесь с противником в эпической битве 5x5!</p>
        </div>
        <GameBoard onScreenChange={onScreenChange} />
      </div>
    </div>
  );
};

export default Arena;
