import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

/** Réserve une page aux organisations connectées. */
export default function ProtectedRoute({ children }) {
  const { session } = useAuth();
  const location = useLocation();
  if (!session || session.role !== 'ORGANISATION') {
    return <Navigate to="/organisation/connexion" replace state={{ from: location.pathname }} />;
  }
  return children;
}
