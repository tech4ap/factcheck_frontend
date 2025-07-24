import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navigation from './components/Navigation';
import Login from './components/Login';
import Upload from './components/Upload';
import MessagesList from './components/MessagesList';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <Routes>
            <Route path="/login" element={<div className='pt-16'><Login /></div>} />
            <Route
              path="/upload"
              element={
                <PrivateRoute>
                  <div className="pt-16">
                    <Upload />
                  </div>
                </PrivateRoute>
              }
            />
            <Route
              path="/messages"
              element={
                <PrivateRoute>
                  <div className="pt-16">
                    <MessagesList />
                  </div>
                </PrivateRoute>
              }
            />
            <Route path="/" element={<Navigate to="/upload" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;