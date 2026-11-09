import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Layout components
import Navbar from './components/Navbar';
import AdminSidebar from './components/AdminSidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Icons (for admin top bar hamburger)
import { Menu } from 'lucide-react';

// Pages
import Home from './pages/Home';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import MyEvents from './pages/MyEvents';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

// ─────────────────────────────────────────────
// Admin Layout Wrapper
// Used for ALL pages when user.role === 'admin'
// Renders the persistent sidebar + content area
// ─────────────────────────────────────────────
function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F8FAFC] text-[#172033]">
      {/* Persistent Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area offset by sidebar width on desktop */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Slim top bar with mobile hamburger */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 flex items-center gap-3 shadow-sm lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:text-[#172033] hover:bg-slate-100 transition-colors"
            aria-label="Open Admin Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm font-bold text-[#172033]">
            Event<span className="text-brand-600">Hub</span>
            <span className="ml-2 text-[10px] font-black uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
              Admin
            </span>
          </span>
        </div>

        {/* Page content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Public Layout Wrapper
// Used for all pages when user is visitor / organizer
// ─────────────────────────────────────────────
function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#172033]">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  );
}

// ─────────────────────────────────────────────
// App Layout — picks Admin or Public layout
// ─────────────────────────────────────────────
function AppLayout() {
  const { user, loading } = useAuth();
  const isAdmin = user?.role === 'admin';

  // While verifying token, render nothing to avoid layout flash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <span className="w-8 h-8 border-4 border-brand-600 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  const routes = (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin-only */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Authenticated (organizer + admin) */}
      <Route
        path="/events/create"
        element={
          <ProtectedRoute>
            <CreateEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/edit/:id"
        element={
          <ProtectedRoute>
            <EditEvent />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-events"
        element={
          <ProtectedRoute>
            <MyEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  if (isAdmin) {
    return <AdminLayout>{routes}</AdminLayout>;
  }

  return <PublicLayout>{routes}</PublicLayout>;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppLayout />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
