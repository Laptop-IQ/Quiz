import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, RotateCcw, Trophy, Clock, Target, ListChecks, Code, Layout,
  Zap, Cpu, Terminal, Database, Coffee, Globe, ArrowUpRight, Sparkles,
  BarChart3, ChevronRight, Flame, Award, History, Filter, X,
} from "lucide-react";
import useMyResults from "../services/useMyResults";

const techIcons = {
  html: { Icon: Code, color: "text-orange-500", bg: "bg-orange-500/10" },
  css: { Icon: Layout, color: "text-blue-500", bg: "bg-blue-500/10" },
  javascript: { Icon: Zap, color: "text-yellow-500", bg: "bg-yellow-500/10" },
  react: { Icon: Cpu, color: "text-cyan-500", bg: "bg-cyan-500/10" },
  node: { Icon: Terminal, color: "text-green-500", bg: "bg-green-500/10" },
  mongodb: { Icon: Database, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  java: { Icon: Coffee, color: "text-red-500", bg: "bg-red-500/10" },
  python: { Icon: Globe, color: "text-blue-600", bg: "bg-blue-500/10" },
};

const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);
const scoreOf = (r) => (r.totalQuestions ? r.correct / r.totalQuestions : 0);

// Real metrics for one attempt. The API sends them pre-computed; the fallbacks keep
// older/odd records working. Accuracy = correct answers out of the questions actually
// ANSWERED (so skipping questions doesn't hide how precise you were), Score = out of all.
const metricsOf = (r) => {
  const total = r.totalQuestions || 0;
  const correct = r.correct || 0;
  const attempted = r.attempted ?? (r.wrong != null ? correct + r.wrong : total);
  const time = r.timeTaken || 0;
  return {
    total,
    correct,
    attempted,
    skipped: r.skipped ?? Math.max(0, total - attempted),
    marks: r.marks ?? correct,
    totalMarks: r.totalMarks ?? total,
    hasScheme: (r.negativeMarking || 0) > 0 || (r.marksPerQuestion ?? 1) !== 1,
    score: r.score ?? (total ? Math.round((correct / total) * 100) : 0),
    accuracy: r.accuracy ?? (attempted ? Math.round((correct / attempted) * 100) : 0),
    time,
    perQuestion: r.avgTimePerQuestion ?? (total ? Math.round(time / total) : 0),
    weakTopics: r.weakTopics || [],
    topicsTracked: !!r.topicsTracked,
  };
};
const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
const formatTime = (seconds = 0) => {
  if (!seconds || seconds <= 0) return "0s";
  const s = Math.round(seconds), m = Math.floor(s / 60), rem = s % 60;
  if (!m) return `${rem}s`;
  return rem ? `${m}m ${rem}s` : `${m}m`;
};

const performance = (pct) => {
  if (pct >= 80) return { label: "Excellent", tone: "text-emerald-700 bg-emerald-50 border-emerald-100", bar: "bg-emerald-500" };
  if (pct >= 60) return { label: "Good", tone: "text-blue-700 bg-blue-50 border-blue-100", bar: "bg-blue-500" };
  if (pct >= 40) return { label: "Average", tone: "text-amber-700 bg-amber-50 border-amber-100", bar: "bg-amber-500" };
  return { label: "Needs Work", tone: "text-rose-700 bg-rose-50 border-rose-100", bar: "bg-rose-500" };
};

const StatCard = ({ icon: Icon, label, value, detail, iconClass }) => (
  <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-50" />
    <div className="relative flex items-start justify-between gap-3">
      <div>
        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p>
        <p className="mt-2 text-2xl font-black tracking-tight text-slate-950">{value}</p>
        {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
      </div>
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}><Icon size={19} /></div>
    </div>
  </div>
);

const AttemptCard = ({ item }) => {
  const navigate = useNavigate();
  const m = metricsOf(item.latest);
  const pct = m.score;
  const meta = performance(pct);
  const { Icon, color, bg } = techIcons[item.technology?.toLowerCase()] || { Icon: Code, color: "text-slate-500", bg: "bg-slate-100" };
  const improvement = item.bestScore - item.firstScore;

  const retake = () => navigate(`/exam/${item.technology?.toLowerCase()}/${item.level?.toLowerCase()}`);

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_10px_40px_rgba(15,23,42,0.05)] transition duration-300 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_18px_50px_rgba(16,185,129,0.10)]">
      <div className={`absolute inset-y-0 left-0 w-1 ${meta.bar}`} />
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${bg}`}><Icon className={`h-6 w-6 ${color}`} /></div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-base font-extrabold text-slate-950 sm:text-lg">{cap(item.technology)} · {cap(item.level)}</h3>
                {item.attempts > 1 && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-violet-100 bg-violet-50 px-2.5 py-1 text-[11px] font-extrabold text-violet-700">
                    <History size={12} /> Retaken × {item.attempts}
                  </span>
                )}
              </div>
              <p className="mt-1 text-xs text-slate-500">Last attempted {formatDate(item.latest.createdAt)} · {formatTime(item.latest.timeTaken)}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500">
                <span className="rounded-full bg-slate-100 px-2.5 py-1">Best {item.bestScore}%</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-1">{item.totalQuestions} questions</span>
                {improvement > 0 && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">+{improvement}% improvement</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:w-[390px]">
            <div className="rounded-2xl bg-slate-50 p-3 text-center"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{m.hasScheme ? "Marks" : "Score"}</p><p className="mt-1 text-lg font-black text-slate-950">{m.hasScheme ? `${m.marks}/${m.totalMarks}` : `${m.correct}/${m.total}`}</p><p className="mt-0.5 text-[10px] font-medium text-slate-400">{m.hasScheme ? "marks" : `${m.skipped} skipped`}</p></div>
            <div className="rounded-2xl bg-slate-50 p-3 text-center"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Accuracy</p><p className="mt-1 text-lg font-black text-slate-950">{m.attempted ? `${m.accuracy}%` : "—"}</p><p className="mt-0.5 text-[10px] font-medium text-slate-400">{m.attempted} answered</p></div>
            <div className="rounded-2xl bg-slate-50 p-3 text-center"><p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Time</p><p className="mt-1 text-lg font-black text-slate-950">{formatTime(m.time)}</p><p className="mt-0.5 text-[10px] font-medium text-slate-400">{m.perQuestion ? `~${formatTime(m.perQuestion)} / question` : "—"}</p></div>
          </div>

          <div className="flex shrink-0 items-center gap-2 lg:flex-col lg:items-stretch">
            <span className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-xs font-bold ${meta.tone}`}>{meta.label}</span>
            <button onClick={retake} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-600">
              <RotateCcw size={14} /> Retake <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {(m.weakTopics.length > 0 || m.topicsTracked) && (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            {m.weakTopics.length > 0 ? (
              <>
                <span className="font-bold text-rose-600">Needs work on</span>
                {m.weakTopics.map((t) => (
                  <span key={t.topic} className="rounded-full border border-rose-100 bg-rose-50 px-2.5 py-1 font-semibold text-rose-700">{t.topic} · {t.accuracy}%</span>
                ))}
              </>
            ) : (
              <span className="font-bold text-emerald-600">Strong across all topics</span>
            )}
          </div>
        )}

        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold text-slate-400"><span>Latest performance</span><span>{pct}%</span></div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${meta.bar} transition-all`} style={{ width: `${pct}%` }} /></div>
        </div>
      </div>
    </article>
  );
};

const SORTS = {
  newest: (a, b) => new Date(b.latest.createdAt) - new Date(a.latest.createdAt),
  oldest: (a, b) => new Date(a.latest.createdAt) - new Date(b.latest.createdAt),
  highest: (a, b) => b.bestScore - a.bestScore,
  lowest: (a, b) => a.bestScore - b.bestScore,
};

export default function MyResult() {
  const { results, isLoading, error } = useMyResults();

  // Hide the page scrollbar on this screen (scrolling still works)
  useEffect(() => {
    document.documentElement.classList.add("hide-scrollbar");
    return () => document.documentElement.classList.remove("hide-scrollbar");
  }, []);

  const [query, setQuery] = useState("");
  const [techFilter, setTechFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const grouped = useMemo(() => {
    const map = new Map();
    results.forEach((r) => {
      const key = `${(r.technology || "general").toLowerCase()}::${(r.level || "general").toLowerCase()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    });
    return Array.from(map.values()).map((attempts) => {
      const ordered = [...attempts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const best = Math.max(...attempts.map((r) => Math.round(scoreOf(r) * 100)));
      const first = Math.round(scoreOf(ordered[ordered.length - 1]) * 100);
      const latest = ordered[0];
      return {
        key: `${latest.technology}-${latest.level}`,
        technology: latest.technology,
        level: latest.level,
        attempts: attempts.length,
        latest,
        bestScore: best,
        firstScore: first,
        totalQuestions: latest.totalQuestions || 0,
      };
    });
  }, [results]);

  const technologies = useMemo(() => Array.from(new Set(grouped.map((r) => r.technology).filter(Boolean))), [grouped]);

  const summary = useMemo(() => {
    if (!results.length) return { attempts: 0, tests: 0, avg: 0, best: 0, totalTime: 0, retakes: 0 };
    const totalQ = results.reduce((s, r) => s + (r.totalQuestions || 0), 0);
    const totalC = results.reduce((s, r) => s + (r.correct || 0), 0);
    return {
      attempts: results.length,
      tests: grouped.length,
      avg: totalQ ? Math.round((totalC / totalQ) * 100) : 0,
      best: Math.round(Math.max(...results.map((r) => scoreOf(r) * 100))),
      totalTime: results.reduce((s, r) => s + (r.timeTaken || 0), 0),
      retakes: Math.max(0, results.length - grouped.length),
    };
  }, [results, grouped]);

  const filtered = useMemo(() => grouped
    .filter((r) => techFilter === "all" || r.technology === techFilter)
    .filter((r) => !query.trim() || `${r.technology} ${r.level}`.toLowerCase().includes(query.trim().toLowerCase()))
    .sort(SORTS[sortBy]), [grouped, techFilter, query, sortBy]);

  return (
    <div className="min-h-full bg-[#f7f9fc] -m-4 sm:-m-6 lg:-m-8 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="relative overflow-hidden rounded-[28px] bg-slate-950 px-6 py-7 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:px-8 sm:py-9">
          <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
          <div className="absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-300"><Sparkles size={13} /> Performance Hub</div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Your Test Journey</h1>
              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">Track every test, compare your progress, and keep improving. Multiple retakes are intelligently grouped into one clean test card.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300"><Flame size={16} className="text-amber-300" /> Keep your momentum going</div>
          </div>
        </section>

        {isLoading && <div className="flex justify-center py-16"><div className="h-9 w-9 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" /></div>}
        {!isLoading && error && <div className="rounded-2xl border border-rose-100 bg-rose-50 p-8 text-center text-sm font-semibold text-rose-700">{error}</div>}

        {!isLoading && !error && results.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-14 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><BarChart3 /></div>
            <h2 className="mt-4 text-lg font-extrabold text-slate-950">Your performance space is ready</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">Attempt a test to start building your performance history.</p>
            <a href="/test-series" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-600">Browse Test Series <ArrowUpRight size={16} /></a>
          </div>
        )}

        {!isLoading && !error && results.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
              <StatCard icon={ListChecks} label="Attempts" value={summary.attempts} detail={`${summary.tests} unique tests`} iconClass="bg-blue-50 text-blue-600" />
              <StatCard icon={Target} label="Average Score" value={`${summary.avg}%`} detail="Across all attempts" iconClass="bg-emerald-50 text-emerald-600" />
              <StatCard icon={Trophy} label="Best Score" value={`${summary.best}%`} detail="Personal best" iconClass="bg-amber-50 text-amber-600" />
              <StatCard icon={Clock} label="Time Practiced" value={formatTime(summary.totalTime)} detail="Total test time" iconClass="bg-violet-50 text-violet-600" />
              <StatCard icon={Award} label="Retakes" value={summary.retakes} detail="Extra attempts" iconClass="bg-rose-50 text-rose-600" />
            </div>

            <section className="rounded-2xl border border-slate-200/80 bg-white p-3 shadow-[0_8px_30px_rgba(15,23,42,0.04)] sm:p-4">
              <div className="flex flex-col gap-3 lg:flex-row">
                <div className="relative flex-1">
                  <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search tests by technology or level..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-9 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-50" />
                  {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"><X size={15} /></button>}
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1 sm:flex-none"><Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><select value={techFilter} onChange={(e) => setTechFilter(e.target.value)} className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-8 text-sm font-semibold text-slate-700 outline-none sm:w-44"><option value="all">All Technologies</option>{technologies.map((t) => <option key={t} value={t}>{cap(t)}</option>)}</select></div>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-700 outline-none"><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="highest">Best Score</option><option value="lowest">Lowest Score</option></select>
                </div>
              </div>
            </section>

            <div className="flex items-center justify-between px-1"><div><h2 className="text-lg font-black text-slate-950">Attempted Tests</h2><p className="mt-1 text-xs text-slate-500">{filtered.length} unique test{filtered.length !== 1 ? "s" : ""} · retakes grouped automatically</p></div><span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-500 sm:inline-flex">{summary.retakes} retake{summary.retakes !== 1 ? "s" : ""}</span></div>

            {filtered.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center text-sm text-slate-500">No tests match your filters.</div> : <div className="space-y-4">{filtered.map((item) => <AttemptCard key={item.key} item={item} />)}</div>}
          </>
        )}
      </div>
    </div>
  );
}
