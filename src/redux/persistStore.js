'use client';
// redux imports
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { userReducer, pweetsReducer } from '@/redux';
// redux-persist imports
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const reducers = combineReducers({ user: userReducer, pweets: pweetsReducer });

const persistConfig = {
  key: 'pwitter',
  storage,
  blacklist: ['pweets'], // Prevents tweets to be stored in local storage
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
