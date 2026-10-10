import { lazy, Suspense, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Flame, Target, Trophy, Timer } from "lucide-react";
import StatCard from "../components/Dashboard/StatCard";

const DashboardCharts = lazy(() => import("../components/Dashboard/DashboardCharts"));
import useMyResults from "../services/useMyResults";
import { getStoredUser } from "../services/useSeries";

const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

const Dashboard = () => {
  const { results, isLoading, error } = useMyResults();
  const user = getStoredUser();
  const stats = useMemo(() => {
    if (!results.length) return { attempted: 0, accuracy: 0, best: null, time: 0 };
    let correct = 0, total = 0, time = 0, best = results[0];
    results.forEach(r => { correct += r.correct || 0; total += r.totalQuestions || 0; time += r.timeTaken || r.totalTime || 0; const p = r.totalQuestions ? r.correct / r.totalQuestions : 0; const bp = best.totalQuestions ? best.correct / best.totalQuestions : 0; if (p > bp) best = r; });
    return { attempted: results.length, accuracy: total ? Math.round(correct / total * 100) : 0, best, time };
  }, [results]);
  const trend = useMemo(() => [...results].sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt)).map((r,i)=>({name:`#${i+1}`, score:r.totalQuestions?Math.round(r.correct/r.totalQuestions*100):0})),[results]);
  const byTech = useMemo(() => { const g={}; results.forEach(r=>{const k=r.technology||"Other"; g[k]??={correct:0,total:0};g[k].correct+=r.correct||0;g[k].total+=r.totalQuestions||0}); return Object.entries(g).map(([name,v])=>({name:cap(name),accuracy:v.total?Math.round(v.correct/v.total*100):0}));},[results]);
  const recent = useMemo(()=>[...results].sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5),[results]);
  const mins = Math.round((stats.time || 0) / 60);
  return <div className="space-y-6">
    <section className="relative overflow-hidden rounded-[30px] border border-white/10 bg-gradient-to-br from-[#101a31] via-[#0b1220] to-[#07111d] p-6 sm:p-8 shadow-2xl shadow-black/25">
      <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-3xl"/><div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-blue-500/10 blur-3xl"/>
      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div><span className="inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-300">Performance Hub</span><h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Welcome back{user?.name ? `, ${user.name}` : ""}.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">Track your preparation, spot weak areas and turn every attempt into measurable progress.</p></div>
        <Link to="/dashboard/test-series" className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-0.5">Explore tests <ArrowRight size={16}/></Link>
      </div>
    </section>
    {isLoading && <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{[1,2,3,4].map(i=><div key={i} className="h-28 animate-pulse rounded-2xl bg-white/5"/>)}</div>}
    {!isLoading && error && <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-6 text-red-300">{error}</div>}
    {!isLoading && !error && results.length===0 && <div className="rounded-[28px] border border-white/10 bg-white/[0.035] p-10 text-center"><div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300"><Target/></div><h2 className="text-xl font-semibold text-white">Your dashboard is ready</h2><p className="mt-2 text-sm text-slate-400">Attempt your first test to unlock performance analytics.</p><Link to="/dashboard/test-series" className="mt-5 inline-flex rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white">Browse Test Series</Link></div>}
    {!isLoading && !error && results.length>0 && <>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4"><StatCard title="Tests Attempted" value={stats.attempted}/><StatCard title="Accuracy" value={`${stats.accuracy}%`}/><StatCard title="Best Score" value={stats.best?`${stats.best.correct}/${stats.best.totalQuestions}`:"—"} sub={stats.best?`${cap(stats.best.technology)} · ${cap(stats.best.level)}`:""}/><StatCard title="Time Practiced" value={`${mins}m`}/></div>
      <Suspense fallback={<div className="grid grid-cols-1 gap-5 xl:grid-cols-2"><div className="h-[340px] animate-pulse rounded-2xl bg-white/5"/><div className="h-[340px] animate-pulse rounded-2xl bg-white/5"/></div>}>
        <DashboardCharts trend={trend} byTech={byTech}/>
      </Suspense>
      <div className="dashboard-card overflow-hidden"><div className="flex items-center justify-between border-b border-white/10 px-5 py-4"><div><h3 className="section-title">Recent attempts</h3><p className="section-sub">Your latest performance snapshot</p></div><Link to="/dashboard/attempted-tests" className="text-sm font-semibold text-cyan-300">View all</Link></div>{recent.map(r=>{const pct=r.totalQuestions?Math.round(r.correct/r.totalQuestions*100):0;return <div key={r._id} className="flex items-center justify-between gap-4 border-b border-white/5 px-5 py-4 last:border-0"><div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{cap(r.technology)} · {cap(r.level)}</p><p className="mt-1 text-xs text-slate-500">{r.createdAt?new Date(r.createdAt).toLocaleDateString():""}</p></div><div className="flex items-center gap-4"><div className="hidden h-1.5 w-28 rounded-full bg-white/10 sm:block"><div className="h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{width:`${pct}%`}}/></div><span className="text-sm font-bold text-white">{pct}%</span></div></div>})}</div>
    </>}
  </div>;
};
export default Dashboard;
