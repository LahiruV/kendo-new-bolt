import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { formatDate, formatCurrency } from '../utils/dateUtils';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import KendoGrid from '../components/ui/KendoGrid';
import { GridColumn } from '@progress/kendo-react-grid';

const AllPayments: React.FC = () => {
  const { payments } = useSelector((state: RootState) => state.payments);
  const { students } = useSelector((state: RootState) => state.students);
  const { classes } = useSelector((state: RootState) => state.classes);

  const paymentsWithDetails = payments.map(payment => {
    const student = students.find(s => s.id === payment.studentId);
    const classDetails = classes.find(c => c.id === student?.classId);
    
    return {
      ...payment,
      studentName: student?.name || 'Unknown',
      className: classDetails?.name || 'Unknown',
    };
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="All Payments"
        subtitle="Complete payment history across all classes"
      />

      <Card>
        <KendoGrid
          data={paymentsWithDetails}
          sortable={true}
          filterable={true}
          pageable={{ pageSize: 10 }}
        >
          <GridColumn field="studentName" title="Student Name" filterable={true} />
          <GridColumn field="className" title="Class" filterable={true} />
          <GridColumn field="month" title="Month" width="120px" />
          <GridColumn field="year" title="Year" width="100px" />
          <GridColumn
            field="amount"
            title="Amount"
            width="120px"
            cell={(props) => (
              <td>{formatCurrency(props.dataItem.amount)}</td>
            )}
          />
          <GridColumn
            field="isPaid"
            title="Status"
            width="120px"
            cell={(props) => (
              <td>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  props.dataItem.isPaid 
                    ? 'bg-success-100 text-success-800' 
                    : 'bg-error-100 text-error-800'
                }`}>
                  {props.dataItem.isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </td>
            )}
          />
          <GridColumn
            field="paidDate"
            title="Payment Date"
            width="150px"
            cell={(props) => (
              <td>{props.dataItem.paidDate ? formatDate(props.dataItem.paidDate) : '-'}</td>
            )}
          />
        </KendoGrid>
      </Card>
    </div>
  );
};

export default AllPayments;