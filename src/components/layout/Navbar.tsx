
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Store, ShoppingBag, BarChart3, LineChart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const navItems = [
  { path: '/stores', name: 'Stores', icon: <Store className="w-5 h-5" /> },
  { path: '/skus', name: 'SKUs', icon: <ShoppingBag className="w-5 h-5" /> },
  { path: '/planning', name: 'Planning', icon: <BarChart3 className="w-5 h-5" /> },
  { path: '/chart', name: 'Chart', icon: <LineChart className="w-5 h-5" /> },
];

const Navbar: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <aside className="w-64 h-full fixed left-0 top-0 bottom-0 glass-panel bg-white/60 border-r border-gray-200 py-6 px-4 overflow-y-auto animate-slide-right">
      <div className="flex flex-col h-full">
        <div className="pb-6 mb-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">GSynergy</h2>
          <p className="text-sm text-gray-500">Data Viewer</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
              end
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="pt-6 mt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <p>Version 1.0.0</p>
            <p className="mt-1">© {new Date().getFullYear()} GSynergy</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;
