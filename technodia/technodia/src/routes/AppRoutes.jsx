import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { subscribeToAuthChanges } from '../services/authService';
import { getUserDocument } from '../services/userService';

// Pages
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Onboarding from '../pages/Onboarding';
import Dashboard from '../pages/Dashboard';

export const AppRoutes = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const data = await getUserDocument(currentUser.uid);
        setUserData(data);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Route Guards
  const ProtectedRoute = ({ children, requireOnboarding = true }) => {
    if (!user) return <Navigate to="/" replace />;
    
    const onboardingCompleted = userData?.onboardingCompleted || false;

    if (requireOnboarding && !onboardingCompleted) {
      return <Navigate to="/onboarding" replace />;
    }

    if (!requireOnboarding && onboardingCompleted) {
      return <Navigate to="/dashboard" replace />;
    }

    return children;
  };

  const PublicRoute = ({ children }) => {
    if (user) {
      const onboardingCompleted = userData?.onboardingCompleted || false;
      return <Navigate to={onboardingCompleted ? '/dashboard' : '/onboarding'} replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route 
          path="/onboarding" 
          element={
            <ProtectedRoute requireOnboarding={false}>
              <Onboarding user={user} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requireOnboarding={true}>
              <Dashboard user={user} userData={userData} />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
