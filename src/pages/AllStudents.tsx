import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { formatDate, formatCurrency } from '../utils/dateUtils';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import KendoGrid from '../components/ui/KendoGrid';
import { GridColumn } from '@progress/kendo-react-grid';

const AllStudents: React.FC = () => {
  const { students } = useSelector((state: RootState) => state.students);
  const { classes } = useSelector((state: RootState) => state.classes);
  const { payments } = useSelector((state: RootState) => state.payments);

  const studentsWithDetails = students.map(student => {
    const classDetails = classes.find(c => c.id === student.classId);
    const studentPayments = payments.filter(p => p.studentId === student.id);
    const paidPayments = studentPayments.filter(p => p.isPaid);
    const totalPaid = paidPayments.reduce((sum, payment) => sum + payment.amount, 0);
    
    return {
      ...student,
      className: classDetails?.name || 'Unknown',
      totalPaid,
      lastPaymentDate: paidPayments.length > 0 
        ? paidPayments.sort((a, b) => new Date(b.paidDate!).getTime() - new Date(a.paidDate!).getTime())[0].paidDate
        : null
    };
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="All Students"
        subtitle="Comprehensive view of all students and their details"
      />

      <Card>
        <KendoGrid
          data={studentsWithDetails}
          sortable={true}
          filterable={true}
          pageable={{ pageSize: 10 }}
        >
          <GridColumn field="name" title="Student Name" filterable={true} />
          <GridColumn field="parentName" title="Parent Name" filterable={true} />
          <GridColumn field="phoneNumber" title="Phone Number" width="150px" />
          <GridColumn field="className" title="Class" filterable={true} />
          <GridColumn
            field="fee"
            title="Monthly Fee"
            width="130px"
            cell={(props) => (
              <td>{formatCurrency(props.dataItem.fee)}</td>
            )}
          />
          <GridColumn
            field="totalPaid"
            title="Total Paid"
            width="130px"
            cell={(props) => (
              <td>{formatCurrency(props.dataItem.totalPaid)}</td>
            )}
          />
          <GridColumn
            field="isActive"
            title="Status"
            width="120px"
            cell={(props) => (
              <td>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  props.dataItem.isActive 
                    ? 'bg-success-100 text-success-800' 
                    : 'bg-error-100 text-error-800'
                }`}>
                  {props.dataItem.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
            )}
          />
          <GridColumn
            field="lastPaymentDate"
            title="Last Payment"
            width="150px"
            cell={(props) => (
              <td>{props.dataItem.lastPaymentDate ? formatDate(props.dataItem.lastPaymentDate) : '-'}</td>
            )}
          />
          <GridColumn
            field="createdAt"
            title="Enrolled On"
            width="150px"
            cell={(props) => (
              <td>{formatDate(props.dataItem.createdAt)}</td>
            )}
          />
        </KendoGrid>
      </Card>
    </div>
  );
};

export default AllStudents;