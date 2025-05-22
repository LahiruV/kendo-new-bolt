import { useState } from 'react';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Card } from '@progress/kendo-react-layout';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { z } from 'zod';
import { toast } from 'sonner';
import { RootState } from '../../store';
import { addStudent } from '../../store/slices/studentsSlice';
import { StudentFormValues } from '../../types/student.types';
import PageHeader from '../../components/common/PageHeader';
import AppButton from '../../components/ui/AppButton';
import AppFormInput from '../../components/ui/AppFormInput';
import AppDropdown from '../../components/ui/AppDropdown';
import AppSwitch from '../../components/ui/AppSwitch';

const studentSchema = z.object({
  name: z.string().min(2, 'Student name must be at least 2 characters'),
  parentName: z.string().min(2, 'Parent name must be at least 2 characters'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 characters'),
  classId: z.string().min(1, 'Please select a class'),
  isActive: z.boolean(),
});

const CreateStudent = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state: RootState) => state.classes);
  const { students } = useSelector((state: RootState) => state.students);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);

  const handleSubmit = (values: StudentFormValues) => {
    setIsSubmitting(true);
    
    try {
      dispatch(
        addStudent({
          name: values.name,
          parentName: values.parentName,
          phoneNumber: values.phoneNumber,
          classId: values.classId,
          isActive: values.isActive,
        })
      );
      
      toast.success('Student created successfully');
      
      // Reset form (This will be handled by the Form component's onSubmitSuccess)
    } catch (error) {
      toast.error('Failed to create student');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClassChange = (e: any) => {
    setSelectedClass(e.value);
  };

  // Prepare classes for dropdown
  const classOptions = classes.map((c) => ({
    text: c.name,
    value: c.id,
    fee: c.monthlyFee,
  }));

  // Join student with class data for display
  const studentsWithClass = students.map((student) => {
    const studentClass = classes.find((c) => c.id === student.classId);
    return {
      ...student,
      className: studentClass?.name || 'Unknown',
      fee: studentClass?.monthlyFee || 0,
    };
  });

  return (
    <div>
      <PageHeader 
        title="Create Student" 
        subtitle="Register a new student for a class" 
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Create Student Form */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Student Details</h2>
          
          <Form
            onSubmit={handleSubmit}
            initialValues={{
              name: '',
              parentName: '',
              phoneNumber: '',
              classId: '',
              isActive: true,
            }}
            render={(formRenderProps) => (
              <FormElement>
                <Field
                  name="name"
                  validator={(value) => {
                    try {
                      studentSchema.shape.name.parse(value);
                      return '';
                    } catch (error) {
                      return (error as z.ZodError).errors[0].message;
                    }
                  }}
                  component={AppFormInput}
                  label="Student Name"
                  required
                />

                <Field
                  name="parentName"
                  validator={(value) => {
                    try {
                      studentSchema.shape.parentName.parse(value);
                      return '';
                    } catch (error) {
                      return (error as z.ZodError).errors[0].message;
                    }
                  }}
                  component={AppFormInput}
                  label="Parent Name"
                  required
                />

                <Field
                  name="phoneNumber"
                  validator={(value) => {
                    try {
                      studentSchema.shape.phoneNumber.parse(value);
                      return '';
                    } catch (error) {
                      return (error as z.ZodError).errors[0].message;
                    }
                  }}
                  component={AppFormInput}
                  label="Phone Number"
                  required
                />

                <Field
                  name="classId"
                  validator={(value) => {
                    try {
                      studentSchema.shape.classId.parse(value);
                      return '';
                    } catch (error) {
                      return (error as z.ZodError).errors[0].message;
                    }
                  }}
                  component={AppDropdown}
                  label="Class"
                  data={classOptions}
                  textField="text"
                  valueField="value"
                  onChange={handleClassChange}
                  required
                />

                {selectedClass && (
                  <div className="mb-4 mt-2">
                    <p className="text-sm text-gray-600">
                      Monthly Fee: ${selectedClass.fee}
                    </p>
                  </div>
                )}

                <Field
                  name="isActive"
                  validator={(value) => {
                    try {
                      studentSchema.shape.isActive.parse(value);
                      return '';
                    } catch (error) {
                      return (error as z.ZodError).errors[0].message;
                    }
                  }}
                  component={AppSwitch}
                  label="Active Student"
                />

                <div className="mt-6">
                  <AppButton
                    type="submit"
                    disabled={!formRenderProps.valid || isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Student'}
                  </AppButton>
                </div>
              </FormElement>
            )}
          />
        </Card>

        {/* Students List */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Students ({students.length})
          </h2>
          
          <Grid
            data={studentsWithClass}
            style={{
              height: 'auto',
            }}
          >
            <GridColumn field="name" title="Student Name" />
            <GridColumn field="parentName" title="Parent Name" />
            <GridColumn field="className" title="Class" />
            <GridColumn 
              field="fee" 
              title="Monthly Fee"
              cell={(props) => (
                <td>${props.dataItem[props.field]}</td>
              )}
            />
            <GridColumn 
              field="isActive" 
              title="Status"
              cell={(props) => (
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    props.dataItem[props.field] 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {props.dataItem[props.field] ? 'Active' : 'Inactive'}
                  </span>
                </td>
              )}
            />
          </Grid>
          
          {students.length === 0 && (
            <p className="mt-4 text-center text-gray-500">
              No students registered yet. Create your first student using the form.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CreateStudent;