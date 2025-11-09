// src/hooks/useBattleAPI.js
import { useCallback } from 'react';
import { useAppDispatch } from '../store/hooks';
import { useApi } from './useApi';
import { setServerBattleId, setBattleResult, showBattleResultModal } from '../store/slices/gameSlice';

export const useBattleAPI = () => {
  const dispatch = useAppDispatch();
  const { startCampaignLevel, completeCampaignLevel } = useApi();

  const startCampaignBattle = useCallback(async (campaignLevelId) => {
    try {
      const userId = '1'; // В реальном приложении из auth
      const result = await startCampaignLevel({ userId, campaignLevelId });
      dispatch(setServerBattleId(result.campaignLevel?.id));
      return result;
    } catch (error) {
      console.error('Ошибка начала битвы кампании:', error);
      throw error;
    }
  }, [dispatch, startCampaignLevel]);

  const completeCampaignBattle = useCallback(async (campaignLevelId, isVictory) => {
    try {
      const userId = '1';
      
      if (isVictory) {
        const result = await completeCampaignLevel({ 
          levelId: campaignLevelId, 
          userId, 
          stars: 3, 
          score: 1000 
        });
        
        dispatch(setBattleResult('victory'));
        dispatch(showBattleResultModal(true));
        return result;
      } else {
        dispatch(setBattleResult('defeat'));
        dispatch(showBattleResultModal(true));
      }
    } catch (error) {
      console.error('Ошибка завершения битвы:', error);
      throw error;
    }
  }, [dispatch, completeCampaignLevel]);

  return {
    startCampaignBattle,
    completeCampaignBattle
  };
};
