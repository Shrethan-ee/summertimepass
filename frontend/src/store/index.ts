import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import ideasReducer from './slices/ideasSlice';
import messagesReducer from './slices/messagesSlice';
import notificationsReducer from './slices/notificationsSlice';
import usersReducer from './slices/usersSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ideas: ideasReducer,
    messages: messagesReducer,
    notifications: notificationsReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 