import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useEnergy } from '../../store/slices/appSlice';
import { initGame } from '../../store/slices/gameSlice';
import { navigateTo } from '../../store/slices/navigationSlice';
import BackButton from '../Common/BackButton';
import ResourceBar from '../Common/ResourceBar';
import BattleResultModal from '../Common/BattleResultModal';
import EnergyModal from '../Common/EnergyModal/EnergyModal';
import './Campaign.css';

const Campaign = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.app.user);
  const { showBattleResultModal: showModal, battleResult } = useAppSelector(state => state.game);
  
  const [completedLevels, setCompletedLevels] = useState([1]);
  const [currentLevel, setCurrentLevel] = useState(null);
  const [showEnergyModal, setShowEnergyModal] = useState(false);

  const campaignLevels = [
    { id: 1, name: 'Лесной путь', cost: 6, rewards: { gold: 50, exp: 25 } },
    { id: 2, name: 'Горный перевал', cost: 8, rewards: { gold: 75, exp: 40 } },
    { id: 3, name: 'Заброшенный замок', cost: 10, rewards: { gold: 100, exp: 60 } },
    { id: 4, name: 'Драконье логово', cost: 12, rewards: { gold: 150, exp: 80 } },
    { id: 5, name: 'Храм древних', cost: 15, rewards: { gold: 200, exp: 100 } },
    { id: 6, name: 'Ледяные пещеры', cost: 18, rewards: { gold: 250, exp: 120 } },
    { id: 7, name: 'Вулкан Огня', cost: 20, rewards: { gold: 300, exp: 150 } },
    { id: 8, name: 'Небесный город', cost: 22, rewards: { gold: 350, exp: 180 } },
    { id: 9, name: 'Подземная бездна', cost: 25, rewards: { gold: 400, exp: 200 } },
    { id: 10, name: 'Тронный зал', cost: 30, rewards: { gold: 500, exp: 250 } }
  ];

  const levelImages = [
    '🎯', '⚔️', '🏹', '🐉', '🏛️',
    '❄️', '🔥', '☁️', '🌑', '👑'
  ];

  const handleLevelClick = (level) => {
    if (!isLevelAvailable(level.id)) {
      return;
    }

    // Проверка энергии
    if (user.energy < level.cost) {
      setShowEnergyModal(true);
      return;
    }

    setCurrentLevel(level);
    dispatch(useEnergy(level.cost));
    
    // Переход на экран боя (арену)
    dispatch(initGame());
    dispatch(navigateTo('arena'));
  };

  const handleBattleComplete = (isVictory) => {
    if (isVictory && currentLevel) {
      // Разблокировка следующего уровня
      if (!completedLevels.includes(currentLevel.id + 1) && currentLevel.id < 10) {
        setCompletedLevels(prev => [...prev, currentLevel.id + 1]);
      }
    }
  };

  const isLevelAvailable = (levelId) => {
    return completedLevels.includes(levelId);
  };

  const handleCloseModal = () => {
    // Ничего не делаем, просто закрываем модальное окно
    // Остаемся в кампании
  };

  const handleCloseEnergyModal = () => {
    setShowEnergyModal(false);
  };

  const getLevelStatus = (levelId) => {
    if (completedLevels.includes(levelId)) return 'completed';
    if (isLevelAvailable(levelId)) return 'available';
    return 'locked';
  };

  return (
    <div className="campaign-screen">
      <BackButton />
      <ResourceBar />
      
      <div className="campaign-header">
        <h2>Кампания</h2>
        <div className="campaign-progress">
          Прогресс: {completedLevels.length - 1}/10
        </div>
      </div>

      <div className="campaign-levels-grid">
        {campaignLevels.map(level => {
          const status = getLevelStatus(level.id);
          const isDisabled = status === 'locked' || user.energy < level.cost;
          
          return (
            <div
              key={level.id}
              className={`campaign-level-item ${status} ${isDisabled ? 'disabled' : ''}`}
              onClick={() => handleLevelClick(level)}
            >
              <div className="level-icon">
                {levelImages[level.id - 1]}
              </div>
              <div className="level-info">
                <div className="level-name">{level.name}</div>
                <div className="level-cost">⚡ {level.cost}</div>
                {status === 'completed' && <div className="level-completed">✓</div>}
                {status === 'locked' && <div className="level-locked">🔒</div>}
              </div>
            </div>
          );
        })}
      </div>

      <BattleResultModal 
        isOpen={showModal}
        onClose={handleCloseModal}
        isVictory={battleResult === 'victory'}
        onBattleComplete={handleBattleComplete}
        showContinueButton={false}
      />

      <EnergyModal 
        isOpen={showEnergyModal}
        onClose={handleCloseEnergyModal}
        requiredEnergy={6}
        currentEnergy={user.energy}
      />
    </div>
  );
};

export default Campaign;
