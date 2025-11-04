import { useCallback } from 'react';
import { useApi } from './useApi';
import { useAppDispatch, useAppSelector } from '../store/hooks'; 
export const useGameEvents = () => {
  const { user } = useAppSelector(state => state.app);
  const { updateQuestProgress } = useApi();

  // Обработчик завершения битвы
  const handleBattleComplete = useCallback(async (isVictory, battleType = 'pvp') => {
    if (!user) return;

    try {
      // Обновляем квест "Выиграть битвы"
      if (isVictory) {
        await updateQuestProgress('win_battles', {
          userId: user.id,
          progress: 1
        });
      }

      // Обновляем квест "Участвовать в битвах"
      await updateQuestProgress('participate_battles', {
        userId: user.id,
        progress: 1
      });

      // Синхронизируем данные
      await syncService.syncUserData(user.id);
    } catch (error) {
      console.error('Ошибка обработки события битвы:', error);
    }
  }, [user, updateQuestProgress]);

  // Обработчик получения награды
  const handleRewardClaim = useCallback(async (rewardType, amount) => {
    if (!user) return;

    try {
      // Обновляем квест "Собрать награды"
      await updateQuestProgress('collect_rewards', {
        userId: user.id,
        progress: amount
      });

      await syncService.syncUserData(user.id);
    } catch (error) {
      console.error('Ошибка обработки награды:', error);
    }
  }, [user, updateQuestProgress]);

  // Обработчик улучшения карты
  const handleCardUpgrade = useCallback(async (cardId) => {
    if (!user) return;

    try {
      await updateQuestProgress('upgrade_cards', {
        userId: user.id,
        progress: 1
      });

      await syncService.syncUserData(user.id);
    } catch (error) {
      console.error('Ошибка обработки улучшения карты:', error);
    }
  }, [user, updateQuestProgress]);

  return {
    handleBattleComplete,
    handleRewardClaim,
    handleCardUpgrade
  };
};
