// src/store/slices/apiSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

// Mock данные
const mockUser = {
  id: '1',
  username: 'Игрок',
  level: 5,
  experience: 1250,
  energy: 85,
  gold: 2500,
  gems: 150,
  avatar: '⚔️'
};

// User thunks
export const fetchUser = createAsyncThunk(
  'api/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      // ✅ В режиме разработки возвращаем моковые данные
      if (process.env.NODE_ENV === 'development') {
        console.log('📦 Используем моковые данные пользователя');
        return new Promise((resolve) => {
          setTimeout(() => resolve(mockUser), 500);
        });
      }
      
      // ✅ В продакшене - реальный API вызов
      const response = await fetch(`${API_BASE_URL}/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'api/updateUser',
  async ({ userId, updates }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!response.ok) throw new Error('Failed to update user');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserCards = createAsyncThunk(
  'api/fetchUserCards',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/cards`);
      if (!response.ok) throw new Error('Failed to fetch user cards');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Campaign thunks
export const fetchCampaigns = createAsyncThunk(
  'api/fetchCampaigns',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch campaigns');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCampaignProgress = createAsyncThunk(
  'api/fetchCampaignProgress',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/${userId}/progress`);
      if (!response.ok) throw new Error('Failed to fetch campaign progress');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const startCampaignLevel = createAsyncThunk(
  'api/startCampaignLevel',
  async (levelData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/level/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(levelData)
      });
      if (!response.ok) throw new Error('Failed to start campaign level');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeCampaignLevel = createAsyncThunk(
  'api/completeCampaignLevel',
  async (completionData, { rejectWithValue }) => {
    try {
      const { levelId, ...data } = completionData;
      const response = await fetch(`${API_BASE_URL}/campaigns/level/${levelId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to complete campaign level');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Battle thunks
export const startCampaignBattle = createAsyncThunk(
  'api/startCampaignBattle',
  async (battleData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/battles/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(battleData)
      });
      if (!response.ok) throw new Error('Failed to start battle');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeBattle = createAsyncThunk(
  'api/completeBattle',
  async ({ battleId, result }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/battles/${battleId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ result })
      });
      if (!response.ok) throw new Error('Failed to complete battle');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Quest thunks
export const fetchAvailableQuests = createAsyncThunk(
  'api/fetchAvailableQuests',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quests?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch quests');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuestProgressAction = createAsyncThunk(
  'api/updateQuestProgress',
  async ({ questId, progressData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quests/${questId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressData)
      });
      if (!response.ok) throw new Error('Failed to update quest progress');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const claimQuestRewardAction = createAsyncThunk(
  'api/claimQuestReward',
  async ({ questId, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/quests/${questId}/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!response.ok) throw new Error('Failed to claim quest reward');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Shop thunks
export const fetchShopItems = createAsyncThunk(
  'api/fetchShopItems',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shop/items`);
      if (!response.ok) throw new Error('Failed to fetch shop items');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const purchaseItemAction = createAsyncThunk(
  'api/purchaseItem',
  async (purchaseData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shop/purchase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchaseData)
      });
      if (!response.ok) throw new Error('Failed to purchase item');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Daily Reward thunks
export const fetchDailyReward = createAsyncThunk(
  'api/fetchDailyReward',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/daily-rewards?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch daily reward');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const claimDailyRewardAction = createAsyncThunk(
  'api/claimDailyReward',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/daily-rewards/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!response.ok) throw new Error('Failed to claim daily reward');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Expedition thunks
export const fetchExpeditions = createAsyncThunk(
  'api/fetchExpeditions',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expeditions?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch expeditions');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const startExpeditionAction = createAsyncThunk(
  'api/startExpedition',
  async (expeditionData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expeditions/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expeditionData)
      });
      if (!response.ok) throw new Error('Failed to start expedition');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const completeExpeditionAction = createAsyncThunk(
  'api/completeExpedition',
  async (expeditionId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/expeditions/${expeditionId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to complete expedition');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Free Chest thunks
export const fetchFreeChestStatus = createAsyncThunk(
  'api/fetchFreeChestStatus',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/free-chest?userId=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch free chest status');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const openFreeChestAction = createAsyncThunk(
  'api/openFreeChest',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/free-chest/open`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      if (!response.ok) throw new Error('Failed to open free chest');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const apiSlice = createSlice({
  name: 'api',
  initialState: {
    user: null,
    cards: [],
    campaigns: [],
    campaignProgress: {},
    loading: false,
    error: null,
    currentBattle: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentBattle: (state, action) => {
      state.currentBattle = action.payload;
    },
    clearCurrentBattle: (state) => {
      state.currentBattle = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // User cases
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserCards.fulfilled, (state, action) => {
        state.cards = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      })
      
      // Campaign cases
      .addCase(fetchCampaigns.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCampaigns.fulfilled, (state, action) => {
        state.loading = false;
        state.campaigns = action.payload;
      })
      .addCase(fetchCampaigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCampaignProgress.fulfilled, (state, action) => {
        state.campaignProgress = action.payload;
      })
      .addCase(startCampaignLevel.fulfilled, (state, action) => {
        state.currentBattle = action.payload;
        // Обновляем энергию пользователя если пришла в ответе
        if (action.payload.userEnergy !== undefined) {
          state.user.energy = action.payload.userEnergy;
        }
      })
      .addCase(completeCampaignLevel.fulfilled, (state, action) => {
        // Обновляем данные пользователя после завершения уровня
        if (action.payload.user) {
          state.user = { ...state.user, ...action.payload.user };
        }
      })
      
      // Battle cases
      .addCase(startCampaignBattle.fulfilled, (state, action) => {
        state.currentBattle = action.payload;
      })
      .addCase(completeBattle.fulfilled, (state, action) => {
        state.currentBattle = null;
        // Обновляем пользователя после битвы
        if (action.payload.user) {
          state.user = action.payload.user;
        }
      });
  },
});

export const { clearError, setCurrentBattle, clearCurrentBattle } = apiSlice.actions;
export default apiSlice.reducer;
