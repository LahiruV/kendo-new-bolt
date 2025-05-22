import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, GraduationCap, BookOpen, CreditCard, Settings } from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
}

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/classes/create', icon: BookOpen, label: 'Manage Classes' },
  { path: '/students/create', icon: GraduationCap, label: 'Manage Students' },
  { path: '/payments', icon: CreditCard, label: 'Payments' },
];

const Sidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  return (
    <aside 
      className={`bg-white border-r border-neutral-200 shadow-lg transition-all duration-300 ease-in-out ${
        collapsed ? 'w-20' : 'w-64'
      } h-screen fixed z-10 flex flex-col overflow-hidden`}
    >
      <div className="flex items-center justify-center h-16 border-b border-neutral-200 bg-primary-500/5 p-4">
        {!collapsed ? (
          <h1 className="text-2xl font-bold text-primary-600">
            Zenra Tuition
          </h1>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">ZT</span>
          </div>
        )}
      </div>
      
      <nav className="flex-1 py-6 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path}
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive 
                    ? 'bg-primary-100 text-primary-600 shadow-sm hover:bg-primary-200' 
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-primary-600'
                  }
                `}
              >
                <item.icon size={20} className="flex-shrink-0" />
                {!collapsed && (
                  <span className="font-medium truncate">{item.label}</span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-3 border-t border-neutral-200 bg-neutral-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-200 flex items-center justify-center">
            <span className="text-neutral-600 font-medium">A</span>
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">Admin User</p>
              <p className="text-xs text-neutral-500 truncate">admin@example.com</p>
            </div>
          )}
        </div>
        <div className="mt-3">
          <NavLink 
            to="/settings"
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200
              ${collapsed ? 'justify-center' : ''}
              ${isActive 
                ? 'bg-neutral-200 text-neutral-800' 
                : 'text-neutral-600 hover:bg-neutral-100'
              }
            `}
          >
            <Settings size={18} className="flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Settings</span>}
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;