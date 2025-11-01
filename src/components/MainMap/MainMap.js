// components/MainMap/MainMap.js
import React from 'react';
import { useApp } from '../../contex/AppContext';
import { useNavigation } from '../../contex/NavigationContext'; // Добавляем импорт
import ResourceBar from '../Common/ResourceBar';
import './MainMap.css';

const MainMap = () => {
  const { state } = useApp();
  const { navigateTo } = useNavigation(); // Получаем navigateTo из контекста

  // Массив игровых режимов с позициями
  const gameModes = [
    {
      id: 'campaign',
      name: 'Кампания',
      icon: '⚔️',
      position: { top: '20%', left: '10%' },
      description: 'Фарм предметов (6⚡)',
      energyCost: 6,
      serverEndpoint: '/campaign'
    },
    {
      id: 'arena',
      name: 'ПвП Арена',
      icon: '🏆',
      position: { top: '30%', right: '15%' },
      description: 'Битвы 5x5',
      serverEndpoint: '/battle'
    },
    {
      id: 'guild-war',
      name: 'Война Гильдий',
      icon: '🏰',
      position: { top: '45%', left: '20%' },
      description: 'Сражения гильдий',
      serverEndpoint: '/guild/war'
    },
    {
      id: 'expedition',
      name: 'Экспедиции',
      icon: '🗺️',
      position: { top: '60%', right: '25%' },
      description: '15мин - 3часа',
      serverEndpoint: '/expedition'
    },
    {
      id: 'shop',
      name: 'Магазин',
      icon: '🏪',
      position: { top: '70%', left: '15%' },
      description: 'Торговец',
      serverEndpoint: '/shop'
    },
    {
      id: 'collection',
      name: 'Коллекция',
      icon: '🃏',
      position: { bottom: '20%', left: '30%' },
      description: 'Мощь карт: 1250',
      serverEndpoint: '/collection'
    },
    {
      id: 'daily-reward',
      name: 'Ежедневная Награда',
      icon: '🎁',
      position: { top: '10%', left: '50%', transform: 'translateX(-50%)' },
      description: 'Заходи каждый день!',
      serverEndpoint: '/daily-reward'
    },
    {
      id: 'quests',
      name: 'Ежедневные Квесты',
      icon: '📜',
      position: { bottom: '15%', right: '20%' },
      description: 'Задания',
      serverEndpoint: '/quests'
    },
    {
      id: 'free-chest',
      name: 'Бесплатный Сундук',
      icon: '📦',
      position: { top: '40%', left: '45%' },
      description: 'Доступно через: 02:15:30',
      serverEndpoint: '/free-chest'
    }
  ];

  const handleModeClick = async (mode) => {
    console.log(`Переход в режим: ${mode.name}`);
    
    // Временная заглушка для серверных вызовов
    if (mode.serverEndpoint) {
      try {
        console.log(`Вызов API: ${mode.serverEndpoint}`);
        
        // Заглушка - имитация API вызова
        const mockResponse = await mockApiCall(mode.serverEndpoint);
        console.log('Ответ сервера:', mockResponse);
        
        // Используем navigateTo из контекста навигации
        navigateTo(mode.id);
      } catch (error) {
        console.error('Ошибка API:', error);
      }
    } else {
      // Используем navigateTo из контекста навигации
      navigateTo(mode.id);
    }
  };

  // Заглушка для имитации API вызовов
  const mockApiCall = (endpoint) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          endpoint: endpoint,
          data: { message: `Режим ${endpoint} загружен` }
        });
      }, 500);
    });
  };

  return (
    <div className="main-map">
      <div className="map-background"></div>
      <ResourceBar />
      
      {/* Игровые режимы */}
      {gameModes.map(mode => (
        <div
          key={mode.id}
          className={`game-mode ${state.user.energy < (mode.energyCost || 0) ? 'disabled' : ''}`}
          style={mode.position}
          onClick={() => handleModeClick(mode)}
        >
          <div className="mode-icon">{mode.icon}</div>
          <div className="mode-content">
            <div className="mode-name">{mode.name}</div>
            <div className="mode-description">{mode.description}</div>
            {mode.energyCost && (
              <div className="energy-cost">⚡ {mode.energyCost}</div>
            )}
          </div>
        </div>
      ))}

      {/* Информация о гильдии (если есть) */}
      {state.guild && (
        <div className="guild-info" style={{ top: '5%', right: '5%' }}>
          <div className="guild-name">{state.guild.name}</div>
          <div className="guild-rank">Ранг: #{state.guild.rank}</div>
        </div>
      )}
    </div>
  );
};

export default MainMap;
