import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import classesReducer from './slices/classesSlice';
import studentsReducer from './slices/studentsSlice';
import paymentsReducer from './slices/paymentsSlice';

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('classManagementState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Error loading state from localStorage:', err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('classManagementState', serializedState);
  } catch (err) {
    console.error('Error saving state to localStorage:', err);
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    classes: classesReducer,
    students: studentsReducer,
    payments: paymentsReducer,
  },
  preloadedState: loadState(),
});

// Save state to localStorage when it changes
store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;