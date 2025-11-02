import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './slices/gameSlice';
import appReducer from './slices/appSlice';
import navigationReducer from './slices/navigationSlice';

export const store = configureStore({
  reducer: {
    game: gameReducer,
    app: appReducer,
    navigation: navigationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [], // можно добавить экшены если нужно
      },
    }),
});

