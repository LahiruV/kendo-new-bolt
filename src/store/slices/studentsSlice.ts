import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from '@reduxjs/toolkit/dist/query/core/buildMiddleware/cacheLifecycle';
import { Student } from '../../types/student.types';

interface StudentsState {
  students: Student[];
  isLoading: boolean;
  error: string | null;
}

const initialState: StudentsState = {
  students: [],
  isLoading: false,
  error: null,
};

export const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    fetchStudentsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchStudentsSuccess: (state, action: PayloadAction<Student[]>) => {
      state.isLoading = false;
      state.students = action.payload;
    },
    fetchStudentsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addStudent: (state, action: PayloadAction<Omit<Student, 'id'>>) => {
      const newStudent: Student = {
        id: uuidv4(),
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      state.students.push(newStudent);
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      const index = state.students.findIndex((s) => s.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    },
    removeStudent: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter((s) => s.id !== action.payload);
    },
    updateStudentStatus: (state, action: PayloadAction<{ id: string; isActive: boolean }>) => {
      const { id, isActive } = action.payload;
      const index = state.students.findIndex((s) => s.id === id);
      if (index !== -1) {
        state.students[index].isActive = isActive;
      }
    },
  },
});

export const {
  fetchStudentsStart,
  fetchStudentsSuccess,
  fetchStudentsFailure,
  addStudent,
  updateStudent,
  removeStudent,
  updateStudentStatus,
} = studentsSlice.actions;

export default studentsSlice.reducer;