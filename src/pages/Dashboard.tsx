import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card } from '@progress/kendo-react-layout';
import {
  Chart,
  ChartSeries,
  ChartSeriesItem,
  ChartCategoryAxis,
  ChartCategoryAxisItem,
  ChartTitle,
  ChartLegend,
  ChartTooltip,
  ChartValueAxis,
  ChartValueAxisItem,
} from '@progress/kendo-react-charts';
import 'hammerjs';
import { RootState } from '../store';
import { MonthlyPayment } from '../types/payment.types';
import { Student } from '../types/student.types';
import { Class } from '../types/class.types';
import PageHeader from '../components/common/PageHeader';

const Dashboard = () => {
  const { classes } = useSelector((state: RootState) => state.classes);
  const { students } = useSelector((state: RootState) => state.students);
  const { payments } = useSelector((state: RootState) => state.payments);
  
  const [totalIncome, setTotalIncome] = useState(0);
  const [monthlyIncome, setMonthlyIncome] = useState<MonthlyPayment[]>([]);
  const [studentsPerClass, setStudentsPerClass] = useState<{ name: string; count: number }[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<{ name: string; paid: number; unpaid: number }[]>([]);
  
  useEffect(() => {
    // Calculate total yearly income
    const totalAmount = payments.reduce((sum, payment) => {
      if (payment.isPaid) {
        const classItem = classes.find((c) => c.id === payment.classId);
        return sum + (classItem?.monthlyFee || 0);
      }
      return sum;
    }, 0);
    setTotalIncome(totalAmount);

    // Calculate monthly income
    const months: Record<string, { total: number; month: number; year: number }> = {};
    payments.forEach((payment) => {
      if (payment.isPaid) {
        const key = `${payment.year}-${payment.month}`;
        const classItem = classes.find((c) => c.id === payment.classId);
        const fee = classItem?.monthlyFee || 0;
        
        if (!months[key]) {
          months[key] = { total: 0, month: payment.month, year: payment.year };
        }
        
        months[key].total += fee;
      }
    });

    const monthsArray = Object.values(months).map((item) => ({
      month: item.month,
      year: item.year,
      totalAmount: item.total,
      paidAmount: item.total,
      paidCount: 0,
      totalCount: 0,
    }));
    
    // Sort by year and month
    monthsArray.sort((a, b) => {
      if (a.year !== b.year) return a.year - b.year;
      return a.month - b.month;
    });
    
    setMonthlyIncome(monthsArray);

    // Calculate students per class
    const classCountMap = classes.reduce<Record<string, { name: string; count: number }>>(
      (acc, classItem) => {
        acc[classItem.id] = { name: classItem.name, count: 0 };
        return acc;
      },
      {}
    );

    students.forEach((student) => {
      if (classCountMap[student.classId]) {
        classCountMap[student.classId].count += 1;
      }
    });

    setStudentsPerClass(Object.values(classCountMap));

    // Calculate paid vs unpaid per class
    const paymentStatusMap = classes.reduce<
      Record<string, { name: string; paid: number; unpaid: number }>
    >((acc, classItem) => {
      acc[classItem.id] = { name: classItem.name, paid: 0, unpaid: 0 };
      return acc;
    }, {});

    // Get current month and year
    const now = new Date();
    const currentMonth = now.getMonth() + 1; // 1-12
    const currentYear = now.getFullYear();

    // Count students per class
    const classStudents: Record<string, Student[]> = {};
    students.forEach((student) => {
      if (!classStudents[student.classId]) {
        classStudents[student.classId] = [];
      }
      classStudents[student.classId].push(student);
    });

    // Count paid vs unpaid
    Object.entries(classStudents).forEach(([classId, studentsInClass]) => {
      const totalStudents = studentsInClass.length;
      
      // Find how many have paid for current month
      const paidCount = payments.filter(
        (p) =>
          p.classId === classId &&
          p.month === currentMonth &&
          p.year === currentYear &&
          p.isPaid
      ).length;
      
      if (paymentStatusMap[classId]) {
        paymentStatusMap[classId].paid = paidCount;
        paymentStatusMap[classId].unpaid = totalStudents - paidCount;
      }
    });

    setPaymentStatus(Object.values(paymentStatusMap));
  }, [classes, students, payments]);

  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your class management system"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <h3 className="mb-2 text-lg font-medium text-gray-700">Total Classes</h3>
          <p className="text-3xl font-bold text-primary">{classes.length}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="mb-2 text-lg font-medium text-gray-700">Total Students</h3>
          <p className="text-3xl font-bold text-primary">{students.length}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="mb-2 text-lg font-medium text-gray-700">Active Students</h3>
          <p className="text-3xl font-bold text-primary">
            {students.filter((s) => s.isActive).length}
          </p>
        </Card>
        
        <Card className="p-6">
          <h3 className="mb-2 text-lg font-medium text-gray-700">Total Income</h3>
          <p className="text-3xl font-bold text-primary">${totalIncome}</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Monthly Income Chart */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-700">Monthly Income</h3>
          <Chart style={{ height: 300 }}>
            <ChartTitle text="" />
            <ChartLegend position="bottom" />
            <ChartTooltip format="${0}" />
            <ChartCategoryAxis>
              <ChartCategoryAxisItem 
                categories={monthlyIncome.map(
                  (m) => `${monthNames[m.month - 1]} ${m.year}`
                )} 
              />
            </ChartCategoryAxis>
            <ChartValueAxis>
              <ChartValueAxisItem title={{ text: 'Amount ($)' }} min={0} />
            </ChartValueAxis>
            <ChartSeries>
              <ChartSeriesItem
                type="column"
                data={monthlyIncome.map((m) => m.totalAmount)}
                name="Monthly Income"
                color="#0070f3"
              />
            </ChartSeries>
          </Chart>
        </Card>

        {/* Students per Class Chart */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-700">Students per Class</h3>
          <Chart style={{ height: 300 }}>
            <ChartTitle text="" />
            <ChartLegend position="bottom" />
            <ChartTooltip format="{0} students" />
            <ChartSeries>
              <ChartSeriesItem
                type="pie"
                data={studentsPerClass.map((item) => ({
                  category: item.name,
                  value: item.count,
                }))}
                field="value"
                categoryField="category"
                colorField="color"
              />
            </ChartSeries>
          </Chart>
        </Card>

        {/* Paid vs Unpaid Chart */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-700">
            Payment Status (Current Month)
          </h3>
          <Chart style={{ height: 300 }}>
            <ChartTitle text="" />
            <ChartLegend position="bottom" />
            <ChartTooltip format="{0} students" />
            <ChartSeries>
              <ChartSeriesItem
                type="column"
                stack={true}
                data={paymentStatus.map((item) => item.paid)}
                name="Paid"
                color="#22c55e"
              />
              <ChartSeriesItem
                type="column"
                stack={true}
                data={paymentStatus.map((item) => item.unpaid)}
                name="Unpaid"
                color="#ef4444"
              />
            </ChartSeries>
            <ChartCategoryAxis>
              <ChartCategoryAxisItem 
                categories={paymentStatus.map((item) => item.name)} 
              />
            </ChartCategoryAxis>
            <ChartValueAxis>
              <ChartValueAxisItem title={{ text: 'Number of Students' }} min={0} />
            </ChartValueAxis>
          </Chart>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;