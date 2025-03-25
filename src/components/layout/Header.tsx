
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { UserCircle, LogOut, Settings } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { logout } from '../../store/slices/authSlice';
import { RootState } from '../../store';
import { useToast } from '@/hooks/use-toast';

const Header: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  return (
    <header className="h-16 fixed top-0 right-0 left-0 z-10 ml-64 bg-white/60 backdrop-blur-lg border-b border-gray-200 flex items-center px-6 animate-fade-in">
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/3b8930c0-3bd9-4985-af71-138a22ebe92f.png" 
            alt="GSynergy" 
            className="h-8 w-auto"
          />
        </div>
        
        <div className="flex items-center">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 transition-colors outline-none">
                <UserCircle className="w-5 h-5" />
                <span>{user.email}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500 hover:text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button 
              onClick={() => navigate('/login')} 
              className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
            >
              <UserCircle className="w-5 h-5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
