import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Student } from '../../types';

interface StudentsState {
  students: Student[];
  loading: boolean;
  error: string | null;
}

const initialState: StudentsState = {
  students: [
    {
      id: '1',
      name: 'John Smith',
      parentName: 'Michael Smith',
      phoneNumber: '555-123-4567',
      isActive: true,
      classId: '1',
      fee: 1200,
      createdAt: '2023-01-20T10:30:00Z',
    },
    {
      id: '2',
      name: 'Emma Johnson',
      parentName: 'Robert Johnson',
      phoneNumber: '555-234-5678',
      isActive: true,
      classId: '2',
      fee: 1500,
      createdAt: '2023-02-25T14:45:00Z',
    },
    {
      id: '3',
      name: 'Sophia Williams',
      parentName: 'James Williams',
      phoneNumber: '555-345-6789',
      isActive: true,
      classId: '3',
      fee: 1100,
      createdAt: '2023-03-15T09:15:00Z',
    },
    {
      id: '4',
      name: 'Oliver Brown',
      parentName: 'William Brown',
      phoneNumber: '555-456-7890',
      isActive: false,
      classId: '4',
      fee: 1800,
      createdAt: '2023-04-10T13:00:00Z',
    },
    {
      id: '5',
      name: 'Ava Jones',
      parentName: 'Thomas Jones',
      phoneNumber: '555-567-8901',
      isActive: true,
      classId: '1',
      fee: 1200,
      createdAt: '2023-05-05T11:30:00Z',
    },
    {
      id: '6',
      name: 'Ethan Davis',
      parentName: 'David Davis',
      phoneNumber: '555-678-9012',
      isActive: true,
      classId: '2',
      fee: 1500,
      createdAt: '2023-06-01T15:45:00Z',
    },
  ],
  loading: false,
  error: null,
};

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    addStudent: (state, action: PayloadAction<Student>) => {
      state.students.push(action.payload);
    },
    updateStudent: (state, action: PayloadAction<Student>) => {
      const index = state.students.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.students[index] = action.payload;
      }
    },
    removeStudent: (state, action: PayloadAction<string>) => {
      state.students = state.students.filter(s => s.id !== action.payload);
    },
    setStudentLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setStudentError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addStudent,
  updateStudent,
  removeStudent,
  setStudentLoading,
  setStudentError,
} = studentsSlice.actions;

export default studentsSlice.reducer;