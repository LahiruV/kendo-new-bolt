import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Class } from '../../types';

interface ClassesState {
  classes: Class[];
  loading: boolean;
  error: string | null;
}

const initialState: ClassesState = {
  classes: [
    {
      id: '1',
      name: 'Basic Mathematics',
      fee: 1200,
      createdAt: '2023-01-15T10:30:00Z',
    },
    {
      id: '2',
      name: 'Advanced Physics',
      fee: 1500,
      createdAt: '2023-02-20T14:45:00Z',
    },
    {
      id: '3',
      name: 'English Literature',
      fee: 1100,
      createdAt: '2023-03-10T09:15:00Z',
    },
    {
      id: '4',
      name: 'Computer Science',
      fee: 1800,
      createdAt: '2023-04-05T13:00:00Z',
    },
  ],
  loading: false,
  error: null,
};

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    addClass: (state, action: PayloadAction<Class>) => {
      state.classes.push(action.payload);
    },
    updateClass: (state, action: PayloadAction<Class>) => {
      const index = state.classes.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.classes[index] = action.payload;
      }
    },
    removeClass: (state, action: PayloadAction<string>) => {
      state.classes = state.classes.filter(c => c.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addClass,
  updateClass,
  removeClass,
  setLoading,
  setError,
} = classesSlice.actions;

export default classesSlice.reducer;