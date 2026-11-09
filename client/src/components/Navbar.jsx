import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Compass,
  PlusCircle,
  FolderHeart,
  LogOut,
  User,
  Menu,
  X,
  ShieldCheck,
  BarChart3,
  Sparkles,
  Eye
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const isAdmin = user && user.role === 'admin';
  const isOrganizer = user && user.role === 'organizer';

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }) =>
    `inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'text-brand-600 bg-brand-50'
        : 'text-slate-600 hover:text-[#172033] hover:bg-slate-100'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 text-base font-medium rounded-lg transition-colors ${
      isActive
        ? 'text-brand-600 bg-brand-50'
        : 'text-slate-600 hover:text-[#172033] hover:bg-slate-100'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2.5 group focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-[#172033]">
                  Event<span className="text-brand-600">Hub</span>
                </span>
              </div>
            </Link>

            {/* If visitor (not logged in), show Mode Visiteur pill */}
            {!isAuthenticated && (
              <span className="hidden lg:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
                <Eye className="w-3 h-3 text-slate-400" />
                Mode Visiteur (Lecture Seule)
              </span>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/events" className={navLinkClass}>
              <Compass className="w-4 h-4" />
              Explore Events
            </NavLink>

            {/* Authenticated Links (Organizer & Admin) */}
            {isAuthenticated && (
              <NavLink to="/my-events" className={navLinkClass}>
                <FolderHeart className="w-4 h-4" />
                My Events
              </NavLink>
            )}

            {/* Admin-only Link */}
            {isAdmin && (
              <NavLink to="/admin/dashboard" className={navLinkClass}>
                <BarChart3 className="w-4 h-4 text-brand-600" />
                <span className="text-brand-700 font-bold">Admin Dashboard</span>
              </NavLink>
            )}
          </nav>

          {/* Desktop Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Event Creation Button (Organizer and Admin) */}
                <Link
                  to="/events/create"
                  className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all"
                >
                  <PlusCircle className="w-4 h-4" />
                  Create Event
                </Link>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-100 focus:outline-none transition-colors border border-transparent hover:border-slate-200"
                    title={user?.name}
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold flex items-center justify-center text-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="flex items-center gap-1.5 text-left">
                      <span className="text-sm font-medium text-slate-700 max-w-[110px] truncate">
                        {user?.name}
                      </span>
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-brand-100 text-brand-800 border border-brand-200">
                          <ShieldCheck className="w-3 h-3 text-brand-600" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-brand-100 text-brand-800 border border-brand-200">
                          <Sparkles className="w-3 h-3 text-brand-600" />
                          Organizer
                        </span>
                      )}
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                      onMouseLeave={() => setUserMenuOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs text-slate-400 font-medium">Role</p>
                          {isAdmin ? (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-brand-100 text-brand-800 border border-brand-200">
                              Admin
                            </span>
                          ) : (
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-brand-100 text-brand-800 border border-brand-200">
                              Event Organizer
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-[#172033] truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate">{user?.email}</p>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-brand-700 bg-brand-50 hover:bg-brand-100 font-semibold transition-colors"
                        >
                          <BarChart3 className="w-4 h-4 text-brand-600" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/events/create"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                      >
                        <PlusCircle className="w-4 h-4" />
                        Create New Event
                      </Link>

                      <Link
                        to="/my-events"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                      >
                        <FolderHeart className="w-4 h-4" />
                        Manage My Events
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-brand-600 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>

                      <div className="border-t border-slate-100 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-[#172033] hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-sm transition-all"
                >
                  Join as Organizer
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-[#172033] hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top duration-200">
          {!isAuthenticated && (
            <div className="p-2.5 mb-2 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-400" />
              <span>Mode Visiteur (Lecture Seule)</span>
            </div>
          )}

          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            Home
          </NavLink>
          <NavLink
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileNavLinkClass}
          >
            <Compass className="w-5 h-5" />
            Explore Events
          </NavLink>

          {isAuthenticated && (
            <>
              {isAdmin && (
                <NavLink
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileNavLinkClass}
                >
                  <BarChart3 className="w-5 h-5 text-brand-600" />
                  Admin Dashboard
                </NavLink>
              )}
              <NavLink
                to="/my-events"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                <FolderHeart className="w-5 h-5" />
                My Events
              </NavLink>
              <NavLink
                to="/events/create"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                <PlusCircle className="w-5 h-5" />
                Create New Event
              </NavLink>
              <NavLink
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className={mobileNavLinkClass}
              >
                <User className="w-5 h-5" />
                My Profile ({user?.name} • {user?.role})
              </NavLink>
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-base font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors text-left"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            </>
          )}

          {!isAuthenticated && (
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 border border-slate-200 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 bg-brand-600 text-sm font-semibold rounded-xl text-white hover:bg-brand-700 transition-colors shadow-sm"
              >
                Join as Organizer
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
