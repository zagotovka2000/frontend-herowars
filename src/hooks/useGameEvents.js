import { useCallback } from 'react';
import { useApi } from './useApi';

export const useGameEvents = () => {
   const { user, updateQuestProgress } = useApi();


  // Обработчик завершения битвы - обновляет прогресс квестов
  const handleBattleComplete = useCallback(async (isVictory, battleType = 'pvp') => {
   if (!user?.id) return;

   try {
      // Обновляем квест "Выиграть битвы"
      if (isVictory) {
        // ❌ ПРОБЛЕМА: 'win_battles' - должен быть реальный questId из API
        await updateQuestProgress('win_battles', {
          userId: user.id,
          progress: 1
        });
      }

      // Обновляем квест "Участвовать в битвах"      // ❌ ПРОБЛЕМА: 'participate_battles' - должен быть реальный questId из API
      await updateQuestProgress('participate_battles', {
        userId: user.id,
        progress: 1
      });

      // Синхронизируем данные
      //await syncService.syncUserData(user.id); нужно дописать
   
    } catch (error) {
      console.error('Ошибка обработки события битвы:', error);
    }
  }, [user, updateQuestProgress]);

  // Обработчик получения награды
  const handleRewardClaim = useCallback(async (rewardType, amount) => {
   if (!user?.id) return;

    try {
      // Обновляем квест "Собрать награды"
            // ❌ ПРОБЛЕМА: 'collect_rewards' - должен быть реальный questId из API

      await updateQuestProgress('collect_rewards', {
        userId: user.id,
        progress: amount
      });

    //  await syncService.syncUserData(user.id);
    } catch (error) {
      console.error('Ошибка обработки награды:', error);
    }
  }, [user, updateQuestProgress]);

  // Обработчик улучшения карты
  const handleCardUpgrade = useCallback(async (cardId) => {
    if (!user) return;

    try {
            // ❌ ПРОБЛЕМА: 'upgrade_cards' - должен быть реальный questId из API

      await updateQuestProgress('upgrade_cards', {
        userId: user.id,
        progress: 1
      });

     // await syncService.syncUserData(user.id);
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
