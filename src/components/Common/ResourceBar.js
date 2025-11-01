// components/Common/ResourceBar.js
import React from 'react';
import { useApp } from '../../contex/AppContext';
import './ResourceBar.css';


const ResourceBar = () => {
  const { state } = useApp();

  return (
    <div className="resource-bar">
      <div className="resource-item">
        <span className="resource-icon">⚡</span>
        <span>{state.user.energy}/{state.user.maxEnergy}</span>
        <div className="energy-bar">
          <div 
            className="energy-fill"
            style={{ width: `${(state.user.energy / state.user.maxEnergy) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="resource-item">
        <span className="resource-icon">💰</span>
        <span>{state.user.gold}</span>
      </div>
      
      <div className="resource-item">
        <span className="resource-icon">💎</span>
        <span>{state.user.gems}</span>
      </div>
      
      <div className="resource-item">
        <span className="resource-icon">⚔️</span>
        <span>Мощь: {state.user.power}</span>
      </div>
    </div>
  );
};

export default ResourceBar;
