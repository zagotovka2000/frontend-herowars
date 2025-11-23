// store/slices/navigationSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Начальное состояние навигации
const initialState = {
  currentScreen: 'main-map', // Текущий активный экран
  history: ['main-map']      // История навигации для кнопки "назад"
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState: {
   currentScreen: 'main-map',
   history: ['main-map'],
   screenParams: {} // ✅ ДОБАВЛЕНО: параметры экранов
 },
  reducers: {
    // Навигация на указанный экран с добавлением в историю
    navigateTo: (state, action) => {
      const { screen, params } = typeof action.payload === 'object' 
        ? action.payload 
        : { screen: action.payload, params: {} };
      
      state.currentScreen = screen;
      state.history.push(screen);
      state.screenParams[screen] = params; // ✅ Сохраняем параметры
    },
    
    // Навигация назад по истории
    navigateBack: (state) => {
      if (state.history.length > 1) {
        state.history.pop();
        state.currentScreen = state.history[state.history.length - 1];
      }
    },
    
    // Замена текущего экрана без добавления в историю
    navigateReplace: (state, action) => {
      state.currentScreen = action.payload;
      state.history[state.history.length - 1] = action.payload;
    },
    
    // Сброс навигации на главный экран
    resetToMain: (state) => {
      state.currentScreen = 'main-map';
      state.history = ['main-map'];
    }
  },
});

export const {
  navigateTo,
  navigateBack,
  navigateReplace,
  resetToMain
} = navigationSlice.actions;

// Селекторы для доступа к состоянию навигации
export const selectCurrentScreen = (state) => state.navigation.currentScreen;
export const selectCanGoBack = (state) => state.navigation.history.length > 1;
export const selectScreenParams = (state) => state.navigation.screenParams;

export default navigationSlice.reducer;
