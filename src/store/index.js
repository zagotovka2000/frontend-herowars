// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import gameReducer from './slices/gameSlice';
import navigationReducer from './slices/navigationSlice';
import apiReducer from './slices/apiSlice';

// Создание Redux store с объединением всех редюсеров
export const store = configureStore({
  reducer: {
    app: appReducer,        // Редюсер для данных приложения
    game: gameReducer,      // Редюсер для игровой логики
    navigation: navigationReducer, // Редюсер для навигации
    api: apiReducer,        // Редюсер для API запросов
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'], // Игнорируем действия persist для сериализации
      },
    }),
});

export default store;
