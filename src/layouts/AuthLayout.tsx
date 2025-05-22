import { Outlet } from 'react-router-dom';
import { School } from 'lucide-react';
import { LayoutProps } from '../types/layout.types';

const AuthLayout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <School size={48} className="text-primary" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Class Management System
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Admin Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;