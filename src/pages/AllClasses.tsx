import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { formatDate, formatCurrency } from '../utils/dateUtils';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import KendoGrid from '../components/ui/KendoGrid';
import { GridColumn } from '@progress/kendo-react-grid';

const AllClasses: React.FC = () => {
  const { classes } = useSelector((state: RootState) => state.classes);
  const { students } = useSelector((state: RootState) => state.students);

  const classesWithStats = classes.map(cls => ({
    ...cls,
    studentCount: students.filter(s => s.classId === cls.id).length,
    activeStudents: students.filter(s => s.classId === cls.id && s.isActive).length,
  }));

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="All Classes"
        subtitle="Comprehensive view of all classes and their statistics"
      />

      <Card>
        <KendoGrid
          data={classesWithStats}
          sortable={true}
          filterable={true}
          pageable={{ pageSize: 10 }}
        >
          <GridColumn field="name" title="Class Name" filterable={true} />
          <GridColumn
            field="fee"
            title="Fee"
            width="120px"
            cell={(props) => (
              <td>{formatCurrency(props.dataItem.fee)}</td>
            )}
          />
          <GridColumn
            field="studentCount"
            title="Total Students"
            width="130px"
          />
          <GridColumn
            field="activeStudents"
            title="Active Students"
            width="130px"
          />
          <GridColumn
            field="createdAt"
            title="Created On"
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

export default AllClasses;