export interface Class {
  id: string;
  name: string;
  fee: number;
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  parentName: string;
  phoneNumber: string;
  isActive: boolean;
  classId: string;
  fee: number;
  createdAt: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  month: string;
  year: number;
  isPaid: boolean;
  paidDate: string | null;
}

export interface MonthlyIncome {
  month: string;
  year: number;
  totalIncome: number;
  paidCount: number;
  unpaidCount: number;
}

export interface ClassStudentCount {
  classId: string;
  className: string;
  studentCount: number;
}

export interface PaymentStatus {
  month: string;
  year: number;
  paid: number;
  unpaid: number;
}