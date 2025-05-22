import { useState } from 'react';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { Card } from '@progress/kendo-react-layout';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { z } from 'zod';
import { toast } from 'sonner';
import { RootState } from '../../store';
import { addClass } from '../../store/slices/classesSlice';
import { ClassFormValues } from '../../types/class.types';
import PageHeader from '../../components/common/PageHeader';
import AppButton from '../../components/ui/AppButton';
import AppFormInput from '../../components/ui/AppFormInput';
import AppDatePicker from '../../components/ui/AppDatePicker';

const classSchema = z.object({
  name: z.string().min(3, 'Class name must be at least 3 characters'),
  monthlyFee: z
    .number({ invalid_type_error: 'Monthly fee must be a number' })
    .min(0, 'Monthly fee must be a positive number'),
  startDate: z.date(),
});

const CreateClass = () => {
  const dispatch = useDispatch();
  const { classes } = useSelector((state: RootState) => state.classes);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: ClassFormValues) => {
    setIsSubmitting(true);
    
    try {
      dispatch(
        addClass({
          name: values.name,
          monthlyFee: values.monthlyFee,
          startDate: values.startDate.toISOString(),
        })
      );
      
      toast.success('Class created successfully');
      
      // Reset form (This will be handled by the Form component's onSubmitSuccess)
    } catch (error) {
      toast.error('Failed to create class');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format date for display in grid
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div>
      <PageHeader 
        title="Create Class" 
        subtitle="Create a new class with monthly fee" 
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Create Class Form */}
        <Card className="p-6 lg:col-span-1">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Class Details</h2>
          
          <Form
            onSubmit={handleSubmit}
            initialValues={{
              name: '',
              monthlyFee: 0,
              startDate: new Date(),
            }}
            render={(formRenderProps) => (
              <FormElement>
                <Field
                  name="name"
                  validator={(value) => {
                    try {
                      classSchema.shape.name.parse(value);
                      return '';
                    } catch (error) {
                      return (error as z.ZodError).errors[0].message;
                    }
                  }}
                  component={AppFormInput}
                  label="Class Name"
                  required
                />

                <Field
                  name="monthlyFee"
                  validator={(value) => {
                    try {
                      classSchema.shape.monthlyFee.parse(Number(value));
                      return '';
                    } catch (error) {
                      return (error as z.ZodError).errors[0].message;
                    }
                  }}
                  component={AppFormInput}
                  label="Monthly Fee"
                  type="number"
                  required
                />

                <Field
                  name="startDate"
                  validator={(value) => {
                    try {
                      classSchema.shape.startDate.parse(value);
                      return '';
                    } catch (error) {
                      return (error as z.ZodError).errors[0].message;
                    }
                  }}
                  component={AppDatePicker}
                  label="Start Date"
                  required
                />

                <div className="mt-6">
                  <AppButton
                    type="submit"
                    disabled={!formRenderProps.valid || isSubmitting}
                  >
                    {isSubmitting ? 'Creating...' : 'Create Class'}
                  </AppButton>
                </div>
              </FormElement>
            )}
          />
        </Card>

        {/* Classes List */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold text-gray-800">
            Classes ({classes.length})
          </h2>
          
          <Grid
            data={classes}
            style={{
              height: 'auto',
            }}
          >
            <GridColumn field="name" title="Class Name" />
            <GridColumn 
              field="monthlyFee" 
              title="Monthly Fee" 
              cell={(props) => (
                <td>${props.dataItem[props.field]}</td>
              )}
            />
            <GridColumn 
              field="startDate" 
              title="Start Date"
              cell={(props) => (
                <td>{formatDate(props.dataItem[props.field])}</td>
              )}
            />
          </Grid>
          
          {classes.length === 0 && (
            <p className="mt-4 text-center text-gray-500">
              No classes created yet. Create your first class using the form.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default CreateClass;