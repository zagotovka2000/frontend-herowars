import React from 'react';
import { useAppSelector } from '../../store/hooks';
import './ResourceBar.css';

const ResourceBar = () => {
  const user = useAppSelector(state => state.app.user);

  return (
    <div className="resource-bar">
      <div className="resource-item">
        <span className="resource-icon">⚡</span>
        <span>{user.energy}/{user.maxEnergy}</span>
        <div className="energy-bar">
          <div 
            className="energy-fill"
            style={{ width: `${(user.energy / user.maxEnergy) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="resource-item">
        <span className="resource-icon">💰</span>
        <span>{user.gold}</span>
      </div>
      
      <div className="resource-item">
        <span className="resource-icon">💎</span>
        <span>{user.gems}</span>
      </div>
      
      <div className="resource-item">
        <span className="resource-icon">⚔️</span>
        <span>Мощь: {user.power}</span>
      </div>
    </div>
  );
};

export default ResourceBar;
