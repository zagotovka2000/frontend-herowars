// context/AppContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

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
  cards: [],
  campaigns: [],
  quests: [],
  expeditions: [],
  dailyRewards: [],
  guild: null,
  inventory: {
    potions: 0,
    scrolls: 0,
    chests: 0
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_RESOURCES':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'ADD_CARD':
      return {
        ...state,
        cards: [...state.cards, action.payload]
      };
    case 'UPDATE_CARD':
      return {
        ...state,
        cards: state.cards.map(card => 
          card.id === action.payload.id 
            ? { ...card, ...action.payload.updates }
            : card
        )
      };
    case 'START_EXPEDITION':
      return {
        ...state,
        expeditions: [...state.expeditions, action.payload]
      };
    case 'COMPLETE_QUEST':
      return {
        ...state,
        quests: state.quests.map(quest =>
          quest.id === action.payload
            ? { ...quest, completed: true }
            : quest
        )
      };
    default:
      return state;
  }
}

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Загрузка начальных данных
  useEffect(() => {
    // Здесь будут API вызовы к бэкенду
    initializeGameData();
  }, []);

  const initializeGameData = async () => {
    // Заглушки данных - потом заменим на реальные API
    const mockCards = [
      { id: 1, name: 'Воин', level: 1, power: 50, health: 100, rarity: 'common' },
      { id: 2, name: 'Лучник', level: 1, power: 45, health: 80, rarity: 'common' },
      { id: 3, name: 'Маг', level: 2, power: 70, health: 60, rarity: 'rare' }
    ];

    const mockQuests = [
      { id: 1, title: 'Пройдите 3 кампании', reward: { gold: 100, exp: 50 }, completed: false },
      { id: 2, title: 'Выиграйте 1 битву на арене', reward: { gold: 200, exp: 100 }, completed: false }
    ];

    dispatch({ type: 'ADD_CARD', payload: mockCards });
    // Аналогично для других данных
  };

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
