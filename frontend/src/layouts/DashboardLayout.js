import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { 
  Home, 
  MapPin, 
  FileText, 
  Upload, 
  User, 
  LogOut, 
  Menu,
  X,
  GraduationCap
} from 'lucide-react';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { student, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/journey', icon: MapPin, label: 'Admission Journey' },
    { path: '/forms/personal', icon: FileText, label: 'Forms' },
    { path: '/documents', icon: Upload, label: 'Documents' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const mobileNavItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/journey', icon: MapPin, label: 'Journey' },
    { path: '/documents', icon: Upload, label: 'Upload' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-white border-r border-gray-200">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-6 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-900">AdmitTrack</span>
          </div>
          
          <nav className="flex-1 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                             (item.path !== '/' && location.pathname.startsWith(item.path));
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  data-testid={`nav-${item.label.toLowerCase().replace(' ', '-')}`}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="px-3 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 mb-4">
              <p className="text-xs font-medium text-blue-900 mb-1">Welcome back,</p>
              <p className="text-sm font-bold text-blue-900">{student?.full_name}</p>
            </div>
            
            <Button
              onClick={handleLogout}
              data-testid="logout-btn"
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="ml-2 text-lg font-bold text-gray-900">AdmitTrack</span>
          </div>
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {sidebarOpen && (
          <div className="bg-white border-t border-gray-200 px-4 py-3">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 mb-3">
              <p className="text-xs font-medium text-blue-900">Welcome,</p>
              <p className="text-sm font-bold text-blue-900">{student?.full_name}</p>
            </div>
            
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Link>
                );
              })}
              
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
        <div className="grid grid-cols-4 h-16">
          {mobileNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                className={`flex flex-col items-center justify-center space-y-1 ${
                  isActive ? 'text-blue-600' : 'text-gray-600'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default DashboardLayout;