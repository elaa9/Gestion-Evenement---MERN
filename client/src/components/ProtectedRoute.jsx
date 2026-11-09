import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import { ShieldAlert } from 'lucide-react';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner text="Checking authorization..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If route is restricted to admins only and user is not admin
  if (adminOnly && user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto my-16 px-4 text-center">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-[#172033]">Access Denied</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            This area is restricted to <strong>Platform Administrators</strong>. Only administrators are authorized to create events and access platform analytics.
          </p>
          <Navigate to="/events" replace />
        </div>
      </div>
    );
  }

  return children;
}
