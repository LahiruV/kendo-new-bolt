import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { Payment, MonthlyPayment } from '../../types/payment.types';

interface PaymentsState {
  payments: Payment[];
  monthlyPayments: MonthlyPayment[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PaymentsState = {
  payments: [],
  monthlyPayments: [],
  isLoading: false,
  error: null,
};

export const paymentsSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    fetchPaymentsStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchPaymentsSuccess: (state, action: PayloadAction<Payment[]>) => {
      state.isLoading = false;
      state.payments = action.payload;
    },
    fetchPaymentsFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    addPayment: (state, action: PayloadAction<Omit<Payment, 'id'>>) => {
      const newPayment: Payment = {
        id: uuidv4(),
        ...action.payload,
        createdAt: new Date().toISOString(),
      };
      state.payments.push(newPayment);
    },
    updatePayment: (state, action: PayloadAction<Payment>) => {
      const index = state.payments.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.payments[index] = action.payload;
      }
    },
    removePayment: (state, action: PayloadAction<string>) => {
      state.payments = state.payments.filter((p) => p.id !== action.payload);
    },
    updateStudentPaymentStatus: (
      state,
      action: PayloadAction<{
        studentId: string;
        classId: string;
        month: number;
        year: number;
        isPaid: boolean;
      }>
    ) => {
      const { studentId, classId, month, year, isPaid } = action.payload;
      
      // Check if payment exists
      const paymentIndex = state.payments.findIndex(
        (p) =>
          p.studentId === studentId &&
          p.classId === classId &&
          p.month === month &&
          p.year === year
      );

      if (isPaid) {
        // Add new payment or update existing
        if (paymentIndex === -1) {
          state.payments.push({
            id: uuidv4(),
            studentId,
            classId,
            month,
            year,
            isPaid,
            paidAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          });
        } else {
          state.payments[paymentIndex].isPaid = true;
          state.payments[paymentIndex].paidAt = new Date().toISOString();
        }
      } else if (paymentIndex !== -1) {
        // Mark as unpaid
        state.payments[paymentIndex].isPaid = false;
        state.payments[paymentIndex].paidAt = null;
      }
    },
    // Update monthly payments summary
    updateMonthlyPayments: (state, action: PayloadAction<MonthlyPayment[]>) => {
      state.monthlyPayments = action.payload;
    },
  },
});

export const {
  fetchPaymentsStart,
  fetchPaymentsSuccess,
  fetchPaymentsFailure,
  addPayment,
  updatePayment,
  removePayment,
  updateStudentPaymentStatus,
  updateMonthlyPayments,
} = paymentsSlice.actions;

export default paymentsSlice.reducer;