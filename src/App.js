// App.js
import React, { useState } from 'react';
import MainMap from './components/MainMap/MainMap';
import Campaign from './components/Campaign/Campaign';
import Arena from './components/Arena/Arena';
import Collection from './components/Collection/Collection';
import Shop from './components/Shop/Shop';
import Quests from './components/Quests/Quests';
import GuildWar from './components/GuildWar/GuildWar';
import DailyReward from './components/DailyReward/DailyReward';
import FreeChest from './components/FreeChest/FreeChest';
import Expedition from './components/Expedition/Expedition';
import { AppProvider, useApp } from './contex/AppContext';
import { NavigationProvider, useNavigation } from './contex/NavigationContext.js';

import './App.css';

// Компонент-обертка для использования навигации
function AppContent() {
  const { currentScreen } = useNavigation();
  
  const renderScreen = () => {
    switch (currentScreen) {
      case 'campaign': return <Campaign />;
      case 'arena': return <Arena />;
      case 'collection': return <Collection />;
      case 'shop': return <Shop />;
      case 'quests': return <Quests />;
      case 'guild-war': return <GuildWar />;
      case 'daily-reward': return <DailyReward />;
      case 'expedition': return <Expedition />;
      case 'free-chest': return <FreeChest />;
      default: return <MainMap />;
    }
  };

  return (
    <div className="app">
      <main className="app-main">
        {renderScreen()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <NavigationProvider>
        <AppContent />
      </NavigationProvider>
    </AppProvider>
  );
}

export default App;
