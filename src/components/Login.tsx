import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { CheckCircle, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const { user, login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dummyUsers = [
    { email: 'admin@factchecks.io', password: 'admin123', name: 'Admin User' },
    { email: 'john.doe@example.com', password: 'password', name: 'John Doe' },
    { email: 'jane.smith@example.com', password: 'password', name: 'Jane Smith' },
    { email: 'test@test.com', password: 'test', name: 'Test User' },
  ];

  if (user) {
    return <Navigate to="/upload" replace />;
  }

  const handleDummyUserLogin = (dummyUser: typeof dummyUsers[0]) => {
    setEmail(dummyUser.email);
    setPassword(dummyUser.password);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    const success = await login(email, password);
    if (!success) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-500 via-blue-400 to-purple-400">
      <div className="w-[95%] max-w-3xl bg-white/90 rounded-2xl shadow-2xl p-2 sm:p-8 md:p-10 flex flex-col items-center overflow-y-auto max-h-screen">
        <div className="flex flex-col items-center mb-6 w-full">
          <CheckCircle className="h-12 w-12 sm:h-14 sm:w-14 text-indigo-600 mb-2" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-1 text-center">Sign in to FactChecks</h2>
          <p className="text-xs sm:text-sm text-gray-600 text-center">Enter any email and password to continue</p>
        </div>
        <form className="w-full space-y-4 sm:space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email address</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm text-xs sm:text-base"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm text-xs sm:text-base"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 px-4 py-3 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <span className="text-xs sm:text-sm">{error}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 sm:py-3 px-4 border border-transparent text-sm sm:text-base font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="w-full mt-4 sm:mt-6 text-center">
          <p className="text-base sm:text-lg font-semibold text-gray-700 mb-2">Demo Users (click to auto-fill):</p>
          <div className="flex flex-col gap-2">
            {dummyUsers.map((user, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleDummyUserLogin(user)}
                className="text-base sm:text-lg text-indigo-700 hover:text-indigo-900 hover:underline transition-colors font-bold py-1"
              >
                {user.email} / {user.password}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-3">Or use any email/password combination</p>
        </div>
      </div>
    </div>
  );
};

export default Login;