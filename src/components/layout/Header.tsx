
import React from 'react';
import { UserCircle } from 'lucide-react';

const Header: React.FC = () => {
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
          <button className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 transition-colors">
            <UserCircle className="w-5 h-5" />
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
