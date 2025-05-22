export interface Payment {
  id: string;
  studentId: string;
  classId: string;
  month: number;
  year: number;
  isPaid: boolean;
  paidAt: string | null;
  createdAt: string;
}

export interface MonthlyPayment {
  month: number;
  year: number;
  totalAmount: number;
  paidAmount: number;
  paidCount: number;
  totalCount: number;
}

export interface StudentPaymentStatus {
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  classFee: number;
  months: {
    [key: string]: boolean;
  };
}