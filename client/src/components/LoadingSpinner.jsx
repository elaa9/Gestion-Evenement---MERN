export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-brand-100 border-t-brand-600 animate-spin"></div>
      </div>
      {text && <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">{text}</p>}
    </div>
  );
}
