// components/Common/Navigation.js
import React from 'react';


const Navigation = ({ currentScreen, onScreenChange }) => {
  const navItems = [
    { id: 'main-map', icon: '🗺️', label: 'Карта' },
    { id: 'campaign', icon: '⚔️', label: 'Кампания' },
    { id: 'arena', icon: '🏟️', label: 'Арена' },
    { id: 'collection', icon: '🃏', label: 'Коллекция' },
    { id: 'shop', icon: '🏪', label: 'Магазин' }
  ];

  return (
    <nav className="bottom-navigation">
      {navItems.map(item => (
        <button
          key={item.id}
          className={`nav-item ${currentScreen === item.id ? 'active' : ''}`}
          onClick={() => onScreenChange(item.id)}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
