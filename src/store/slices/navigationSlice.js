import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentScreen: 'main-map',
  history: ['main-map']
};

export const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    navigateTo: (state, action) => {
      state.currentScreen = action.payload;
      state.history.push(action.payload);
    },
    
    navigateBack: (state) => {
      if (state.history.length > 1) {
        state.history.pop();
        state.currentScreen = state.history[state.history.length - 1];
      }
    },
    
    navigateReplace: (state, action) => {
      state.currentScreen = action.payload;
      state.history[state.history.length - 1] = action.payload;
    },
    
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

// Селекторы
export const selectCurrentScreen = (state) => state.navigation.currentScreen;
export const selectCanGoBack = (state) => state.navigation.history.length > 1;

export default navigationSlice.reducer;
