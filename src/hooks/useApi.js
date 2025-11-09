import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUser,
  fetchUserCards,
  updateUser,
  fetchCampaigns,
  fetchCampaignProgress,
  startCampaignLevel as startCampaignLevelAction,
  completeCampaignLevel as completeCampaignLevelAction,
  startCampaignBattle,
  completeBattle,
  fetchAvailableQuests,
  updateQuestProgressAction,
  claimQuestRewardAction,
  fetchShopItems,
  purchaseItemAction,
  fetchDailyReward,
  claimDailyRewardAction,
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

  // Переименовали из-за конфликта имен
  const startCampaignLevel = useCallback((levelData) => {
    return dispatch(startCampaignLevelAction(levelData));
  }, [dispatch]);

  const completeCampaignLevel = useCallback((completionData) => {
    return dispatch(completeCampaignLevelAction(completionData));
  }, [dispatch]);

  // Battle methods
  const startBattle = useCallback((battleData) => {
    return dispatch(startCampaignBattle(battleData));
  }, [dispatch]);

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

  // Daily Reward methods
  const getDailyReward = useCallback((userId) => {
    return dispatch(fetchDailyReward(userId));
  }, [dispatch]);

  const claimDailyReward = useCallback((userId) => {
    return dispatch(claimDailyRewardAction(userId));
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

  return {
    // Серверные данные
    campaigns: apiState.campaigns,
    campaignProgress: apiState.campaignProgress,
    loading: apiState.loading,
    error: apiState.error,
   
    // Клиентские данные
    user: appState.user,
    cards: appState.cards,
    
    // Methods
    loadUser,
    loadUserCards,
    saveUser,
    loadCampaigns,
    loadCampaignProgress,
    startCampaignLevel,
    completeCampaignLevel,
    startBattle,
    finishBattle,
    getAvailableQuests,
    updateQuestProgress,
    claimQuestReward,
    getShopItems,
    purchaseItem,
    getDailyReward,
    claimDailyReward,
    getExpeditions,
    startExpedition,
    completeExpedition,
    getFreeChestStatus,
    openFreeChest
  };
};
