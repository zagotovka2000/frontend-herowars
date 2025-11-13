// store/slices/appSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchUser, fetchUserCards, updateUser, startCampaignLevel, completeCampaignLevel, completeBattle } from './apiSlice';

// УДАЛЕНО: неиспользуемая константа initialState

export const appSlice = createSlice({
  name: 'app',
  initialState: {
     cards: [],   // Карты пользователя
     user: null   // Данные пользователя
  },
  reducers: {
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
      })
      // ДОБАВЛЕНО: обработка обновления энергии при начале уровня кампании
      .addCase(startCampaignLevel.fulfilled, (state, action) => {
        if (action.payload.userEnergy !== undefined && state.user) {
          state.user.energy = action.payload.userEnergy;
        }
      })
      // ДОБАВЛЕНО: обработка обновления пользователя после завершения уровня
      .addCase(completeCampaignLevel.fulfilled, (state, action) => {
        if (action.payload.user && state.user) {
          state.user = { ...state.user, ...action.payload.user };
        }
      })
      // ДОБАВЛЕНО: обработка обновления пользователя после завершения битвы
      .addCase(completeBattle.fulfilled, (state, action) => {
        if (action.payload.user && state.user) {
          state.user = action.payload.user;
        }
      });
  }
});

export const {
  updateLocalResources,
  addLocalCard,
  updateLocalCard,
  addGold,
  addGems,
  addExperience,
  useEnergy,
  setUserData,
  setCardsData
} = appSlice.actions;

export default appSlice.reducer;
