import { configureStore } from '@reduxjs/toolkit';
import classesReducer from './slices/classesSlice';
import studentsReducer from './slices/studentsSlice';
import paymentsReducer from './slices/paymentsSlice';

export const store = configureStore({
  reducer: {
    classes: classesReducer,
    students: studentsReducer,
    payments: paymentsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;