import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import { z } from 'zod';
import { addStudent, updateStudent } from '../store/slices/studentsSlice';
import { RootState } from '../store';
import { Student } from '../types';
import { formatDate, formatCurrency } from '../utils/dateUtils';
import { Field } from '@progress/kendo-react-form';

import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import KendoForm, { FormInput, FormDropDown, FormNumericTextBox, FormCheckbox } from '../components/ui/KendoForm';
import KendoButton from '../components/ui/KendoButton';
import KendoGrid from '../components/ui/KendoGrid';
import { GridColumn } from '@progress/kendo-react-grid';

const studentValidationSchema = z.object({
  name: z.string().min(3, 'Student name must be at least 3 characters'),
  parentName: z.string().min(3, 'Parent name must be at least 3 characters'),
  phoneNumber: z.string().min(7, 'Phone number must be at least 7 digits'),
  classId: z.string().min(1, 'Class is required'),
  fee: z.number().min(0, 'Fee cannot be negative'),
  isActive: z.boolean(),
});

const CreateStudent: React.FC = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state: RootState) => state.classes);
  const { students } = useSelector((state: RootState) => state.students);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [selectedClassFee, setSelectedClassFee] = useState<number>(0);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const handleClassChange = (e: any) => {
    const classId = e.value.id;
    setSelectedClassId(classId);
    
    const selectedClass = classes.find(c => c.id === classId);
    if (selectedClass) {
      setSelectedClassFee(selectedClass.fee);
    }
  };

  const handleSubmit = (values: any) => {
    const newStudent: Student = {
      id: editingStudent?.id || Date.now().toString(),
      name: values.name,
      parentName: values.parentName,
      phoneNumber: values.phoneNumber,
      isActive: values.isActive,
      classId: values.classId,
      fee: values.fee,
      createdAt: editingStudent?.createdAt || new Date().toISOString(),
    };

    if (editingStudent) {
      dispatch(updateStudent(newStudent));
      toast.success('Student updated successfully!');
      setEditingStudent(null);
    } else {
      dispatch(addStudent(newStudent));
      toast.success('Student added successfully!');
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setSelectedClassId(student.classId);
    setSelectedClassFee(student.fee);
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Manage Students"
        subtitle="Create and manage student information"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title={editingStudent ? 'Edit Student' : 'Create New Student'} className="lg:col-span-1">
          <KendoForm
            initialValues={editingStudent || { 
              name: '', 
              parentName: '', 
              phoneNumber: '', 
              classId: '', 
              fee: 0, 
              isActive: true 
            }}
            onSubmit={handleSubmit}
            validationSchema={studentValidationSchema}
          >
            {(formRenderProps) => (
              <>
                <Field
                  id="name"
                  name="name"
                  label="Student Name"
                  component={FormInput}
                />

                <Field
                  id="parentName"
                  name="parentName"
                  label="Parent's Name"
                  component={FormInput}
                />

                <Field
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number"
                  component={FormInput}
                />

                <Field
                  id="classId"
                  name="classId"
                  label="Class"
                  component={FormDropDown}
                  data={classes}
                  textField="name"
                  dataItemKey="id"
                  onChange={(e) => {
                    handleClassChange(e);
                    formRenderProps.onChange('classId', e.value.id);
                    formRenderProps.onChange('fee', e.value.fee);
                  }}
                />

                <Field
                  id="fee"
                  name="fee"
                  label="Student Fee"
                  component={FormNumericTextBox}
                  format="c2"
                  min={0}
                  value={selectedClassFee}
                  disabled={true}
                />

                <Field
                  id="isActive"
                  name="isActive"
                  label="Active Student"
                  component={FormCheckbox}
                />

                <div className="mt-6">
                  <KendoButton
                    type="submit"
                    variant="primary"
                    disabled={!formRenderProps.allowSubmit}
                    className="mr-2"
                  >
                    {editingStudent ? 'Update Student' : 'Create Student'}
                  </KendoButton>
                  {editingStudent && (
                    <KendoButton
                      variant="outline"
                      onClick={() => {
                        setEditingStudent(null);
                        setSelectedClassId('');
                        setSelectedClassFee(0);
                      }}
                    >
                      Cancel
                    </KendoButton>
                  )}
                </div>
              </>
            )}
          </KendoForm>
        </Card>

        <Card title="Student List" subtitle="All registered students" className="lg:col-span-2">
          <KendoGrid
            data={students}
            sortable={true}
            filterable={true}
            pageable={true}
          >
            <GridColumn field="name" title="Student Name" filterable={true} />
            <GridColumn field="parentName" title="Parent Name" />
            <GridColumn
              field="classId"
              title="Class"
              cell={(props) => {
                const classObj = classes.find(c => c.id === props.dataItem.classId);
                return <td>{classObj?.name || 'Unknown'}</td>;
              }}
            />
            <GridColumn
              field="fee"
              title="Fee"
              width="120px"
              cell={(props) => (
                <td>{formatCurrency(props.dataItem.fee)}</td>
              )}
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

export default CreateStudent;