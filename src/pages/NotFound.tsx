import React from 'react';
import { Link } from 'react-router-dom';
import KendoButton from '../components/ui/KendoButton';
import { Home } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-9xl font-bold text-primary-300">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-neutral-800">Page Not Found</h2>
      <p className="mt-2 text-neutral-600 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8">
        <Link to="/dashboard">
          <KendoButton variant="primary" icon={Home}>
            Back to Dashboard
          </KendoButton>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;