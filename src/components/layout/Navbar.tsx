import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import NotificationDropdown from '@/components/notifications/NotificationDropdown';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary-600">AI Job Portal</span>
            </Link>
            <div className="hidden sm:ml-8 sm:flex sm:gap-4">
              <Link to="/jobs" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                Find Jobs
              </Link>
              {isAuthenticated && user?.role === 'employer' && (
                <Link to="/post-job" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Post a Job
                </Link>
              )}
              {isAuthenticated && (
                <Link to="/messages" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-medium">
                  Messages
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <NotificationDropdown />
            )}
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-sm text-gray-600 hover:text-primary-600">
                  {user?.full_name}
                </Link>
                <Button variant="ghost" size="sm" onClick={() => { logout(); navigate('/'); }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};