import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Payment } from '../../types';

interface PaymentsState {
  payments: Payment[];
  loading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  payments: [
    {
      id: '1',
      studentId: '1',
      amount: 1200,
      month: 'January',
      year: 2023,
      isPaid: true,
      paidDate: '2023-01-05T10:30:00Z',
    },
    {
      id: '2',
      studentId: '2',
      amount: 1500,
      month: 'January',
      year: 2023,
      isPaid: true,
      paidDate: '2023-01-07T14:45:00Z',
    },
    {
      id: '3',
      studentId: '3',
      amount: 1100,
      month: 'January',
      year: 2023,
      isPaid: true,
      paidDate: '2023-01-10T09:15:00Z',
    },
    {
      id: '4',
      studentId: '4',
      amount: 1800,
      month: 'January',
      year: 2023,
      isPaid: false,
      paidDate: null,
    },
    {
      id: '5',
      studentId: '1',
      amount: 1200,
      month: 'February',
      year: 2023,
      isPaid: true,
      paidDate: '2023-02-05T11:30:00Z',
    },
    {
      id: '6',
      studentId: '2',
      amount: 1500,
      month: 'February',
      year: 2023,
      isPaid: true,
      paidDate: '2023-02-08T15:45:00Z',
    },
    {
      id: '7',
      studentId: '3',
      amount: 1100,
      month: 'February',
      year: 2023,
      isPaid: false,
      paidDate: null,
    },
    {
      id: '8',
      studentId: '4',
      amount: 1800,
      month: 'February',
      year: 2023,
      isPaid: false,
      paidDate: null,
    },
  ],
  loading: false,
  error: null,
};

const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    addPayment: (state, action: PayloadAction<Payment>) => {
      state.payments.push(action.payload);
    },
    updatePayment: (state, action: PayloadAction<Payment>) => {
      const index = state.payments.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },
    removePayment: (state, action: PayloadAction<string>) => {
      state.payments = state.payments.filter(p => p.id !== action.payload);
    },
    togglePaymentStatus: (state, action: PayloadAction<{id: string, isPaid: boolean}>) => {
      const index = state.payments.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.payments[index].isPaid = action.payload.isPaid;
        state.payments[index].paidDate = action.payload.isPaid ? new Date().toISOString() : null;
      }
    },
    setPaymentLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setPaymentError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  addPayment,
  updatePayment,
  removePayment,
  togglePaymentStatus,
  setPaymentLoading,
  setPaymentError,
} = paymentsSlice.actions;

export default paymentsSlice.reducer;