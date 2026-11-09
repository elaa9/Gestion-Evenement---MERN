import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, User, Mail, Lock, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setServerError('');
      await register({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Registration error', err);
      setServerError(
        typeof err === 'string'
          ? err
          : err.response?.data?.message || 'Registration failed. Email may already be in use.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto shadow-sm border border-brand-100">
            <UserPlus className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#172033] tracking-tight">
            Join as Event Organizer
          </h1>
          <p className="text-sm text-slate-500">
            Create an organizer account to host events, manage schedules, and interact with attendees
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Account Role Banner */}
          <div className="flex items-center gap-2 p-3 bg-brand-50/70 border border-brand-100 rounded-2xl text-xs text-brand-900 font-semibold">
            <Sparkles className="w-4 h-4 text-brand-600 flex-shrink-0" />
            <span>Account Type: <strong>Event Organizer (Organisateur)</strong></span>
          </div>

          {serverError && (
            <div className="flex items-center gap-2 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-1.5">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Chen"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.name
                      ? 'border-rose-400 bg-rose-50/20'
                      : 'border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-1.5">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.email
                      ? 'border-rose-400 bg-rose-50/20'
                      : 'border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-1.5">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.password
                      ? 'border-rose-400 bg-rose-50/20'
                      : 'border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'
                  }`}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-[#172033] uppercase tracking-wider mb-1.5">
                Confirm Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.confirmPassword
                      ? 'border-rose-400 bg-rose-50/20'
                      : 'border-slate-200 focus:border-brand-600 focus:ring-2 focus:ring-brand-600/20'
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600 font-medium">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 hover:shadow-lg transition-all disabled:opacity-60 flex items-center justify-center gap-2 pt-2"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Registering...</span>
                </>
              ) : (
                <>
                  <span>Create Organizer Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-100 text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
