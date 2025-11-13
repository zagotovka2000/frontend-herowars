// src/components/MainMap/MainMap.js
import React from 'react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { navigateTo } from '../../store/slices/navigationSlice';
import ResourceBar from '../Common/ResourceBar';
import LoadingState from '../Common/LoadingState';
import './MainMap.css';

const MainMap = () => {
  const dispatch = useAppDispatch();
  
  const user = useAppSelector(state => state.app.user);
  const guild = useAppSelector(state => state.app.guild);

  if (!user) {
    return (
      <div className="main-map">
        <ResourceBar />
        <LoadingState message="Загрузка карты..." />
      </div>
    );
  }

  // Режимы игры на карте
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

  // Обработчик клика по режиму игры
  const handleModeClick = async (mode) => {
    console.log(`Переход в режим: ${mode.name}`);
    
    // Проверка достаточности энергии
    if (mode.energyCost && user.energy < mode.energyCost) {
      console.log('Недостаточно энергии');
      return;
    }

    // Для daily-reward не делаем API вызов, т.к. запросы идут внутри компонента
    if (mode.serverEndpoint && mode.id !== 'daily-reward') {
      try {
        console.log(`Вызов API: ${mode.serverEndpoint}`);
        const mockResponse = await mockApiCall(mode.serverEndpoint);
        console.log('Ответ сервера:', mockResponse);
      } catch (error) {
        console.error('Ошибка API:', error);
      }
    }

    // Переход на выбранный экран
    dispatch(navigateTo(mode.id));
  };

  // Имитация API вызова (только для режимов, где это нужно)
  const mockApiCall = (endpoint) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          endpoint: endpoint,
          data: { message: `Режим ${endpoint} загружен` }
        });
      }, 100);
    });
  };

  return (
    <div className="main-map">
      <div className="map-background"></div>
      <ResourceBar />
      
      {/* Отображение режимов игры */}
      {gameModes.map(mode => {
        const hasEnoughEnergy = !mode.energyCost || user.energy >= mode.energyCost;
        
        return (
          <div
            key={mode.id}
            className={`game-mode ${hasEnoughEnergy ? '' : 'disabled'}`}
            style={mode.position}
            onClick={() => hasEnoughEnergy && handleModeClick(mode)}
          >
            <div className="mode-icon">{mode.icon}</div>
            <div className="mode-content">
              <div className="mode-name">{mode.name}</div>
              <div className="mode-description">{mode.description}</div>
              {mode.energyCost && (
                <div className="energy-cost">
                  ⚡ {mode.energyCost}
                  {!hasEnoughEnergy && <span className="energy-warning"> (недостаточно)</span>}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Информация о гильдии */}
      {guild && (
        <div className="guild-info" style={{ top: '5%', right: '5%' }}>
          <div className="guild-name">{guild.name}</div>
          <div className="guild-rank">Ранг: #{guild.rank}</div>
          <div className="guild-members">Участников: {guild.members}</div>
        </div>
      )}

      {/* Информация о пользователе */}
      <div className="user-info" style={{ top: '5%', left: '5%' }}>
        <div className="user-name">{user.username}</div>
        <div className="user-level">Уровень: {user.level}</div>
      </div>
    </div>
  );
};

export default MainMap;
