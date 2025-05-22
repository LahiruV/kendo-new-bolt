import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { RootState } from '../store';
import { togglePaymentStatus, addPayment } from '../store/slices/paymentsSlice';
import { Payment, Student, MonthlyIncome } from '../types';
import { formatCurrency, getMonths, getCurrentMonthIndex, getCurrentYear, generateYears } from '../utils/dateUtils';

import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import KendoDropDown from '../components/ui/KendoDropDown';
import KendoButton from '../components/ui/KendoButton';
import KendoGrid from '../components/ui/KendoGrid';
import { GridColumn } from '@progress/kendo-react-grid';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { DollarSign, Save, RefreshCw } from 'lucide-react';

const PaymentManagement: React.FC = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state: RootState) => state.classes);
  const { students } = useSelector((state: RootState) => state.students);
  const { payments } = useSelector((state: RootState) => state.payments);
  
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>(getMonths()[getCurrentMonthIndex()]);
  const [selectedYear, setSelectedYear] = useState<number>(getCurrentYear());
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [studentPayments, setStudentPayments] = useState<{[key: string]: boolean}>({});
  const [monthlyIncome, setMonthlyIncome] = useState<MonthlyIncome>({
    month: selectedMonth,
    year: selectedYear,
    totalIncome: 0,
    paidCount: 0,
    unpaidCount: 0,
  });
  
  // List of months and years for dropdowns
  const months = getMonths();
  const years = generateYears();
  
  useEffect(() => {
    if (selectedClassId) {
      const studentsInClass = students.filter(student => student.classId === selectedClassId && student.isActive);
      setFilteredStudents(studentsInClass);
      
      // Initialize payment status for each student
      const paymentStatus: {[key: string]: boolean} = {};
      
      studentsInClass.forEach(student => {
        const existingPayment = payments.find(
          p => p.studentId === student.id && p.month === selectedMonth && p.year === selectedYear
        );
        
        paymentStatus[student.id] = existingPayment ? existingPayment.isPaid : false;
      });
      
      setStudentPayments(paymentStatus);
      calculateMonthlyIncome(paymentStatus, studentsInClass);
    } else {
      setFilteredStudents([]);
      setStudentPayments({});
      setMonthlyIncome({
        month: selectedMonth,
        year: selectedYear,
        totalIncome: 0,
        paidCount: 0,
        unpaidCount: 0,
      });
    }
  }, [selectedClassId, selectedMonth, selectedYear, students, payments]);
  
  const calculateMonthlyIncome = (paymentStatus: {[key: string]: boolean}, studentsData: Student[]) => {
    let totalIncome = 0;
    let paidCount = 0;
    let unpaidCount = 0;
    
    studentsData.forEach(student => {
      if (paymentStatus[student.id]) {
        totalIncome += student.fee;
        paidCount++;
      } else {
        unpaidCount++;
      }
    });
    
    setMonthlyIncome({
      month: selectedMonth,
      year: selectedYear,
      totalIncome,
      paidCount,
      unpaidCount,
    });
  };
  
  const handleTogglePayment = (studentId: string) => {
    // Toggle the payment status
    const newStatus = !studentPayments[studentId];
    
    // Update local state
    const updatedPayments = { ...studentPayments, [studentId]: newStatus };
    setStudentPayments(updatedPayments);
    
    // Find existing payment
    const existingPayment = payments.find(
      p => p.studentId === studentId && p.month === selectedMonth && p.year === selectedYear
    );
    
    if (existingPayment) {
      // Update existing payment
      dispatch(togglePaymentStatus({
        id: existingPayment.id,
        isPaid: newStatus
      }));
    } else {
      // Create new payment
      const student = students.find(s => s.id === studentId);
      if (student) {
        const newPayment: Payment = {
          id: Date.now().toString(),
          studentId,
          amount: student.fee,
          month: selectedMonth,
          year: selectedYear,
          isPaid: newStatus,
          paidDate: newStatus ? new Date().toISOString() : null,
        };
        
        dispatch(addPayment(newPayment));
      }
    }
    
    // Recalculate monthly income
    calculateMonthlyIncome(updatedPayments, filteredStudents);
    
    // Show confirmation toast
    toast.success(`Payment ${newStatus ? 'marked as paid' : 'marked as unpaid'}`);
  };
  
  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Payment Management"
        subtitle="Manage student payments by class and month"
      />
      
      <div className="grid grid-cols-1 gap-6">
        <Card title="Filter Options">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KendoDropDown
              label="Select Class"
              data={classes}
              textField="name"
              valueField="id"
              value={classes.find(c => c.id === selectedClassId)}
              onChange={(e) => setSelectedClassId(e.value.id)}
            />
            
            <KendoDropDown
              label="Month"
              data={months}
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.value)}
            />
            
            <KendoDropDown
              label="Year"
              data={years}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.value)}
            />
          </div>
        </Card>
        
        {selectedClassId && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card className="bg-primary-50 border-primary-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-600">Total Income</h3>
                    <p className="text-2xl font-bold text-primary-600">
                      {formatCurrency(monthlyIncome.totalIncome)}
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-success-50 border-success-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-success-100 text-success-600 mr-4">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-600">Paid Students</h3>
                    <p className="text-2xl font-bold text-success-600">
                      {monthlyIncome.paidCount} <span className="text-sm font-normal">of {filteredStudents.length}</span>
                    </p>
                  </div>
                </div>
              </Card>
              
              <Card className="bg-error-50 border-error-200">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-error-100 text-error-600 mr-4">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-neutral-600">Unpaid Students</h3>
                    <p className="text-2xl font-bold text-error-600">
                      {monthlyIncome.unpaidCount} <span className="text-sm font-normal">of {filteredStudents.length}</span>
                    </p>
                  </div>
                </div>
              </Card>
            </div>
            
            <Card 
              title="Student Payment Status" 
              subtitle={`${
                classes.find(c => c.id === selectedClassId)?.name || ''
              } - ${selectedMonth} ${selectedYear}`}
            >
              <KendoGrid
                data={filteredStudents}
                pageable={true}
              >
                <GridColumn field="name" title="Student Name" />
                <GridColumn field="parentName" title="Parent Name" />
                <GridColumn
                  field="fee"
                  title="Fee Amount"
                  width="150px"
                  cell={(props) => (
                    <td>{formatCurrency(props.dataItem.fee)}</td>
                  )}
                />
                <GridColumn
                  field="id"
                  title="Payment Status"
                  width="150px"
                  cell={(props) => (
                    <td>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={studentPayments[props.dataItem.id] || false}
                          onChange={() => handleTogglePayment(props.dataItem.id)}
                          className="h-5 w-5 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 cursor-pointer"
                        />
                        <span className={`ml-2 text-sm ${
                          studentPayments[props.dataItem.id] 
                            ? 'text-success-600'
                            : 'text-error-600'
                        }`}>
                          {studentPayments[props.dataItem.id] ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </td>
                  )}
                />
              </KendoGrid>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentManagement;