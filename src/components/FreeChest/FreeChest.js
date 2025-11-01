     
      // components/FreeChest/FreeChest.js
      import React from 'react';
      import BackButton from '../Common/BackButton';
      import ResourceBar from '../Common/ResourceBar';
      import './FreeChest.css';

const FreeChest = () => {
  return (
    <div className="free-chest-screen">
      <BackButton />
      <ResourceBar />
      
      <div className="free-chest-content">
        <h2>📦 Бесплатный Сундук</h2>
        <div className="chest-container">
          <div className="chest-icon">🎁</div>
          <p className="chest-timer">Доступно через: 02:15:30</p>
          <button className="open-chest-button" disabled>
            Открыть позже
          </button>
        </div>
      </div>
    </div>
  );
};

export default FreeChest;
