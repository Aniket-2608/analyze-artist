
import React from 'react';
import Header from './Header';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      
      <div className="flex-1 ml-64">
        <Header />
        
        <main className="pt-24 px-8 pb-8 animate-slide-up">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
