import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: {
    level: 1,
    experience: 0,
    energy: 100,
    maxEnergy: 100,
    gold: 1000,
    gems: 50,
    power: 0
  },
  cards: [
    { id: 1, name: 'Воин', level: 1, power: 50, health: 100, rarity: 'common' },
    { id: 2, name: 'Лучник', level: 1, power: 45, health: 80, rarity: 'common' },
    { id: 3, name: 'Маг', level: 2, power: 70, health: 60, rarity: 'rare' }
  ],
  campaigns: [],
  quests: [
    { id: 1, title: 'Пройдите 3 кампании', reward: { gold: 100, exp: 50 }, completed: false },
    { id: 2, title: 'Выиграйте 1 битву на арене', reward: { gold: 200, exp: 100 }, completed: false }
  ],
  expeditions: [],
  dailyRewards: [],
  guild: null,
  inventory: {
    potions: 0,
    scrolls: 0,
    chests: 0
  }
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    updateResources: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
    
    addCard: (state, action) => {
      state.cards.push(action.payload);
    },
    
    updateCard: (state, action) => {
      const { id, updates } = action.payload;
      const cardIndex = state.cards.findIndex(card => card.id === id);
      if (cardIndex !== -1) {
        state.cards[cardIndex] = { ...state.cards[cardIndex], ...updates };
      }
    },
    
    startExpedition: (state, action) => {
      state.expeditions.push(action.payload);
    },
    
    completeQuest: (state, action) => {
      const questId = action.payload;
      const quest = state.quests.find(q => q.id === questId);
      if (quest) {
        quest.completed = true;
      }
    },
    
    // Новые экшены для ресурсов
    addGold: (state, action) => {
      state.user.gold += action.payload;
    },
    
    addGems: (state, action) => {
      state.user.gems += action.payload;
    },
    
    addExperience: (state, action) => {
      state.user.experience += action.payload;
      // Логика повышения уровня может быть добавлена здесь
    },
    
    useEnergy: (state, action) => {
      state.user.energy = Math.max(0, state.user.energy - action.payload);
    }
  },
});

export const {
  updateResources,
  addCard,
  updateCard,
  startExpedition,
  completeQuest,
  addGold,
  addGems,
  addExperience,
  useEnergy
} = appSlice.actions;

export default appSlice.reducer;
