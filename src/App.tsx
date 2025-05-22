import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import CreateClass from './pages/CreateClass';
import AllClasses from './pages/AllClasses';
import CreateStudent from './pages/CreateStudent';
import AllStudents from './pages/AllStudents';
import PaymentManagement from './pages/PaymentManagement';
import AllPayments from './pages/AllPayments';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="classes/create" element={<CreateClass />} />
        <Route path="classes/all" element={<AllClasses />} />
        <Route path="students/create" element={<CreateStudent />} />
        <Route path="students/all" element={<AllStudents />} />
        <Route path="payments" element={<PaymentManagement />} />
        <Route path="payments/all" element={<AllPayments />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;