'use client';
// redux imports
import { Provider } from 'react-redux';
// redux-persist imports
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './';

export const ReduxProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
};
