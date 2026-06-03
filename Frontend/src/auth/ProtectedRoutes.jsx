import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider.jsx';

export const ProtectedRoutes = ({ children, allowedRoles }) => {
  const { isAuthed, user } = useAuth();
  if (!isAuthed) return <Navigate to="/login" replace />;
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/" replace />;
  }
  return children;
};
