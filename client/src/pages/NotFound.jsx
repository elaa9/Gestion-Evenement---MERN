import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
          <Compass className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-brand-600">404</span>
          <h1 className="text-xl font-bold text-[#172033]">Page Not Found</h1>
          <p className="text-sm text-slate-500">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
