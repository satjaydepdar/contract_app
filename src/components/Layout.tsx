import React from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, MessageSquare } from 'lucide-react';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Contracts', path: '/contracts' },
    { name: 'My Contracts', path: '/my-contracts' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Chat with Docs', path: '/doc-chat', icon: MessageSquare },
    { name: 'Settings', path: '/settings' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-purple-900 to-blue-900 transform ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-black/10">
          <h1 className="text-xl font-bold text-white">ContractPro</h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>
        <nav className="mt-8">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex items-center w-full px-6 py-3 text-gray-300 hover:bg-white/10 hover:text-white transition-colors ${
                location.pathname === item.path ? 'bg-white/10 text-white' : ''
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4 mr-2" />}
              {item.name}
            </button>
          ))}
        </nav>
        <button
          onClick={() => handleNavigation('/login')}
          className="absolute bottom-8 left-6 flex items-center text-gray-300 hover:text-white"
        >
          <LogOut className="mr-2" size={20} />
          Logout
        </button>
      </div>

      <div className="lg:pl-64">
        <div className="sticky top-0 z-40 flex items-center justify-between h-16 px-4 bg-white shadow-sm lg:px-8">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden text-gray-600 hover:text-gray-900"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-blue-600" />
            <span className="text-sm font-medium text-gray-700">John Doe</span>
          </div>
        </div>
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}