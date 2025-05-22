import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, User, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@progress/kendo-react-buttons';

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar, sidebarCollapsed }) => {
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return 'Dashboard';
      case '/classes/create':
        return 'Manage Classes';
      case '/students/create':
        return 'Manage Students';
      case '/payments':
        return 'Payment Management';
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-neutral-200 flex items-center px-4 sticky top-0 z-20">
      <Button 
        icon={sidebarCollapsed ? ChevronRight : ChevronLeft} 
        onClick={toggleSidebar}
        className="mr-4 k-button k-button-md bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-100"
        title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      />

      <h1 className="text-xl font-semibold text-neutral-800">{getPageTitle()}</h1>
      
      <div className="ml-auto flex items-center space-x-4">
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-neutral-600 hover:bg-neutral-100 transition-colors">
          <Bell size={20} />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
            <User size={20} className="text-primary-600" />
          </div>
          <span className="hidden md:inline text-sm font-medium">Admin User</span>
        </div>
      </div>
    </header>
  );
};

export default Header;