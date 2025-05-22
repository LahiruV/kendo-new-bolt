import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import LoadingPage from '../components/common/LoadingPage';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ProtectedRoute from './ProtectedRoute';

// Lazy load pages to improve initial load time
const Dashboard = lazy(() => import('../pages/Dashboard'));
const CreateClass = lazy(() => import('../pages/classes/CreateClass'));
const CreateStudent = lazy(() => import('../pages/students/CreateStudent'));
const PaymentsPage = lazy(() => import('../pages/payments/PaymentsPage'));

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route path="/auth" element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Protected Admin Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route
          path="dashboard"
          element={
            <Suspense fallback={<LoadingPage />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route
          path="create-class"
          element={
            <Suspense fallback={<LoadingPage />}>
              <CreateClass />
            </Suspense>
          }
        />
        <Route
          path="create-student"
          element={
            <Suspense fallback={<LoadingPage />}>
              <CreateStudent />
            </Suspense>
          }
        />
        <Route
          path="payments"
          element={
            <Suspense fallback={<LoadingPage />}>
              <PaymentsPage />
            </Suspense>
          }
        />
      </Route>

      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;