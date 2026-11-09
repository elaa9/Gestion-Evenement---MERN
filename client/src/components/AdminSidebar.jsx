import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  LogOut,
  X,
  ChevronRight
} from 'lucide-react';

/**
 * AdminSidebar
 * Persistent sidebar shown on ALL pages when the logged-in user is an admin.
 * Receives `isOpen` and `onClose` props to support the mobile hamburger toggle.
 */
export default function AdminSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Determine active tab based on current path and search params
  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get('tab') || 'overview';
  const isDashboard = path === '/admin/dashboard' || path === '/admin';

  const isOverview = isDashboard && currentTab === 'overview';
  const isEvents = isDashboard && currentTab === 'events';
  const isReviews = isDashboard && currentTab === 'reviews';

  const navItem = (label, icon, onClick, isActive, badge) => {
    const Icon = icon;
    return (
      <button
        onClick={() => { onClick(); if (onClose) onClose(); }}
        className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${isActive
            ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 font-bold'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
          }`}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4 flex-shrink-0" />
          <span>{label}</span>
        </div>
        {badge !== undefined ? (
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${isActive ? 'bg-brand-800 text-brand-100' : 'bg-slate-800 text-slate-400'}`}>
            {badge}
          </span>
        ) : isActive ? (
          <ChevronRight className="w-4 h-4 flex-shrink-0" />
        ) : null}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0F172A] text-slate-300 flex flex-col justify-between border-r border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Top */}
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/25">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white block leading-none">
                  Event<span className="text-brand-400">Hub</span>
                </span>
                <span className="text-[10px] font-black tracking-widest uppercase bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded border border-brand-500/30 inline-block mt-1">
                  ADMIN CONSOLE
                </span>
              </div>
            </Link>

            {/* Mobile close */}
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Links */}
          <div className="px-4 py-6 space-y-1">
            <p className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              Management
            </p>

            {/* Overview */}
            {navItem(
              'Overview & Analytics',
              LayoutDashboard,
              () => navigate('/admin/dashboard?tab=overview'),
              isOverview
            )}

            {/* Manage Events */}
            {navItem(
              'Manage Events',
              Calendar,
              () => navigate('/admin/dashboard?tab=events'),
              isEvents
            )}

            {/* Moderate Reviews */}
            {navItem(
              'Moderate Reviews',
              MessageSquare,
              () => navigate('/admin/dashboard?tab=reviews'),
              isReviews
            )}

            <div className="pt-4 pb-2">
              <p className="px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                Actions
              </p>

              <Link
                to="/events/create"
                onClick={onClose}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${path.startsWith('/events/create')
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
              >
                <PlusCircle className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <span>Create New Event</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom: Profile & Logout */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-900/60 border border-slate-800 mb-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 text-white font-black flex items-center justify-center text-sm shadow-sm flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="truncate flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
            </div>
            <span className="text-[9px] font-black uppercase tracking-wider bg-brand-500/20 text-brand-300 px-1.5 py-0.5 rounded border border-brand-500/30 flex-shrink-0">
              ADMIN
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-white bg-rose-950/30 hover:bg-rose-600/80 border border-rose-900/40 hover:border-rose-600 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out from Admin</span>
          </button>
        </div>
      </aside>
    </>
  );
}
