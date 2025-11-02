import React from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { useEnergy, addGold, addExperience } from '../../store/slices/appSlice';
import BackButton from '../Common/BackButton';
import ResourceBar from '../Common/ResourceBar';
import './Campaign.css';

const Campaign = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.app.user);

  const campaignLevels = [
    { id: 1, name: 'Лесной путь', cost: 6, rewards: { gold: 50, exp: 25, items: ['Малое зелье'] } },
    { id: 2, name: 'Горный перевал', cost: 8, rewards: { gold: 75, exp: 40, items: ['Свиток улучшения'] } },
    { id: 3, name: 'Заброшенный замок', cost: 10, rewards: { gold: 100, exp: 60, items: ['Редкая карта'] } }
  ];

  const handleStartCampaign = (level) => {
    if (user.energy >= level.cost) {
      dispatch(useEnergy(level.cost));
      dispatch(addGold(level.rewards.gold));
      dispatch(addExperience(level.rewards.exp));
      // Здесь можно добавить логику для добавления предметов
    }
  };

  return (
    <div className="campaign-screen">
      <BackButton />
      <ResourceBar />
      <h2>Кампания</h2>
      <div className="campaign-levels">
        {campaignLevels.map(level => (
          <div key={level.id} className="campaign-level">
            <h3>{level.name}</h3>
            <div className="level-cost">⚡ Стоимость: {level.cost}</div>
            <div className="level-rewards">
              <span>💰 {level.rewards.gold}</span>
              <span>📚 {level.rewards.exp} опыта</span>
            </div>
            <button 
              className={`start-button ${user.energy < level.cost ? 'disabled' : ''}`}
              onClick={() => handleStartCampaign(level)}
              disabled={user.energy < level.cost}
            >
              Начать
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Campaign;
