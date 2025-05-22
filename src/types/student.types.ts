export interface Student {
  id: string;
  name: string;
  parentName: string;
  phoneNumber: string;
  classId: string;
  isActive: boolean;
  createdAt: string;
}

export interface StudentFormValues {
  name: string;
  parentName: string;
  phoneNumber: string;
  classId: string;
  isActive: boolean;
}

export interface StudentWithClass extends Student {
  className: string;
  classFee: number;
}