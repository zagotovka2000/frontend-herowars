// store/slices/apiSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = 'http://localhost:4000/api';

// Асинхронные thunk'и для работы с пользователем
export const fetchUser = createAsyncThunk(
  'api/fetchUser',
  async (telegramId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/telegram/${telegramId}`);
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
      const userData = await response.json();
      
      // ✅ ДОБАВЛЕНО: добавляем telegramId к данным пользователя
      return { ...userData, telegramId };
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
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error(`Ошибка сервера: ${response.status}`);
      }
      
      const result = await response.json();
      return result.user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserCards = createAsyncThunk(
  'api/fetchUserCards',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/cards/user/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user cards');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронные thunk'и для работы с ежедневными наградами
export const getDailyRewardStatus = createAsyncThunk(
  'api/getDailyRewardStatus',
  async (telegramId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/daily-rewards/status?telegramId=${telegramId}`);
      if (!response.ok) throw new Error('Failed to fetch daily reward status');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const claimDailyReward = createAsyncThunk(
  'api/claimDailyReward',
  async ({ telegramId, rewardType }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/daily-rewards/claim`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId, rewardType })
      });
      if (!response.ok) throw new Error('Failed to claim daily reward');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Асинхронные thunk'и для работы с кампаниями
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

// В apiSlice.js - ЗАМЕНИТЬ мок-данные на реальные запросы:

export const startCampaignLevel = createAsyncThunk(
   'api/startCampaignLevel',
   async (levelData, { rejectWithValue }) => {
     try {
       console.log("🚀 Отправка реального запроса startCampaignLevel:", levelData);
       
       const response = await fetch(`${API_BASE_URL}/campaigns/level/start`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(levelData)
       });
       
       if (!response.ok) {
         let errorMessage = `Ошибка сервера: ${response.status}`;
         try {
           const errorData = await response.json();
           errorMessage += ` - ${errorData.error}`;
         } catch (e) {
           const errorText = await response.text();
           errorMessage += ` - ${errorText}`;
         }
         throw new Error(errorMessage);
       }
       
       const result = await response.json();
       console.log("✅ Реальный ответ сервера:", result);
       return result;
       
     } catch (error) {
       console.error('❌ Ошибка в startCampaignLevel thunk:', error);
       return rejectWithValue(error.message);
     }
   }
 );
 
 export const completeCampaignLevel = createAsyncThunk(
   'api/completeCampaignLevel',
   async (completionData, { rejectWithValue }) => {
     try {
       const { levelId, ...data } = completionData;
       console.log("🚀 Отправка реального запроса completeCampaignLevel:", { levelId, data });
       
       const response = await fetch(`${API_BASE_URL}/campaigns/level/${levelId}/claim`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(data)
       });
       
       if (!response.ok) {
         let errorMessage = `Ошибка сервера: ${response.status}`;
         try {
           const errorData = await response.json();
           errorMessage += ` - ${errorData.error}`;
         } catch (e) {
           const errorText = await response.text();
           errorMessage += ` - ${errorText}`;
         }
         throw new Error(errorMessage);
       }
       
       const result = await response.json();
       console.log("✅ Реальный ответ сервера:", result);
       return result;
       
     } catch (error) {
       console.error('❌ Ошибка в completeCampaignLevel thunk:', error);
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

// Асинхронные thunk'и для работы с заданиями
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

// Асинхронные thunk'и для работы с магазином
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

// Асинхронные thunk'и для работы с экспедициями
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

// Асинхронные thunk'и для работы с бесплатными сундуками
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
    // Серверные данные
    campaigns: [],
    campaignProgress: {},
    quests: [],
    expeditions: [], 
    dailyRewards: [],
    shopItems: [],
    
    // Состояние загрузки
    loading: false,
    error: null,
    
    // Временные данные текущей операции
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
      // Обработчики для fetchUser
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Обработчики для getDailyRewardStatus
      .addCase(getDailyRewardStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDailyRewardStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyRewards = action.payload;
      })
      .addCase(getDailyRewardStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Обработчики для claimDailyReward (УДАЛЕНЫ ДУБЛИКАТЫ)
      .addCase(claimDailyReward.pending, (state) => {
        state.loading = true;
      })
      .addCase(claimDailyReward.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(claimDailyReward.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Обработчики для кампаний
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
      })
      .addCase(completeCampaignLevel.fulfilled, (state) => {
        // Обновление пользователя перенесено в appSlice
      })
      
      // Обработчики для битв
      .addCase(completeBattle.fulfilled, (state) => {
        state.currentBattle = null;
        // Обновление пользователя перенесено в appSlice
      })
      
      // Обработчики для квестов
      .addCase(fetchAvailableQuests.fulfilled, (state, action) => {
        state.quests = action.payload;
      })
      
      // Обработчики для магазина
      .addCase(fetchShopItems.fulfilled, (state, action) => {
        state.shopItems = action.payload;
      })
      
      // Обработчики для экспедиций
      .addCase(fetchExpeditions.fulfilled, (state, action) => {
        state.expeditions = action.payload;
      });
  },
});

export const { clearError, setCurrentBattle, clearCurrentBattle } = apiSlice.actions;
export default apiSlice.reducer;
