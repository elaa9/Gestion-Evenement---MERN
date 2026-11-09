import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] p-4 text-[#172033]">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-extrabold text-[#172033] tracking-tight">
              Oops, something went wrong
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              An unexpected error occurred while displaying this page. You can try refreshing or returning to the home page.
            </p>
            {this.state.error?.message && (
              <div className="bg-slate-50 p-3 rounded-xl text-left border border-slate-200">
                <p className="text-xs font-mono text-rose-600 break-words">
                  {this.state.error.message}
                </p>
              </div>
            )}
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
