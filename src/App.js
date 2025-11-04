// src/App.js
import React, { useEffect } from 'react';
import AppContent from './AppContent';
import { useApi } from './hooks/useApi';

function AppInitializer() {
  const { loadUser, loadCampaigns, user } = useApi();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const userId = '1';
        await loadUser(userId);
        await loadCampaigns();
      } catch (error) {
        console.error('Failed to initialize app:', error);
      }
    };

    initializeApp();
  }, [loadUser, loadCampaigns]);

  if (!user) {
    return (
      <div className="app-loading">
        <div className="loading-spinner">⚔️</div>
        <p>Загрузка HeroWars...</p>
      </div>
    );
  }

  return <AppContent />;
}

// ✅ УБРАЛИ Provider - он уже в index.js
function App() {
  return <AppInitializer />;
}

export default App;
