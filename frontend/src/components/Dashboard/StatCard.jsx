const StatCard = ({ title, value, sub, accent = "text-cyan-300" }) => (
  <div className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 shadow-xl shadow-black/10 transition hover:-translate-y-0.5 hover:border-cyan-400/20 hover:bg-white/[0.05]">
    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
    <p className={`mt-2 text-2xl font-bold ${accent}`}>{value}</p>
    {sub && <p className="mt-1 truncate text-xs text-slate-500">{sub}</p>}
  </div>
);
export default StatCard;
