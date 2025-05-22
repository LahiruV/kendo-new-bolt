import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { z } from 'zod';
import { Field } from '@progress/kendo-react-form';
import { addClass, updateClass } from '../store/slices/classesSlice';
import { RootState } from '../store';
import { Class } from '../types';
import { formatDate, formatCurrency } from '../utils/dateUtils';

import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import KendoForm, { FormInput, FormNumericTextBox } from '../components/ui/KendoForm';
import KendoButton from '../components/ui/KendoButton';
import KendoGrid from '../components/ui/KendoGrid';
import { GridColumn } from '@progress/kendo-react-grid';

const classValidationSchema = z.object({
  name: z.string().min(3, 'Class name must be at least 3 characters'),
  fee: z.number().min(1, 'Fee must be at least 1'),
});

const CreateClass: React.FC = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state: RootState) => state.classes);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const handleSubmit = (values: any) => {
    const newClass: Class = {
      id: editingClass?.id || Date.now().toString(),
      name: values.name,
      fee: values.fee,
      createdAt: editingClass?.createdAt || new Date().toISOString(),
    };

    if (editingClass) {
      dispatch(updateClass(newClass));
      toast.success('Class updated successfully!');
      setEditingClass(null);
    } else {
      dispatch(addClass(newClass));
      toast.success('Class created successfully!');
    }
  };

  const handleEdit = (classData: Class) => {
    setEditingClass(classData);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Manage Classes"
        subtitle="Create and manage class information"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title={editingClass ? 'Edit Class' : 'Create New Class'} className="lg:col-span-1">
          <KendoForm
            initialValues={editingClass || { name: '', fee: 1000 }}
            onSubmit={handleSubmit}
            validationSchema={classValidationSchema}
          >
            {(formRenderProps) => (
              <>
                <Field
                  id="name"
                  name="name"
                  label="Class Name"
                  component={FormInput}
                />

                <Field
                  id="fee"
                  name="fee"
                  label="Class Fee"
                  component={FormNumericTextBox}
                  format="c2"
                  min={0}
                />

                <div className="mt-6">
                  <KendoButton
                    type="submit"
                    variant="primary"
                    disabled={!formRenderProps.allowSubmit}
                    className="mr-2"
                  >
                    {editingClass ? 'Update Class' : 'Create Class'}
                  </KendoButton>
                  {editingClass && (
                    <KendoButton
                      variant="outline"
                      onClick={() => setEditingClass(null)}
                    >
                      Cancel
                    </KendoButton>
                  )}
                </div>
              </>
            )}
          </KendoForm>
        </Card>

        <Card title="Class List" subtitle="All available classes" className="lg:col-span-2">
          <KendoGrid
            data={classes}
            sortable={true}
            filterable={true}
            pageable={true}
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
              field="createdAt"
              title="Created On"
              width="150px"
              cell={(props) => (
                <td>{formatDate(props.dataItem.createdAt)}</td>
              )}
            />
            <GridColumn
              width="120px"
              cell={(props) => (
                <td className="k-command-cell">
                  <KendoButton
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleEdit(props.dataItem)}
                  >
                    Edit
                  </KendoButton>
                </td>
              )}
            />
          </KendoGrid>
        </Card>
      </div>
    </div>
  );
};

export default CreateClass;