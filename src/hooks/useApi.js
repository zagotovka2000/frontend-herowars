// src/hooks/useApi.js
import {useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUser,
  fetchUserCards,
  updateUser,
  startCampaignBattle,
  completeBattle,
  fetchCampaigns,
  startCampaignLevel,
  fetchCampaignProgress,
  completeCampaignLevel,
  
} from '../store/slices/apiSlice';
const API_BASE_URL = 'http://localhost:4000/api';

export const useApi = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const apiState = useSelector(state => state.api);
  const appState = useSelector(state => state.app);

  // User methods
  const loadUser = useCallback((userId) => {
    return dispatch(fetchUser(userId));
  }, [dispatch]);

  const loadUserCards = useCallback((userId) => {
    return dispatch(fetchUserCards(userId));
  }, [dispatch]);

  const saveUser = useCallback((userId, updates) => {
    return dispatch(updateUser({ userId, updates }));
  }, [dispatch]);

  // Battle methods
  const startBattle = useCallback((battleData) => {
    return dispatch(startCampaignBattle(battleData));
  }, [dispatch]);

  const finishBattle = useCallback((battleId, result) => {
    return dispatch(completeBattle({ battleId, result }));
  }, [dispatch]);

  const loadCampaigns = useCallback((userId) => {
   return dispatch(fetchCampaigns(userId));
 }, [dispatch]);

 const loadCampaignProgress = useCallback((userId) => {
   return dispatch(fetchCampaignProgress(userId));
 }, [dispatch]);

 const startCampaignLevel = useCallback((levelData) => {
   return dispatch(startCampaignLevel(levelData));
 }, [dispatch]);

 const completeCampaignLevel = useCallback((completionData) => {
   return dispatch(completeCampaignLevel(completionData));
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
    // State
    user: appState.user,
    cards: appState.cards,
    campaigns: apiState.campaigns,
    campaignProgress: apiState.campaignProgress,
    loading: apiState.loading,
    error: apiState.error,

    // Methods
    loadCampaignProgress,
    startCampaignLevel,
    completeCampaignLevel,
    loadUser,
    loadUserCards,
    saveUser,
    startBattle,
    finishBattle,
    loadCampaigns,
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
  openFreeChest,
  };
};
