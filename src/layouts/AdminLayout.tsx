import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  DrawerContent,
  DrawerSelectEvent,
} from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { useDispatch } from 'react-redux';
import { LayoutProps, DrawerItem } from '../types/layout.types';
import { logout } from '../store/slices/authSlice';
import { 
  BarChart4, 
  BookOpen, 
  CreditCard, 
  Menu, 
  UserPlus, 
  LogOut 
} from 'lucide-react';

const drawerItems: DrawerItem[] = [
  {
    text: 'Dashboard',
    icon: <BarChart4 size={20} />,
    route: '/dashboard',
    selected: true,
  },
  {
    text: 'Create Class',
    icon: <BookOpen size={20} />,
    route: '/create-class',
  },
  {
    text: 'Create Student',
    icon: <UserPlus size={20} />,
    route: '/create-student',
  },
  {
    text: 'Payments',
    icon: <CreditCard size={20} />,
    route: '/payments',
  },
];

const AdminLayout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [expanded, setExpanded] = useState(true);
  const [selectedId, setSelectedId] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive drawer
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setExpanded(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update selected item based on current route
  useEffect(() => {
    const currentPath = location.pathname;
    const itemIndex = drawerItems.findIndex(item => item.route === currentPath);
    if (itemIndex !== -1) {
      setSelectedId(itemIndex);
    }
  }, [location.pathname]);

  const handleDrawerSelect = (e: DrawerSelectEvent) => {
    setSelectedId(e.itemIndex);
    const item = drawerItems[e.itemIndex];
    navigate(item.route);
    
    if (isMobile) {
      setExpanded(false);
    }
  };

  const handleDrawerToggle = () => {
    setExpanded(!expanded);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Drawer
        expanded={expanded}
        position="start"
        mode={isMobile ? 'overlay' : 'push'}
        mini={!expanded && !isMobile}
        items={drawerItems.map((item, index) => ({
          ...item,
          selected: index === selectedId,
        }))}
        onSelect={handleDrawerSelect}
        className="border-r border-gray-200"
        item={({ props }) => {
          const { selected, text, icon } = props;
          return (
            <div
              className={`k-drawer-item px-3 py-2 flex items-center gap-3 cursor-pointer ${
                selected ? 'k-selected font-medium' : ''
              }`}
            >
              {icon}
              <span>{text}</span>
            </div>
          );
        }}
      >
        <DrawerContent>
          {/* Header */}
          <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 sticky top-0 z-10">
            <div className="flex items-center">
              <Button
                icon={<Menu size={20} />}
                look="flat"
                onClick={handleDrawerToggle}
                className="mr-4"
              />
              <h1 className="text-xl font-semibold text-gray-800">
                Class Management System
              </h1>
            </div>
            <Button
              icon={<LogOut size={18} />}
              look="flat"
              onClick={handleLogout}
              className="text-gray-600"
            >
              Logout
            </Button>
          </div>

          {/* Main Content */}
          <div className="p-6 overflow-auto" style={{ height: 'calc(100vh - 64px)' }}>
            <Outlet />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default AdminLayout;