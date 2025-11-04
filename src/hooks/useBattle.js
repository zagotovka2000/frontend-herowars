// src/hooks/useBattle.js
import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useApi } from './useApi';
import {
  updateCardHealth,
  removeCard,
  setAnimation,
  clearAnimation,
  setTurn,
  resetSelection,
  showBattleResultModal,
  hideBattleResultModal,
  updateSuperAttack,
  useSuperAttack,
  setServerBattleId,
  addTurn,
  setBattleResult
} from '../store/slices/gameSlice';

// ✅ Выносим вспомогательные функции вне компонента
const calculateDamage = (attackerValue, isSuperAttack = false) => {
  const baseDamage = Math.max(1, attackerValue - Math.floor(Math.random() * 3));
  return isSuperAttack ? Math.floor(baseDamage * 1.8) : baseDamage;
};

const calculateSuperAttackGain = (damage, isAttacking = true) => {
  const baseGain = isAttacking ? damage * 4 : damage * 3;
  const randomBonus = Math.random() * (isAttacking ? 20 : 15);
  const criticalBonus = damage > 5 ? 15 : 0;
  return Math.min(30, baseGain + randomBonus + criticalBonus);
};

export const useBattle = () => {
  const dispatch = useAppDispatch();
  const gameState = useAppSelector(state => state.game);
  const { user } = useAppSelector(state => state.api);
  const { startCampaignLevel, completeCampaignLevel } = useApi();

  const stateRef = useRef();
  stateRef.current = gameState;

  const battleEndedRef = useRef(false);
  const autoAttackIntervalRef = useRef(null);

  // ✅ Создаем ref для функции performAttack
  const performAttackRef = useRef();
  const checkBattleEndByCardsRef = useRef();

  // ✅ Функция для остановки авто-атаки
  const stopAutoAttack = useCallback(() => {
    if (autoAttackIntervalRef.current) {
      clearInterval(autoAttackIntervalRef.current);
      autoAttackIntervalRef.current = null;
      console.log('🛑 Авто-атака остановлена');
    }
  }, []);

  // ✅ Функция проверки завершения боя
  const checkBattleEndByCards = useCallback(async () => {
    const currentState = stateRef.current;
    
    if (battleEndedRef.current || currentState.showBattleResultModal) {
      return true;
    }
    
    const alivePlayerCards = currentState.playerCards.filter(card => card.health > 0);
    const aliveEnemyCards = currentState.enemyCards.filter(card => card.health > 0);
    
    let result = null;
    
    if (alivePlayerCards.length === 0) {
      console.log('Бой завершен: поражение');
      result = 'defeat';
    } else if (aliveEnemyCards.length === 0) {
      console.log('Бой завершен: победа');
      result = 'victory';
    }

    if (result) {
      battleEndedRef.current = true;
      stopAutoAttack();
      
      if (currentState.serverBattleId) {
        console.log('🎮 Завершение битвы:', { 
          battleId: currentState.serverBattleId, 
          result,
          turns: currentState.turns.length 
        });
      }
      
      dispatch(showBattleResultModal(result));
      return true;
    }
    
    return false;
  }, [dispatch, stopAutoAttack]);

  // ✅ Сохраняем функцию в ref
  useEffect(() => {
    checkBattleEndByCardsRef.current = checkBattleEndByCards;
  }, [checkBattleEndByCards]);

  // ✅ Функция для записи хода
  const recordBattleTurn = useCallback((attacker, defender, damage, isSuperAttack = false) => {
    dispatch(addTurn({
      attackerId: attacker.id,
      defenderId: defender.id,
      damage: damage,
      isSuperAttack: isSuperAttack,
      timestamp: new Date().toISOString(),
      turnNumber: gameState.turns.length + 1
    }));
  }, [dispatch, gameState.turns.length]);

  // ✅ ОСНОВНАЯ ФУНКЦИЯ АТАКИ
  const performAttack = useCallback(async (attackerCard, defenderCard, isSuperAttack = false) => {
    if (!attackerCard || !defenderCard || battleEndedRef.current) return;

    const damage = calculateDamage(attackerCard.value, isSuperAttack);
    
    console.log(`⚔️ Атака: ${attackerCard.value} → ${defenderCard.health}hp (урон: ${damage})`);
    
    // Анимация атаки
    dispatch(setAnimation({
      attackingCardId: attackerCard.id,
      defendingCardId: defenderCard.id
    }));

    // Записываем ход
    recordBattleTurn(attackerCard, defenderCard, damage, isSuperAttack);

    // Если это супер атака, отмечаем использование
    if (isSuperAttack) {
      dispatch(useSuperAttack({
        cardId: attackerCard.id,
        isPlayerCard: attackerCard.isPlayer
      }));
    }

    // Обновляем здоровье защитника
    const newHealth = defenderCard.health - damage;
    dispatch(updateCardHealth({
      cardId: defenderCard.id,
      newHealth: newHealth,
      isPlayerCard: !attackerCard.isPlayer
    }));

    // Начисляем супер атаку атакующему
    const superAttackGain = calculateSuperAttackGain(damage, true);
    const newSuperAttack = Math.min(100, attackerCard.superAttack + superAttackGain);
    dispatch(updateSuperAttack({
      cardId: attackerCard.id,
      newSuperAttack: newSuperAttack,
      isPlayerCard: attackerCard.isPlayer
    }));

    // Небольшая задержка для анимации
    await new Promise(resolve => setTimeout(resolve, 800));

    // Проверяем, умерла ли карта
    if (newHealth <= 0) {
      console.log(`💀 Карта ${defenderCard.id} уничтожена`);
      dispatch(removeCard({
        cardId: defenderCard.id,
        isPlayerCard: !attackerCard.isPlayer
      }));
    }

    // Очищаем анимацию
    dispatch(clearAnimation());

    // Проверяем конец битвы
    const battleEnded = await checkBattleEndByCardsRef.current();
    
    if (!battleEnded) {
      // Передаем ход противнику
      dispatch(setTurn(!attackerCard.isPlayer));
      
      if (!attackerCard.isPlayer) {
        setTimeout(() => {
          dispatch(resetSelection());
        }, 1000);
      }
    }

    return damage;
  }, [dispatch, recordBattleTurn]);

  // ✅ Сохраняем performAttack в ref
  useEffect(() => {
    performAttackRef.current = performAttack;
  }, [performAttack]);

  // ✅ Функция для запуска непрерывной авто-атаки
  const startAutoAttack = useCallback(() => {
    stopAutoAttack();
    
    console.log('🚀 Запуск непрерывной авто-атаки');
    
    autoAttackIntervalRef.current = setInterval(() => {
      const currentState = stateRef.current;
      
      if (currentState.isPlayerTurn && 
          currentState.battleMode === 'auto' && 
          currentState.isBattleActive && 
          !battleEndedRef.current) {
        
        const alivePlayerCards = currentState.playerCards.filter(card => card.health > 0);
        const aliveEnemyCards = currentState.enemyCards.filter(card => card.health > 0);
        
        if (alivePlayerCards.length > 0 && aliveEnemyCards.length > 0) {
          const playerCard = alivePlayerCards[0];
          const enemyCard = aliveEnemyCards[0];
          const useSuper = playerCard.superAttack >= 100 && !playerCard.hasUsedSuperAttack;

          console.log(`🤖 Авто-атака: карта ${playerCard.id} → карта ${enemyCard.id}`);
          performAttackRef.current(playerCard, enemyCard, useSuper);
        } else {
          stopAutoAttack();
        }
      } else {
        stopAutoAttack();
      }
    }, 1500);
  }, [stopAutoAttack]);

  // ✅ Одиночная авто-атака
  const autoPlayerAttack = useCallback(async () => {
    const currentState = stateRef.current;
    const alivePlayerCards = currentState.playerCards.filter(card => card.health > 0);
    const aliveEnemyCards = currentState.enemyCards.filter(card => card.health > 0);

    if (alivePlayerCards.length === 0 || aliveEnemyCards.length === 0) return;

    const playerCard = alivePlayerCards[0];
    const enemyCard = aliveEnemyCards[0];
    const useSuper = playerCard.superAttack >= 100 && !playerCard.hasUsedSuperAttack;

    console.log(`🤖 Авто-атака: карта ${playerCard.id} атакует карту ${enemyCard.id}`);
    await performAttack(playerCard, enemyCard, useSuper);
  }, [performAttack]);

  // ✅ Ход врага
  const enemyTurn = useCallback(async () => {
    const currentState = stateRef.current;
    const alivePlayerCards = currentState.playerCards.filter(card => card.health > 0);
    const aliveEnemyCards = currentState.enemyCards.filter(card => card.health > 0);

    if (alivePlayerCards.length === 0 || aliveEnemyCards.length === 0) return;

    const randomEnemyCard = aliveEnemyCards[Math.floor(Math.random() * aliveEnemyCards.length)];
    const randomPlayerCard = alivePlayerCards[Math.floor(Math.random() * alivePlayerCards.length)];
    const useSuper = randomEnemyCard.superAttack >= 100 && !randomEnemyCard.hasUsedSuperAttack;

    console.log(`🤖 Ход врага: карта ${randomEnemyCard.id} атакует карту ${randomPlayerCard.id}`);
    await performAttack(randomEnemyCard, randomPlayerCard, useSuper);
  }, [performAttack]);

  // ✅ Остальные функции
  const closeBattleResultModal = useCallback(() => {
    battleEndedRef.current = false;
    stopAutoAttack();
    dispatch(hideBattleResultModal());
  }, [dispatch, stopAutoAttack]);

  const resetBattleState = useCallback(() => {
    battleEndedRef.current = false;
    stopAutoAttack();
  }, [stopAutoAttack]);

  // ✅ НАЧАТЬ БИТВУ КАМПАНИИ (ИНТЕГРАЦИЯ С СЕРВЕРОМ)
  const startCampaignBattle = useCallback(async (campaignLevelId) => {
    try {
      const userId = user?.id || '1';
      const result = await startCampaignLevel({ userId, campaignLevelId });
      
      console.log('🎮 Начата битва кампании:', result);
      
      // Устанавливаем ID битвы на сервере
      dispatch(setServerBattleId(result.campaignLevel?.id || `campaign-${campaignLevelId}`));
      
      return result;
    } catch (error) {
      console.error('Ошибка начала битвы кампании:', error);
      throw error;
    }
  }, [user, startCampaignLevel, dispatch]);

  // ✅ ЗАВЕРШИТЬ БИТВУ КАМПАНИИ (ИНТЕГРАЦИЯ С СЕРВЕРОМ)
  const completeCampaignBattle = useCallback(async (campaignLevelId, isVictory, stars = 3, score = 1000) => {
    try {
      const userId = user?.id || '1';
      
      if (isVictory) {
        const result = await completeCampaignLevel({ 
          levelId: campaignLevelId, 
          userId, 
          stars, 
          score 
        });
        console.log('🎮 Завершена битва кампании:', result);
        
        // Показываем результат победы
        dispatch(setBattleResult('victory'));
        dispatch(showBattleResultModal(true));
        
        return result;
      } else {
        // Обработка поражения
        dispatch(setBattleResult('defeat'));
        dispatch(showBattleResultModal(true));
      }
    } catch (error) {
      console.error('Ошибка завершения битвы кампании:', error);
      throw error;
    }
  }, [user, completeCampaignLevel, dispatch]);

  // ✅ ИНИЦИАЛИЗАЦИЯ СЕРВЕРНОЙ БИТВЫ (ДЛЯ ДРУГИХ ТИПОВ БИТВ)
  const initializeServerBattle = useCallback(async (battleType, opponentData = null) => {
    try {
      const battleData = {
        userId: user?.id || '1',
        type: battleType,
        playerDeck: gameState.playerCards,
        ...opponentData
      };

      console.log('🎮 Инициализация битвы:', battleType);
      
      // В зависимости от типа битвы вызываем соответствующий метод
      if (battleType === 'campaign' && opponentData?.campaignLevelId) {
        return await startCampaignBattle(opponentData.campaignLevelId);
      }
      
      // Для других типов битв можно добавить аналогичные вызовы
      return {
        id: `mock-${battleType}-` + Date.now(),
        ...battleData,
        status: 'active'
      };

    } catch (error) {
      console.error('Ошибка инициализации битвы на сервере:', error);
      throw error;
    }
  }, [user, gameState.playerCards, startCampaignBattle]);

  // ✅ Автоматическое управление авто-атакой
  useEffect(() => {
    const currentState = stateRef.current;
    
    if (currentState.battleMode === 'auto' && 
        currentState.isPlayerTurn && 
        currentState.isBattleActive && 
        !battleEndedRef.current) {
      startAutoAttack();
    } else {
      stopAutoAttack();
    }
    
    return () => {
      stopAutoAttack();
    };
  }, [gameState.battleMode, gameState.isPlayerTurn, gameState.isBattleActive, startAutoAttack, stopAutoAttack]);

  // ✅ Останавливаем авто-атаку при завершении битвы
  useEffect(() => {
    if (gameState.showBattleResultModal) {
      stopAutoAttack();
      battleEndedRef.current = true;
    }
  }, [gameState.showBattleResultModal, stopAutoAttack]);

  // ✅ Автоматический ход врага
  useEffect(() => {
    if (!gameState.isPlayerTurn && gameState.isBattleActive && !battleEndedRef.current) {
      const timer = setTimeout(() => {
        enemyTurn();
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [gameState.isPlayerTurn, gameState.isBattleActive, enemyTurn]);

  return {
    // Основные функции битвы
    performAttack,
    enemyTurn,
    autoPlayerAttack,
    startAutoAttack,
    stopAutoAttack,
    
    // Управление состоянием битвы
    closeBattleResultModal,
    resetBattleState,
    
    // Серверные функции
    startCampaignBattle,
    completeCampaignBattle,
    initializeServerBattle
  };
};
