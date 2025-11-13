// src/hooks/useApi.js
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUser,
  fetchUserCards,
  updateUser,
  fetchCampaigns,
  fetchCampaignProgress,
  startCampaignLevel,
  completeCampaignLevel,
  completeBattle,
  fetchAvailableQuests,
  updateQuestProgressAction,
  claimQuestRewardAction,
  fetchShopItems,
  purchaseItemAction,
  getDailyRewardStatus, // thunk для получения статуса
  claimDailyReward, // thunk для получения награды
  fetchExpeditions,
  startExpeditionAction,
  completeExpeditionAction,
  fetchFreeChestStatus,
  openFreeChestAction
} from '../store/slices/apiSlice';

export const useApi = () => {
  const dispatch = useDispatch();
  const apiState = useSelector(state => state.api);
  const appState = useSelector(state => state.app);

  // User methods
  const loadUser = useCallback((telegramId) => {
    return dispatch(fetchUser(telegramId));
  }, [dispatch]);

  const loadUserCards = useCallback((userId) => {
    return dispatch(fetchUserCards(userId));
  }, [dispatch]);

  const saveUser = useCallback((userId, updates) => {
    return dispatch(updateUser({ userId, updates }));
  }, [dispatch]);

  // Campaign methods
  const loadCampaigns = useCallback((userId) => {
    return dispatch(fetchCampaigns(userId));
  }, [dispatch]);

  const loadCampaignProgress = useCallback((userId) => {
    return dispatch(fetchCampaignProgress(userId));
  }, [dispatch]);

  const startCampaignLevelAction = useCallback((levelData) => {
    return dispatch(startCampaignLevel(levelData));
  }, [dispatch]);

  const completeCampaignLevelAction = useCallback((completionData) => {
    return dispatch(completeCampaignLevel(completionData));
  }, [dispatch]);

  // Battle methods
  const finishBattle = useCallback((battleId, result) => {
    return dispatch(completeBattle({ battleId, result }));
  }, [dispatch]);

  // Quest methods
  const getAvailableQuests = useCallback((userId) => {
    return dispatch(fetchAvailableQuests(userId));
  }, [dispatch]);

  const updateQuestProgress = useCallback((questId, progressData) => {
    return dispatch(updateQuestProgressAction({ questId, progressData }));
  }, [dispatch]);

  const claimQuestReward = useCallback((questId, userId) => {
    return dispatch(claimQuestRewardAction({ questId, userId }));
  }, [dispatch]);

  // Shop methods
  const getShopItems = useCallback(() => {
    return dispatch(fetchShopItems());
  }, [dispatch]);

  const purchaseItem = useCallback((purchaseData) => {
    return dispatch(purchaseItemAction(purchaseData));
  }, [dispatch]);

  // Expedition methods
  const getExpeditions = useCallback((userId) => {
    return dispatch(fetchExpeditions(userId));
  }, [dispatch]);

  const startExpedition = useCallback((expeditionData) => {
    return dispatch(startExpeditionAction(expeditionData));
  }, [dispatch]);

  const completeExpedition = useCallback((expeditionId) => {
    return dispatch(completeExpeditionAction(expeditionId));
  }, [dispatch]);

  // Free Chest methods
  const getFreeChestStatus = useCallback((userId) => {
    return dispatch(fetchFreeChestStatus(userId));
  }, [dispatch]);

  const openFreeChest = useCallback((userId) => {
    return dispatch(openFreeChestAction(userId));
  }, [dispatch]);

  // Daily Rewards methods - ИСПРАВЛЕННЫЕ для поддержки обоих идентификаторов
  const getDailyRewardStatusApi = useCallback((userIdentifier) => {
    console.log('📞 useApi: getDailyRewardStatus для', userIdentifier);
    
    // Определяем тип идентификатора (telegramId или userId)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userIdentifier);
    
    if (isUUID) {
      // Если это UUID, используем userId
      console.log('🆔 Используем userId для запроса');
      // Здесь нужно будет изменить thunk или создать новый, который принимает userId
      // Пока используем существующий thunk, но передаем userId как telegramId
      // Это временное решение до обновления серверных роутов
      return dispatch(getDailyRewardStatus(userIdentifier)).unwrap();
    } else {
      // Если это не UUID, используем как telegramId
      console.log('📱 Используем telegramId для запроса');
      return dispatch(getDailyRewardStatus(userIdentifier)).unwrap();
    }
  }, [dispatch]);

  const claimDailyRewardApi = useCallback((userIdentifier, rewardType) => {
    console.log('📞 useApi: claimDailyReward', { userIdentifier, rewardType });
    
    // Определяем тип идентификатора
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userIdentifier);
    
    if (isUUID) {
      // Если это UUID, используем userId
      console.log('🆔 Используем userId для claim');
      // Временно передаем userId как telegramId
      return dispatch(claimDailyReward({ telegramId: userIdentifier, rewardType })).unwrap();
    } else {
      // Если это не UUID, используем как telegramId
      console.log('📱 Используем telegramId для claim');
      return dispatch(claimDailyReward({ telegramId: userIdentifier, rewardType })).unwrap();
    }
  }, [dispatch]);

  return {
    // Серверные данные
    campaigns: apiState.campaigns,
    campaignProgress: apiState.campaignProgress,
    loading: apiState.loading,
    error: apiState.error,
   
    // Клиентские данные
    user: appState.user,
    cards: appState.cards,
    apiState,

    // Methods
    loadUser,
    loadUserCards,
    saveUser,
    loadCampaigns,
    loadCampaignProgress,
    startCampaignLevel: startCampaignLevelAction,
    completeCampaignLevel: completeCampaignLevelAction,
    finishBattle,
    getAvailableQuests,
    updateQuestProgress,
    claimQuestReward,
    getShopItems,
    purchaseItem,
    getExpeditions,
    startExpedition,
    completeExpedition,
    getFreeChestStatus,
    openFreeChest,
    
    // Ежедневные награды - исправленные функции
    getDailyRewardStatus: getDailyRewardStatusApi,
    claimDailyReward: claimDailyRewardApi,
  };
};
