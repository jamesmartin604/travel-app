import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = () => {
  const { user } = useAuth();
  
  if (!user) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;