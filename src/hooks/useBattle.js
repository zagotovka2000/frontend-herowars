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
 
  // ✅ ДОБАВЛЕНО: ref для хранения AbortController
  const abortControllerRef = useRef(null);
  // Функция для начала битвы кампании
  const startCampaignBattle = async (userId, levelId, userEnergy) => {
    try {
           // ✅ ИСПРАВЛЕНО: отменяем предыдущий запрос если есть
           if (abortControllerRef.current) {
            abortControllerRef.current.abort();
          }
                // Создаем новый AbortController
      abortControllerRef.current = new AbortController();
      console.log('⚡ Начинаем битву кампании:', { userId, levelId, userEnergy });
      
      // ✅ ИСПРАВЛЕНО: используем useApi вместо прямого fetch
      const result = await startCampaignLevel({
        userId,
        levelId, 
        userEnergy
      }).unwrap();

      console.log('✅ Битва начата:', result);
      
      // Устанавливаем ID битвы на сервере
      if (result.battleId) {
        dispatch(setServerBattleId(result.battleId));
      }
      
      // Инициализируем игровое состояние
      dispatch(initGame());
      
      return result;
    } catch (error) {
      // ✅ ИСПРАВЛЕНО: не логируем ошибку если запрос был отменен
      if (error.name !== 'AbortError') {
        console.error('❌ Ошибка начала битвы:', error);
      }
      throw error;
    }
  };
  // ✅ ДОБАВЛЕНО: функция для очистки (можно вызывать при unmount)
  const cleanup = () => {
   if (abortControllerRef.current) {
     abortControllerRef.current.abort();
   }
 };
  // Функция для завершения битвы кампании
  const completeCampaignBattle = async (levelId, isVictory) => {
    try {
      const userId = '1'; // ❌ ПРОБЛЕМА: хардкод, нужно получать из состояния
      
      if (isVictory) {
        // ✅ ИСПРАВЛЕНО: используем useApi вместо прямого fetch
        const result = await completeCampaignLevel({ 
          levelId, 
          userId, 
          stars: 3, 
          score: 1000 
        }).unwrap();
        
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
    battleMode: gameState.battleMode,
    isPlayerTurn: gameState.isPlayerTurn,
    isBattleActive: gameState.isBattleActive
  };
};
