import { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from '@progress/kendo-react-layout';
import {
  DropDownList,
  DropDownListChangeEvent,
} from '@progress/kendo-react-dropdowns';
import {
  ButtonGroup,
  Button,
} from '@progress/kendo-react-buttons';
import { Switch } from '@progress/kendo-react-inputs';
import { toast } from 'sonner';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { RootState } from '../../store';
import { updateStudentPaymentStatus } from '../../store/slices/paymentsSlice';
import { Student, StudentWithClass } from '../../types/student.types';
import { Payment } from '../../types/payment.types';
import PageHeader from '../../components/common/PageHeader';
import AppButton from '../../components/ui/AppButton';

const PaymentsPage = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state: RootState) => state.classes);
  const { students } = useSelector((state: RootState) => state.students);
  const { payments } = useSelector((state: RootState) => state.payments);
  
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [filter, setFilter] = useState<'all' | 'paid' | 'unpaid'>('all');
  const [summary, setSummary] = useState({ total: 0, paid: 0, unpaid: 0 });
  
  // Prepare filtered students with payment status
  const filteredStudents = useMemo(() => {
    if (!selectedClass) return [];
    
    const studentsInClass = students.filter(
      (student) => student.classId === selectedClass.id && student.isActive
    );
    
    const studentsWithPaymentStatus: StudentWithClass[] = studentsInClass.map((student) => {
      // Find payment for this student, class, month, and year
      const payment = payments.find(
        (p) =>
          p.studentId === student.id &&
          p.classId === student.classId &&
          p.month === selectedMonth &&
          p.year === selectedYear
      );
      
      const isPaid = payment?.isPaid || false;
      
      return {
        ...student,
        className: selectedClass.name,
        classFee: selectedClass.monthlyFee,
        isPaid,
      };
    });
    
    // Apply filter
    if (filter === 'paid') {
      return studentsWithPaymentStatus.filter((student) => student.isPaid);
    } else if (filter === 'unpaid') {
      return studentsWithPaymentStatus.filter((student) => !student.isPaid);
    }
    
    return studentsWithPaymentStatus;
  }, [selectedClass, students, payments, selectedMonth, selectedYear, filter]);
  
  // Update summary when filtered students change
  useEffect(() => {
    if (filteredStudents.length > 0) {
      const total = filteredStudents.length * selectedClass.monthlyFee;
      const paid = filteredStudents.filter((s) => s.isPaid).length * selectedClass.monthlyFee;
      
      setSummary({
        total,
        paid,
        unpaid: total - paid,
      });
    } else {
      setSummary({ total: 0, paid: 0, unpaid: 0 });
    }
  }, [filteredStudents, selectedClass]);
  
  // Handle class selection
  const handleClassChange = (e: DropDownListChangeEvent) => {
    setSelectedClass(e.value);
  };
  
  // Handle payment status change
  const handlePaymentStatusChange = (student: StudentWithClass, isPaid: boolean) => {
    dispatch(
      updateStudentPaymentStatus({
        studentId: student.id,
        classId: student.classId,
        month: selectedMonth,
        year: selectedYear,
        isPaid,
      })
    );
    
    toast.success(
      `Payment ${isPaid ? 'marked as paid' : 'marked as unpaid'} for ${student.name}`
    );
  };
  
  // Prepare months for dropdown
  const months = [
    { text: 'January', value: 1 },
    { text: 'February', value: 2 },
    { text: 'March', value: 3 },
    { text: 'April', value: 4 },
    { text: 'May', value: 5 },
    { text: 'June', value: 6 },
    { text: 'July', value: 7 },
    { text: 'August', value: 8 },
    { text: 'September', value: 9 },
    { text: 'October', value: 10 },
    { text: 'November', value: 11 },
    { text: 'December', value: 12 },
  ];
  
  // Prepare years for dropdown (current year and 2 years before/after)
  const currentYear = new Date().getFullYear();
  const years = [
    currentYear - 2,
    currentYear - 1,
    currentYear,
    currentYear + 1,
    currentYear + 2,
  ];
  
  // Column definitions for TanStack Table
  const columnHelper = createColumnHelper<StudentWithClass>();
  
  const columns = [
    columnHelper.accessor('name', {
      header: 'Student Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('parentName', {
      header: 'Parent Name',
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor('classFee', {
      header: 'Monthly Fee',
      cell: (info) => <span>${info.getValue()}</span>,
    }),
    columnHelper.accessor('isPaid', {
      header: 'Payment Status',
      cell: (info) => (
        <div className="flex items-center">
          <Switch
            checked={info.getValue()}
            onChange={(e) => {
              handlePaymentStatusChange(info.row.original, e.value);
            }}
          />
          <span className="ml-2">
            {info.getValue() ? 'Paid' : 'Unpaid'}
          </span>
        </div>
      ),
    }),
  ];
  
  // Create table instance
  const table = useReactTable({
    data: filteredStudents,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  
  return (
    <div>
      <PageHeader 
        title="Payment Management" 
        subtitle="Track and manage student payments" 
      />
      
      <Card className="mb-6 p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Select Class
            </label>
            <DropDownList
              data={classes}
              textField="name"
              value={selectedClass}
              onChange={handleClassChange}
              placeholder="Select a class"
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Month
            </label>
            <DropDownList
              data={months}
              textField="text"
              valueField="value"
              value={months.find((m) => m.value === selectedMonth)}
              onChange={(e) => setSelectedMonth(e.value.value)}
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Year
            </label>
            <DropDownList
              data={years}
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.value)}
            />
          </div>
          
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Filter
            </label>
            <ButtonGroup>
              <Button
                togglable
                selected={filter === 'all'}
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                togglable
                selected={filter === 'paid'}
                onClick={() => setFilter('paid')}
              >
                Paid
              </Button>
              <Button
                togglable
                selected={filter === 'unpaid'}
                onClick={() => setFilter('unpaid')}
              >
                Unpaid
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </Card>
      
      {selectedClass ? (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="p-6">
              <h3 className="mb-2 text-lg font-medium text-gray-700">Total Expected</h3>
              <p className="text-3xl font-bold text-primary">${summary.total}</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="mb-2 text-lg font-medium text-gray-700">Total Received</h3>
              <p className="text-3xl font-bold text-success">${summary.paid}</p>
            </Card>
            
            <Card className="p-6">
              <h3 className="mb-2 text-lg font-medium text-gray-700">Outstanding</h3>
              <p className="text-3xl font-bold text-error">${summary.unpaid}</p>
            </Card>
          </div>
          
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Student Payments
            </h2>
            
            {filteredStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="whitespace-nowrap px-6 py-4 text-sm text-gray-500"
                          >
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">
                No students found for the selected class or filter.
              </p>
            )}
            
            {filteredStudents.length > 0 && (
              <div className="mt-4 flex justify-end">
                <AppButton
                  variant="success"
                  onClick={() => {
                    // Mark all as paid
                    filteredStudents.forEach((student) => {
                      if (!student.isPaid) {
                        handlePaymentStatusChange(student, true);
                      }
                    });
                    toast.success('All students marked as paid');
                  }}
                >
                  Mark All as Paid
                </AppButton>
              </div>
            )}
          </Card>
        </>
      ) : (
        <Card className="p-6">
          <p className="text-center text-gray-500">
            Please select a class to view payment information.
          </p>
        </Card>
      )}
    </div>
  );
};

export default PaymentsPage;