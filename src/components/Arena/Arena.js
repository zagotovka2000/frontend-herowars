// components/Arena/Arena.js
import React, { useEffect, useState } from 'react';
import { GameProvider } from '../../hooks/useGameState'; // Импортируем GameProvider
import GameBoard from '../GameBoard/GameBoard'; // Импортируем компонент битвы
import BackButton from '../Common/BackButton';
import ResourceBar from '../Common/ResourceBar';
import './Arena.css';

const Arena = () => {
  const [battleStarted, setBattleStarted] = useState(false);

  useEffect(() => {
    // Имитируем загрузку битвы
    const timer = setTimeout(() => {
      setBattleStarted(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
      
      {/* Оборачиваем GameBoard в GameProvider для доступа к состоянию битвы */}
      <GameProvider>
        <div className="arena-content">
          <div className="arena-header">
            <h2>⚔️ ПвП Арена</h2>
            <p>Сразитесь с противником в эпической битве 5x5!</p>
          </div>
          <GameBoard /> {/* Здесь происходит вся битва */}
        </div>
      </GameProvider>
    </div>
  );
};

export default Arena;
