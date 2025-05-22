import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Class } from '../../types/class.types';

interface ClassesState {
  classes: Class[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ClassesState = {
  classes: [],
  isLoading: false,
  error: null,
};

export const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {
    fetchClassesStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchClassesSuccess: (state, action: PayloadAction<Class[]>) => {
      state.isLoading = false;
      state.classes = action.payload;
    },
    fetchClassesFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addClass: (state, action: PayloadAction<Omit<Class, 'id'>>) => {
      const newClass: Class = {
        id: uuidv4(),
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      state.classes.push(newClass);
    },
    updateClass: (state, action: PayloadAction<Class>) => {
      const index = state.classes.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.classes[index] = action.payload;
      }
    },
    removeClass: (state, action: PayloadAction<string>) => {
      state.classes = state.classes.filter((c) => c.id !== action.payload);
    },
  },
});

export const {
  fetchClassesStart,
  fetchClassesSuccess,
  fetchClassesFailure,
  addClass,
  updateClass,
  removeClass,
} = classesSlice.actions;

export default classesSlice.reducer;