// components/Campaign/Campaign.js
import React from 'react';
import { useApp } from '../../contex/AppContext';
import './Campaign.module.css';
import BackButton from '../Common/BackButton';
import ResourceBar from '../Common/ResourceBar';

const Campaign = () => {
  const { state, dispatch } = useApp();

  const campaignLevels = [
    { id: 1, name: 'Лесной путь', cost: 6, rewards: { gold: 50, exp: 25, items: ['Малое зелье'] } },
    { id: 2, name: 'Горный перевал', cost: 8, rewards: { gold: 75, exp: 40, items: ['Свиток улучшения'] } },
    { id: 3, name: 'Заброшенный замок', cost: 10, rewards: { gold: 100, exp: 60, items: ['Редкая карта'] } }
  ];

  const handleStartCampaign = (level) => {
    if (state.user.energy >= level.cost) {
      // Отправляем запрос на сервер
      dispatch({ 
        type: 'UPDATE_RESOURCES', 
        payload: { 
          energy: state.user.energy - level.cost,
          gold: state.user.gold + level.rewards.gold
        }
      });
      // Логика получения опыта и предметов
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
              className={`start-button ${state.user.energy < level.cost ? 'disabled' : ''}`}
              onClick={() => handleStartCampaign(level)}
              disabled={state.user.energy < level.cost}
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
