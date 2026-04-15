import { Navigate } from 'react-router';
import { useAuth, UserRole } from '../contexts/AuthContext';
import { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  requireAuth?: boolean;
}

export function RoleGuard({ children, allowedRoles, requireAuth = true }: RoleGuardProps) {
  const { user, isAuthenticated } = useAuth();

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
