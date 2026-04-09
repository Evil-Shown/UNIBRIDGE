const EmptyState = ({ title, description, icon = '📚' }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
    <div className="text-5xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 text-sm text-slate-600">{description}</p>
  </div>
);

export default EmptyState;
