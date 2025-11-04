// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import gameReducer from './slices/gameSlice';
import navigationReducer from './slices/navigationSlice';
import apiReducer from './slices/apiSlice';

export const store = configureStore({
  reducer: {
    app: appReducer,
    game: gameReducer,
    navigation: navigationReducer,
    api: apiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export default store;
