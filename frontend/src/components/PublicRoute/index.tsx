import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface PublicRouteProps {
  children?: React.ReactElement;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/profile" replace />;
  }

  if (children) {
    return children;
  }

  return <Outlet />;
};

export default PublicRoute;
