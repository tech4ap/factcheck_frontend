import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Upload, MessageSquare, LogOut, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/upload', label: 'Upload', icon: Upload },
    { path: '/messages', label: 'Messages', icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-30 bg-white shadow-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to="/upload" className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">FactChecks</span>
            </Link>
            <div className="hidden md:flex space-x-6">
              {user && navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`inline-flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === path
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-sm text-gray-700">Welcome, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <span className="text-sm text-gray-500">&nbsp;</span>
            )}
          </div>
        </div>
      </div>
      {/* Mobile navigation */}
      {user && (
        <div className="md:hidden border-t border-gray-200">
          <div className="flex space-x-1 px-4 py-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex-1 inline-flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${location.pathname === path
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;