// src/AppContent.js
import React from 'react';
import { useAppSelector } from './store/hooks';
import { selectCurrentScreen } from './store/slices/navigationSlice';
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

function AppContent() {
  const currentScreen = useAppSelector(selectCurrentScreen);
  
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

export default AppContent;
