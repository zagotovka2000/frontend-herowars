// только клиентское состояние
import { createSlice } from '@reduxjs/toolkit';
import { fetchUser, fetchUserCards, updateUser } from './apiSlice';

// Начальное состояние теперь будет загружаться с сервера
const initialState = {

  cards: [],
  campaigns: [],
  quests: [],
  expeditions: [],
  dailyRewards: [],
  guild: {
   id: '1',
   name: 'Гильдия Героев',
   rank: 15,
   members: 24
 },
  inventory: {
    potions: 0,
    scrolls: 0,
    chests: 0
  }
};

export const appSlice = createSlice({
  name: 'app',
  initialState: {
     cards: [],
   user: null
  },
  reducers: {
    // Локальные экшены для мгновенного обновления UI
    updateLocalResources: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    
    addLocalCard: (state, action) => {
      state.cards.push(action.payload);
    },
    
    updateLocalCard: (state, action) => {
      const { id, updates } = action.payload;
      const cardIndex = state.cards.findIndex(card => card.id === id);
      if (cardIndex !== -1) {
        state.cards[cardIndex] = { ...state.cards[cardIndex], ...updates };
      }
    },
    
    startLocalExpedition: (state, action) => {
      state.expeditions.push(action.payload);
    },
    
    completeLocalQuest: (state, action) => {
      const questId = action.payload;
      const quest = state.quests.find(q => q.id === questId);
      if (quest) {
        quest.completed = true;
      }
    },
    
    // Экшены для ресурсов (синхронизируются с сервером)
    addGold: (state, action) => {
      if (state.user) {
        state.user.gold += action.payload;
      }
    },
    
    addGems: (state, action) => {
      if (state.user) {
        state.user.gems += action.payload;
      }
    },
    
    addExperience: (state, action) => {
      if (state.user) {
        state.user.experience += action.payload;
        // Логика повышения уровня может быть добавлена здесь
      }
    },
    
    useEnergy: (state, action) => {
      if (state.user) {
        state.user.energy = Math.max(0, state.user.energy - action.payload);
      }
    },

    // Установка данных с сервера
    setUserData: (state, action) => {
      state.user = action.payload;
    },

    setCardsData: (state, action) => {
      state.cards = action.payload;
    },

    setCampaignsData: (state, action) => {
      state.campaigns = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(fetchUserCards.fulfilled, (state, action) => {
        state.cards = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
      });
  }
});

export const {
  updateLocalResources,
  addLocalCard,
  updateLocalCard,
  startLocalExpedition,
  completeLocalQuest,
  addGold,
  addGems,
  addExperience,
  useEnergy,
  setUserData,
  setCardsData,
  setCampaignsData
} = appSlice.actions;

export default appSlice.reducer;
