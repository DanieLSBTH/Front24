import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element, allowedRoles, user }) => {
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/loginform" />;
  }

  return element;
};

export default ProtectedRoute;
