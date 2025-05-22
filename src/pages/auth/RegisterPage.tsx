import { useState } from 'react';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import { toast } from 'sonner';
import { registerSuccess } from '../../store/slices/authSlice';
import AppButton from '../../components/ui/AppButton';
import AppFormInput from '../../components/ui/AppFormInput';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const RegisterPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: RegisterFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      dispatch(
        registerSuccess({
          id: '1',
          email: values.email,
          name: values.name,
        })
      );
      toast.success('Registration successful');
      navigate('/dashboard');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        render={(formRenderProps) => (
          <FormElement>
            <Field
              name="name"
              validator={(value) => {
                try {
                  registerSchema.shape.name.parse(value);
                  return '';
                } catch (error) {
                  return (error as z.ZodError).errors[0].message;
                }
              }}
              component={AppFormInput}
              label="Full Name"
              required
            />

            <Field
              name="email"
              validator={(value) => {
                try {
                  registerSchema.shape.email.parse(value);
                  return '';
                } catch (error) {
                  return (error as z.ZodError).errors[0].message;
                }
              }}
              component={AppFormInput}
              label="Email Address"
              type="email"
              required
            />

            <Field
              name="password"
              validator={(value) => {
                try {
                  registerSchema.shape.password.parse(value);
                  return '';
                } catch (error) {
                  return (error as z.ZodError).errors[0].message;
                }
              }}
              component={AppFormInput}
              label="Password"
              type="password"
              required
            />

            <Field
              name="confirmPassword"
              validator={(value, formValues) => {
                try {
                  registerSchema.shape.confirmPassword.parse(value);
                  if (value !== formValues.password) {
                    return 'Passwords do not match';
                  }
                  return '';
                } catch (error) {
                  return (error as z.ZodError).errors[0].message;
                }
              }}
              component={AppFormInput}
              label="Confirm Password"
              type="password"
              required
            />

            <div className="mt-6">
              <AppButton
                type="submit"
                disabled={!formRenderProps.valid || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Creating account...' : 'Create account'}
              </AppButton>
            </div>
          </FormElement>
        )}
      />

      <div className="mt-4 text-center text-sm">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-primary font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
};

export default RegisterPage;