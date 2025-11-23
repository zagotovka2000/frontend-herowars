// src/hooks/useBattle.js
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { 
  initGame,
  attack, 
  enemyAttack, 
  setBattleMode, 
  resetSelection, 
  showBattleResultModal,
  hideBattleResultModal,
  setServerBattleId,
  setBattleResult
} from '../store/slices/gameSlice';
import { useApi } from './useApi';
import { useRef } from 'react';

export const useBattle = () => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector(state => state.game);
  const { startCampaignLevel, completeCampaignLevel } = useApi();
  const user = useAppSelector(state => state.app.user);
 
  // ✅ ref для хранения AbortController
  const abortControllerRef = useRef(null);

  // Функция для начала битвы кампании
  const startCampaignBattle = async (userId, levelId) => {
    try {
      console.log('⚡ Начинаем битву кампании:', { userId, levelId });
    
    // ✅ ДОБАВЛЕНО: Логируем данные перед отправкой
    const requestData = {
      userId: userId,
      levelId: levelId
    };
    
    console.log('📤 Отправляемые данные:', requestData);
    
    const result = await startCampaignLevel(requestData).unwrap();

    console.log('✅ Битва начата:', result);
    
    if (result.battleId) {
      dispatch(setServerBattleId(result.battleId));
    }
    
    dispatch(initGame());
    
      // ✅ Отменяем предыдущий запрос если есть
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Создаем новый AbortController
      abortControllerRef.current = new AbortController();
      console.log('⚡ Начинаем битву кампании:', { userId, levelId });
     
      
      // Устанавливаем ID битвы на сервере
      if (result.battleId) {
        dispatch(setServerBattleId(result.battleId));
      }
      
      // Инициализируем игровое состояние
      dispatch(initGame());
      
      return result;
    } catch (error) {
      // ✅ Не логируем ошибку если запрос был отменен
      if (error.name !== 'AbortError') {
        console.error('❌ Ошибка начала битвы:', error);
      }
      throw error;
    }
  };

  // ✅ Функция для очистки (можно вызывать при unmount)
  const cleanup = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Функция для завершения битвы кампании с получением наград
  const completeCampaignBattle = async (levelId, isVictory) => {
   console.log('⚔️ useBattle: completeCampaignBattle вызван', { levelId, isVictory });

    try {
      const userId = user?.id;
      
      if (!userId) {
        throw new Error('User ID not found');
      }

      if (isVictory) {
        // ✅ Используем useApi вместо прямого fetch
        const result = await completeCampaignLevel({ 
         levelId, 
         userId, 
         stars: 3, 
         score: 1000 
       }).unwrap();
       
       console.log('📦 Полный ответ сервера:', result);
       
       const rewards = {
         gold: result.rewards?.gold || result.gold || 0,
         experience: result.rewards?.experience || result.exp || 0,
         items: result.rewards?.items || result.items || []
       };
       
       console.log('🎁 Сформированные награды для отображения:', rewards);
       
       dispatch(setBattleResult('victory'));
       dispatch(showBattleResultModal(true));
        
        // Возвращаем результат с наградами
        return {
          ...result,
          rewards
        };
      } else {
        dispatch(setBattleResult('defeat'));
        dispatch(showBattleResultModal(true));
        return { success: false };
      }
    } catch (error) {
      console.error('Ошибка завершения битвы:', error);
      throw error;
    }
  };

  // Функция для ручной атаки
  const performAttack = (playerCard, enemyCard, isSuperAttack = false) => {
    if (!gameState.isPlayerTurn || !gameState.isBattleActive) return;
    
    console.log(`🎯 Ручная атака: игрок ${playerCard.id} → враг ${enemyCard.id}`);
    
    dispatch(attack({
      playerCardId: playerCard.id,
      enemyCardId: enemyCard.id,
      isSuperAttack
    }));
  };

  // Функция для автоматической атаки
  const autoPlayerAttack = () => {
    if (!gameState.isPlayerTurn || !gameState.isBattleActive) return;
    
    console.log('🤖 Авто-атака');
    
    const alivePlayerCards = gameState.playerCards.filter(card => card.health > 0);
    const aliveEnemyCards = gameState.enemyCards.filter(card => card.health > 0);
    
    if (alivePlayerCards.length === 0 || aliveEnemyCards.length === 0) return;
    
    const playerCard = alivePlayerCards[0];
    const enemyCard = aliveEnemyCards[0];
    
    dispatch(attack({
      playerCardId: playerCard.id,
      enemyCardId: enemyCard.id,
      isSuperAttack: false
    }));
  };

  // Переключение режима боя
  const toggleBattleMode = () => {
    const newMode = gameState.battleMode === 'manual' ? 'auto' : 'manual';
    dispatch(setBattleMode(newMode));
    console.log(`🎮 Режим изменен на: ${newMode}`);
  };

  // Закрытие модального окна результатов
  const closeBattleResultModal = () => {
    dispatch(hideBattleResultModal());
  };

  return {
    startCampaignBattle,
    completeCampaignBattle,
    performAttack,
    autoPlayerAttack,
    toggleBattleMode,
    closeBattleResultModal,
    cleanup,
    battleMode: gameState.battleMode,
    isPlayerTurn: gameState.isPlayerTurn,
    isBattleActive: gameState.isBattleActive
  };
};
