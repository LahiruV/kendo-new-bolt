import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Users, 
  BookOpen, 
  DollarSign,
  ArrowUpRight,
} from 'lucide-react';
import { 
  Chart, 
  ChartSeries, 
  ChartSeriesItem, 
  ChartCategoryAxis, 
  ChartCategoryAxisItem,
  ChartLegend,
  ChartTooltip,
  ChartTitle
} from '@progress/kendo-react-charts';
import 'hammerjs';

import { RootState } from '../store';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import KendoGrid from '../components/ui/KendoGrid';
import KendoButton from '../components/ui/KendoButton';
import { GridColumn } from '@progress/kendo-react-grid';
import { formatCurrency, getMonths } from '../utils/dateUtils';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { classes } = useSelector((state: RootState) => state.classes);
  const { students } = useSelector((state: RootState) => state.students);
  const { payments } = useSelector((state: RootState) => state.payments);

  // Calculate statistics
  const totalStudents = students.length;
  const activeStudents = students.filter(s => s.isActive).length;
  const totalClasses = classes.length;
  
  const totalPayments = payments.filter(p => p.isPaid).reduce((sum, payment) => sum + payment.amount, 0);
  const pendingPayments = payments.filter(p => !p.isPaid).reduce((sum, payment) => sum + payment.amount, 0);

  // Calculate class-wise student distribution
  const classStudentCounts = classes.map(cls => {
    const studentCount = students.filter(s => s.classId === cls.id).length;
    return {
      classId: cls.id,
      className: cls.name,
      studentCount
    };
  });

  // Calculate monthly payment statistics
  const months = getMonths();
  const monthlyPaymentStats = months.map(month => {
    const monthPayments = payments.filter(p => p.month === month);
    const paid = monthPayments.filter(p => p.isPaid).length;
    const unpaid = monthPayments.filter(p => !p.isPaid).length;
    
    return {
      month,
      paid,
      unpaid
    };
  });

  // Monthly revenue data
  const monthlyRevenueData = months.map(month => {
    const revenue = payments
      .filter(p => p.month === month && p.isPaid)
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    return revenue;
  });

  return (
    <div className="animate-fade-in">
      <PageHeader 
        title="Dashboard"
        subtitle="Overview of your class management system"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div onClick={() => navigate('/students/all')} className="cursor-pointer">
          <StatCard 
            title="Total Students" 
            value={totalStudents} 
            icon={<Users size={20} />}
            trend={{ value: 12, isPositive: true }}
            color="primary"
          />
        </div>
        
        <StatCard 
          title="Active Students" 
          value={activeStudents} 
          icon={<Users size={20} />}
          trend={{ value: 8, isPositive: true }}
          color="success"
        />
        
        <StatCard 
          title="Total Classes" 
          value={totalClasses} 
          icon={<BookOpen size={20} />}
          color="secondary"
        />
        
        <StatCard 
          title="Total Revenue" 
          value={formatCurrency(totalPayments)} 
          icon={<DollarSign size={20} />}
          trend={{ value: 15, isPositive: true }}
          color="accent"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card title="Monthly Revenue" subtitle="Revenue collected per month">
          <div className="h-80">
            <Chart>
              <ChartTitle text="Monthly Revenue" />
              <ChartLegend position="top" orientation="horizontal" />
              <ChartCategoryAxis>
                <ChartCategoryAxisItem categories={months} title={{ text: 'Month' }} />
              </ChartCategoryAxis>
              <ChartSeries>
                <ChartSeriesItem 
                  type="column" 
                  data={monthlyRevenueData} 
                  name="Revenue" 
                  color="#2D62ED"
                />
              </ChartSeries>
              <ChartTooltip format="${0}" />
            </Chart>
          </div>
        </Card>
        
        <Card title="Payment Status" subtitle="Paid vs unpaid status by month">
          <div className="h-80">
            <Chart>
              <ChartTitle text="Payment Status by Month" />
              <ChartLegend position="top" orientation="horizontal" />
              <ChartCategoryAxis>
                <ChartCategoryAxisItem categories={months.slice(0, 6)} title={{ text: 'Month' }} />
              </ChartCategoryAxis>
              <ChartSeries>
                <ChartSeriesItem 
                  type="column" 
                  data={monthlyPaymentStats.slice(0, 6).map(stat => stat.paid)} 
                  name="Paid" 
                  color="#4CAF50" 
                  stack="status"
                />
                <ChartSeriesItem 
                  type="column" 
                  data={monthlyPaymentStats.slice(0, 6).map(stat => stat.unpaid)} 
                  name="Unpaid" 
                  color="#F44336" 
                  stack="status"
                />
              </ChartSeries>
              <ChartTooltip format="{0} students" />
            </Chart>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card 
          title="Recent Students" 
          subtitle="Latest enrolled students"
          footer={
            <div className="flex justify-end">
              <KendoButton 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/students/all')}
                icon={<ArrowUpRight size={16} />}
              >
                View All Students
              </KendoButton>
            </div>
          }
        >
          <KendoGrid
            data={students.slice(0, 5)}
            gridHeight={300}
            pageSize={5}
          >
            <GridColumn field="name" title="Student Name" />
            <GridColumn
              field="classId"
              title="Class"
              cell={(props) => {
                const classObj = classes.find(c => c.id === props.dataItem.classId);
                return <td>{classObj?.name || 'Unknown'}</td>;
              }}
            />
            <GridColumn
              field="isActive"
              title="Status"
              width="100px"
              cell={(props) => (
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    props.dataItem.isActive ? 'bg-success-100 text-success-800' : 'bg-error-100 text-error-800'
                  }`}>
                    {props.dataItem.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
              )}
            />
          </KendoGrid>
        </Card>
        
        <Card 
          title="Students per Class" 
          subtitle="Distribution of students across classes"
          footer={
            <div className="flex justify-end">
              <KendoButton 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/classes/all')}
                icon={<ArrowUpRight size={16} />}
              >
                View All Classes
              </KendoButton>
            </div>
          }
        >
          <KendoGrid
            data={classStudentCounts}
            gridHeight={300}
            pageSize={5}
          >
            <GridColumn field="className" title="Class Name" />
            <GridColumn field="studentCount" title="Students" width="120px" />
          </KendoGrid>
        </Card>
      </div>
        
      <div className="grid grid-cols-1 mt-6">
        <Card 
          title="Recent Payments" 
          subtitle="Latest student payments"
          footer={
            <div className="flex justify-end">
              <KendoButton 
                onClick={() => navigate('/payments/all')}
                variant="outline" 
                size="sm"
                icon={<ArrowUpRight size={16} />}
              >
                View All Payments
              </KendoButton>
            </div>
          }
        >
          <KendoGrid
            data={payments.filter(p => p.isPaid).slice(0, 5)}
            gridHeight={300}
            pageSize={5}
          >
            <GridColumn
              field="studentId"
              title="Student"
              cell={(props) => {
                const student = students.find(s => s.id === props.dataItem.studentId);
                return <td>{student?.name || 'Unknown'}</td>;
              }}
            />
            <GridColumn field="month" title="Month" width="120px" />
            <GridColumn
              field="amount"
              title="Amount"
              width="100px"
              cell={(props) => (
                <td>{formatCurrency(props.dataItem.amount)}</td>
              )}
            />
          </KendoGrid>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;