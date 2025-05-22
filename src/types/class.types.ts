export interface Class {
  id: string;
  name: string;
  monthlyFee: number;
  startDate: string;
  createdAt: string;
}

export interface ClassFormValues {
  name: string;
  monthlyFee: number;
  startDate: Date;
}