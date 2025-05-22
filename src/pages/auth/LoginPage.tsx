import { useState } from 'react';
import { Form, Field, FormElement } from '@progress/kendo-react-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { z } from 'zod';
import { toast } from 'sonner';
import { loginSuccess } from '../../store/slices/authSlice';
import AppButton from '../../components/ui/AppButton';
import AppFormInput from '../../components/ui/AppFormInput';

interface LoginFormValues {
  email: string;
  password: string;
}

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (values: LoginFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Demo user - in a real app, this would be an API call
      if (values.email === 'admin@example.com' && values.password === 'password') {
        dispatch(
          loginSuccess({
            id: '1',
            email: values.email,
            name: 'Admin User',
          })
        );
        toast.success('Login successful');
        navigate('/dashboard');
      } else {
        toast.error('Invalid email or password');
      }
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <Form
        onSubmit={handleSubmit}
        initialValues={{ email: '', password: '' }}
        render={(formRenderProps) => (
          <FormElement>
            <Field
              name="email"
              validator={(value) => {
                try {
                  loginSchema.shape.email.parse(value);
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
                  loginSchema.shape.password.parse(value);
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

            <div className="mt-6">
              <AppButton
                type="submit"
                disabled={!formRenderProps.valid || isSubmitting}
                className="w-full"
              >
                {isSubmitting ? 'Signing in...' : 'Sign in'}
              </AppButton>
            </div>
          </FormElement>
        )}
      />

      <div className="mt-4 text-center text-sm">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-primary font-medium">
            Register
          </Link>
        </p>
        <p className="mt-2 text-gray-500">
          Demo: admin@example.com / password
        </p>
      </div>
    </>
  );
};

export default LoginPage;