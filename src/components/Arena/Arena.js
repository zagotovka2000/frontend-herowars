// components/Arena/Arena.js
import React, { useEffect, useState } from 'react';
import { mockApi } from '../../utils/mockApi';
import BackButton from '../Common/BackButton';
import ResourceBar from '../Common/ResourceBar';


const Arena = () => {
  const [battleData, setBattleData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startBattle = async () => {
      try {
        setLoading(true);
        const result = await mockApi.battle();
        setBattleData(result);
      } catch (error) {
        console.error('Battle error:', error);
      } finally {
        setLoading(false);
      }
    };

    startBattle();
  }, []);

  if (loading) {
    return (
      <div className="arena-loading">
        <BackButton />
        <ResourceBar />
        <div className="loading-spinner">⚔️</div>
        <p>Поиск противника...</p>
      </div>
    );
  }

  return (
    <div className="arena-screen">
      <BackButton />
      <ResourceBar />
      
      <div className="arena-content">
        <h2>⚔️ ПвП Арена</h2>
        
        {battleData && (
          <div className="battle-info">
            <div className="battle-id">Битва: {battleData.battleId}</div>
            <div className="battle-result">
              Результат: {battleData.result === 'victory' ? '🎉 Победа!' : '💔 Поражение'}
            </div>
            <div className="battle-rewards">
              Награды: 💰 {battleData.rewards.gold} золота, 📚 {battleData.rewards.exp} опыта
            </div>
          </div>
        )}
        
        {/* Здесь будет ваш компонент битвы 5x5 */}
        <div className="battle-interface">
          <p>Интерфейс битвы 5x5...</p>
        </div>
      </div>
    </div>
  );
};

export default Arena;
