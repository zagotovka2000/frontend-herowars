// contex/NavigationContext.js
import React, { createContext, useContext, useReducer } from 'react';

const NavigationContext = createContext();

// Начальное состояние
const initialState = {
  currentScreen: 'main-map',
  history: ['main-map'] // Стек истории для кнопки "Назад"
};

// Редьюсер для управления навигацией
function navigationReducer(state, action) {
  switch (action.type) {
    case 'NAVIGATE_TO':
      return {
        currentScreen: action.screen,
        history: [...state.history, action.screen]
      };
    
    case 'NAVIGATE_BACK':
      if (state.history.length <= 1) {
        return state; // Не можем уйти с главного экрана
      }
      
      const newHistory = state.history.slice(0, -1);
      return {
        currentScreen: newHistory[newHistory.length - 1],
        history: newHistory
      };
    
    case 'NAVIGATE_REPLACE':
      const replacedHistory = [...state.history];
      replacedHistory[replacedHistory.length - 1] = action.screen;
      return {
        currentScreen: action.screen,
        history: replacedHistory
      };
    
    case 'RESET_TO_MAIN':
      return {
        currentScreen: 'main-map',
        history: ['main-map']
      };
    
    default:
      return state;
  }
}

export const NavigationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(navigationReducer, initialState);

  const navigateTo = (screen) => {
    dispatch({ type: 'NAVIGATE_TO', screen });
  };

  const navigateBack = () => {
    dispatch({ type: 'NAVIGATE_BACK' });
  };

  const navigateReplace = (screen) => {
    dispatch({ type: 'NAVIGATE_REPLACE', screen });
  };

  const resetToMain = () => {
    dispatch({ type: 'RESET_TO_MAIN' });
  };

  const canGoBack = state.history.length > 1;

  return (
    <NavigationContext.Provider value={{
      currentScreen: state.currentScreen,
      history: state.history,
      navigateTo,
      navigateBack,
      navigateReplace,
      resetToMain,
      canGoBack
    }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};
