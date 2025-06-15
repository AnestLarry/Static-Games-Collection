import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';

const App: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar isCollapsed={isSidebarCollapsed} setIsCollapsed={setIsSidebarCollapsed} />
        <main className={`flex-1 p-6 bg-gray-100 transition-all duration-300 ease-in-out`}>
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default App;
