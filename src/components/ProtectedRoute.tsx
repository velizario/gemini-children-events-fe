// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated, useUserRole } from '../stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'PARENT' | 'ORGANIZER' | 'ADMIN'>; // Roles that can access
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const isAuthenticated = useIsAuthenticated();
  const userRole = useUserRole();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If allowedRoles are specified, check if the user's role is included
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
     // User is authenticated but does not have the required role
     // Redirect to an unauthorized page or home page
     // You might want to create a specific 'Unauthorized' page
     console.warn(`User with role ${userRole} tried to access a route restricted to ${allowedRoles.join(', ')}`);
     return <Navigate to="/" replace />; // Or navigate('/unauthorized');
   }


  return <>{children}</>; // User is authenticated and has the required role (if specified)
};

export default ProtectedRoute;