// hooks/useBattle.js - УПРОЩЕННАЯ ВЕРСИЯ
import { useAppDispatch } from '../store/hooks';
import { startCampaignBattle as startCampaignBattleApi } from '../store/slices/apiSlice';
import { initGame } from '../store/slices/gameSlice';

export const useBattle = () => {
  const dispatch = useAppDispatch();

  const startCampaignBattle = async (userId, levelId, userEnergy) => {
    try {
      console.log('⚡ УПРОЩЕННАЯ: Начинаем битву', { userId, levelId, userEnergy });
      
      const battleData = {
        userId,
        levelId, 
        userEnergy
      };

      // Вызываем API напрямую
      const response = await fetch('http://localhost:4000/api/campaigns/level/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(battleData)
      });

      if (!response.ok) {
        throw new Error('Ошибка сервера');
      }

      const result = await response.json();
      console.log('✅ Битва начата через прямой запрос:', result);
      
      // Инициализируем игру
      dispatch(initGame());
      
      return result;
    } catch (error) {
      console.error('❌ Ошибка начала битвы:', error);
      throw error;
    }
  };

  return {
    startCampaignBattle
  };
};
