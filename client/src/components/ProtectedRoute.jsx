import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="page container" style={{display:'flex',justifyContent:'center',alignItems:'center'}}><div className="loader">🍕</div></div>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
