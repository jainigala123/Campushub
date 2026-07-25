import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isOrganizer = user.role === 'organizer' || user.name?.includes('Club Lead');

  // If page is for organizers only and user is a student -> redirect to student dashboard
  if (allowedRole === 'organizer' && !isOrganizer) {
    return <Navigate to="/dashboard" replace />;
  }

  // If page is for students only and user is an organizer -> redirect to manager portal
  if (allowedRole === 'student' && isOrganizer) {
    return <Navigate to="/manager/dashboard" replace />;
  }

  return children;
}
