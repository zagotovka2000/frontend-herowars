// src/components/Common/ResourceBar.js
import React from 'react';
import { useAppSelector } from '../../store/hooks';
import './ResourceBar.css';

const ResourceBar = () => {
  // Получаем данные пользователя из Redux store
  const user = useAppSelector(state => state.app.user);

  // ✅ ИСПРАВЛЕНО: защита от отсутствия пользователя
  if (!user) {
    return (
      <div className="resource-bar">
        <div className="resource-item">Загрузка...</div>
      </div>
    );
  }

  // Вычисляем процент заполнения энергии
  const energyPercentage = user.maxEnergy > 0 
    ? (user.energy / user.maxEnergy) * 100 
    : 0;

  return (
    <div className="resource-bar">
      {/* Энергия с прогресс-баром */}
      <div className="resource-item energy-item">
        <span className="resource-icon">⚡</span>
        <span className="resource-value">{user.energy}/{user.maxEnergy}</span>
        <div className="energy-bar">
          <div 
            className="energy-fill"
            style={{ width: `${energyPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Золото */}
      <div className="resource-item">
        <span className="resource-icon">💰</span>
        <span className="resource-value">{user.gold || 0}</span>
      </div>
      
      {/* Самоцветы */}
      <div className="resource-item">
        <span className="resource-icon">💎</span>
        <span className="resource-value">{user.gems || 0}</span>
      </div>
      
      {/* Мощь (если есть) */}
      {(user.power || user.power === 0) && (
        <div className="resource-item">
          <span className="resource-icon">⚔️</span>
          <span className="resource-value">Мощь: {user.power}</span>
        </div>
      )}
    </div>
  );
};

export default ResourceBar;
