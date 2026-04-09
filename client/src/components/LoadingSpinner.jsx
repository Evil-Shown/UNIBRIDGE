const LoadingSpinner = ({ label = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></div>
    <p className="mt-4 text-slate-600 font-medium">{label}</p>
  </div>
);

export default LoadingSpinner;
