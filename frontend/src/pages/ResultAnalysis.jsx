import { useEffect, useMemo, useState } from "react";
import RichText from "../components/RichText";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, ArrowUpRight, CheckCircle2, XCircle, MinusCircle, Clock3,
  Target, Gauge, Zap, Trophy, TrendingUp, TrendingDown, AlertTriangle,
  ChevronDown, Filter, Sparkles, Brain, TimerReset
} from "lucide-react";

const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);
const formatTime = (seconds = 0) => {
  const s = Math.max(0, Math.round(seconds));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60), rem = s % 60;
  return rem ? `${m}m ${rem}s` : `${m}m`;
};
const statusMeta = {
  correct: { label: "Correct", icon: CheckCircle2, badge: "bg-emerald-50 text-emerald-700 border-emerald-100", dot: "bg-emerald-500" },
  wrong: { label: "Wrong", icon: XCircle, badge: "bg-rose-50 text-rose-700 border-rose-100", dot: "bg-rose-500" },
  skipped: { label: "Skipped", icon: MinusCircle, badge: "bg-slate-100 text-slate-600 border-slate-200", dot: "bg-slate-400" },
};

const StatCard = ({ icon: Icon, label, value, hint, iconClass }) => (
  <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)]">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">{label}</p>
        <p className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
        {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
      </div>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClass}`}><Icon size={18} /></div>
    </div>
  </div>
);

export default function ResultAnalysis() {
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(undefined);
  const [tab, setTab] = useState("all");
  const [topicFilter, setTopicFilter] = useState("all");
  const [sort, setSort] = useState("question");

  useEffect(() => {
    try { setAttempt(JSON.parse(sessionStorage.getItem("techQuizLastAttempt") || "null")); }
    catch { setAttempt(null); }
  }, []);

  const questions = attempt?.questions || [];
  const total = attempt?.total || questions.length || 0;
  const correct = attempt?.correct || questions.filter(q => q.status === "correct").length;
  const wrong = attempt?.wrong || questions.filter(q => q.status === "wrong").length;
  const skipped = attempt?.unattempted ?? questions.filter(q => q.status === "skipped").length;
  const attempted = correct + wrong;
  const accuracy = attempted ? Math.round((correct / attempted) * 100) : 0;
  // marks follow the exam's scheme (e.g. +2 / -0.5); attempts without one count 1 mark each
  const marksPerQuestion = attempt?.marksPerQuestion ?? 1;
  const negativeMarking = attempt?.negativeMarking ?? 0;
  const hasScheme = negativeMarking > 0 || marksPerQuestion !== 1;
  const totalMarks = attempt?.totalMarks ?? total * marksPerQuestion;
  const marks = attempt?.marksObtained ?? correct * marksPerQuestion - wrong * negativeMarking;
  const fmt = (n) => (Number.isInteger(n) ? n : Math.round(n * 100) / 100);
  const avgTime = questions.length ? questions.reduce((a, q) => a + (q.timeTaken || 0), 0) / questions.length : 0;
  const totalTime = attempt?.timeTaken || questions.reduce((a, q) => a + (q.timeTaken || 0), 0);

  const topicRows = useMemo(() => {
    const map = {};
    questions.forEach(q => {
      const topic = q.topic || "General";
      if (!map[topic]) map[topic] = { topic, total: 0, correct: 0, wrong: 0, skipped: 0, time: 0 };
      const x = map[topic]; x.total++; x.time += q.timeTaken || 0;
      if (q.status === "correct") x.correct++; else if (q.status === "wrong") x.wrong++; else x.skipped++;
    });
    return Object.values(map).map(x => ({ ...x, accuracy: x.total ? Math.round(x.correct / x.total * 100) : 0, avgTime: x.total ? x.time / x.total : 0 }))
      .sort((a, b) => b.accuracy - a.accuracy);
  }, [questions]);

  const strong = topicRows.filter(x => x.accuracy >= 70);
  const weak = topicRows.filter(x => x.accuracy < 50);
  const average = topicRows.filter(x => x.accuracy >= 50 && x.accuracy < 70);

  const filteredQuestions = useMemo(() => {
    const list = questions.filter(q => (tab === "all" || q.status === tab) && (topicFilter === "all" || (q.topic || "General") === topicFilter));
    return [...list].sort((a, b) => {
      if (sort === "time") return (b.timeTaken || 0) - (a.timeTaken || 0);
      if (sort === "status") return String(a.status).localeCompare(String(b.status));
      return (a.questionNumber || 0) - (b.questionNumber || 0);
    });
  }, [questions, tab, topicFilter, sort]);

  const slow = [...questions].sort((a, b) => (b.timeTaken || 0) - (a.timeTaken || 0)).slice(0, 4);
  const fastest = [...questions].sort((a, b) => (a.timeTaken || 0) - (b.timeTaken || 0)).slice(0, 3);
  const bestTopic = strong[0];
  const weakestTopic = [...topicRows].sort((a, b) => a.accuracy - b.accuracy)[0];
  const scorePercent = totalMarks ? Math.max(0, Math.round((marks / totalMarks) * 100)) : 0;
  const performanceLabel = scorePercent >= 80 ? "Excellent performance" : scorePercent >= 60 ? "Good performance" : scorePercent >= 40 ? "Keep improving" : "Needs focused practice";

  if (attempt === undefined) return <div className="min-h-screen grid place-items-center bg-[#f7f8fc]"><div className="h-9 w-9 animate-spin rounded-full border-2 border-slate-200 border-t-indigo-600" /></div>;
  if (!attempt) return <div className="min-h-screen grid place-items-center bg-[#f7f8fc] p-6"><div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl"><div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-slate-100"><Brain size={25} className="text-slate-500" /></div><h1 className="text-xl font-bold text-slate-900">No recent analysis</h1><p className="mt-2 text-sm text-slate-500">Complete a test to unlock your detailed performance report.</p><button onClick={() => navigate("/dashboard/test-series")} className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Browse Test Series</button></div></div>;

  return (
    <div className="min-h-screen bg-[#f7f8fc] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button onClick={() => navigate("/dashboard/attempted-tests")} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"><ArrowLeft size={16} /> Back to attempts</button>
          <div className="text-xs font-medium text-slate-400">Detailed Performance Report</div>
        </div>

        <section className="relative overflow-hidden rounded-[28px] bg-slate-950 p-6 text-white shadow-[0_20px_70px_rgba(15,23,42,0.18)] sm:p-8">
          <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/15 blur-3xl" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2"><span className="rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-200">Test Analysis</span><span className="text-xs text-slate-400">{attempt.createdAt ? new Date(attempt.createdAt).toLocaleString() : "Latest attempt"}</span></div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{cap(attempt.technology)} <span className="text-slate-500">·</span> {cap(attempt.level)}</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{performanceLabel}. Review where you gained marks, where time was lost, and which topics need your next study session.</p>
              <div className="mt-5 flex flex-wrap gap-2 text-xs"><span className="rounded-lg bg-emerald-400/10 px-3 py-1.5 text-emerald-300">{correct} correct</span><span className="rounded-lg bg-rose-400/10 px-3 py-1.5 text-rose-300">{wrong} wrong</span><span className="rounded-lg bg-white/10 px-3 py-1.5 text-slate-300">{skipped} skipped</span></div>
            </div>
            <div className="flex items-center gap-5 rounded-3xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur">
              <div className="relative grid h-28 w-28 place-items-center rounded-full" style={{ background: `conic-gradient(#818cf8 ${scorePercent * 3.6}deg, rgba(255,255,255,.08) 0deg)` }}><div className="grid h-20 w-20 place-items-center rounded-full bg-slate-950"><span className="text-2xl font-bold">{scorePercent}%</span></div></div>
              <div><p className="text-xs uppercase tracking-widest text-slate-500">Score</p><p className="mt-1 text-3xl font-bold">{hasScheme ? fmt(marks) : correct}<span className="text-lg text-slate-500">/{hasScheme ? fmt(totalMarks) : total}</span></p><p className="mt-1 text-xs text-slate-400">Accuracy {accuracy}%</p></div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          <StatCard icon={Target} label={hasScheme ? "Marks" : "Score"} value={hasScheme ? `${fmt(marks)}/${fmt(totalMarks)}` : `${correct}/${total}`} hint={hasScheme ? `${marksPerQuestion > 0 ? "+" + marksPerQuestion : ""} / ${negativeMarking > 0 ? "−" + negativeMarking : "no"} negative` : `${scorePercent}% score`} iconClass="bg-indigo-50 text-indigo-600" />
          <StatCard icon={Gauge} label="Accuracy" value={`${accuracy}%`} hint={`${attempted} attempted`} iconClass="bg-emerald-50 text-emerald-600" />
          <StatCard icon={Clock3} label="Total time" value={formatTime(totalTime)} hint="Across all questions" iconClass="bg-violet-50 text-violet-600" />
          <StatCard icon={Zap} label="Avg / Q" value={formatTime(avgTime)} hint="Question speed" iconClass="bg-amber-50 text-amber-600" />
          <StatCard icon={Trophy} label="Best topic" value={bestTopic ? `${bestTopic.accuracy}%` : "—"} hint={bestTopic ? cap(bestTopic.topic) : "No topic data"} iconClass="bg-cyan-50 text-cyan-600" />
          <StatCard icon={TrendingDown} label="Needs work" value={weakestTopic ? `${weakestTopic.accuracy}%` : "—"} hint={weakestTopic ? cap(weakestTopic.topic) : "No weak topic"} iconClass="bg-rose-50 text-rose-600" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-3"><div><h2 className="font-bold text-slate-900">Performance snapshot</h2><p className="mt-1 text-xs text-slate-400">How your marks were distributed</p></div><Sparkles size={18} className="text-indigo-500" /></div>
            <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100"><div className="flex h-full"><div className="bg-emerald-500" style={{ width: `${total ? correct / total * 100 : 0}%` }} /><div className="bg-rose-500" style={{ width: `${total ? wrong / total * 100 : 0}%` }} /><div className="bg-slate-300" style={{ width: `${total ? skipped / total * 100 : 0}%` }} /></div></div>
            <div className="mt-4 grid grid-cols-3 gap-3"><div><p className="text-xl font-bold text-emerald-600">{correct}</p><p className="text-xs text-slate-400">Correct</p></div><div><p className="text-xl font-bold text-rose-600">{wrong}</p><p className="text-xs text-slate-400">Wrong</p></div><div><p className="text-xl font-bold text-slate-700">{skipped}</p><p className="text-xs text-slate-400">Skipped</p></div></div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2"><div className="rounded-xl bg-emerald-50/70 p-4"><p className="text-xs font-semibold text-emerald-700">Strongest area</p><p className="mt-1 font-bold text-slate-900">{bestTopic ? cap(bestTopic.topic) : "—"}</p><p className="mt-1 text-xs text-slate-500">{bestTopic ? `${bestTopic.accuracy}% accuracy · ${bestTopic.correct}/${bestTopic.total}` : "Not enough data"}</p></div><div className="rounded-xl bg-rose-50/70 p-4"><p className="text-xs font-semibold text-rose-700">Priority area</p><p className="mt-1 font-bold text-slate-900">{weakestTopic ? cap(weakestTopic.topic) : "—"}</p><p className="mt-1 text-xs text-slate-500">{weakestTopic ? `${weakestTopic.accuracy}% accuracy · ${formatTime(weakestTopic.avgTime)} avg` : "Not enough data"}</p></div></div>
          </section>

          <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"><div className="flex items-center gap-2"><TimerReset size={18} className="text-orange-500" /><h2 className="font-bold text-slate-900">Speed analysis</h2></div><p className="mt-1 text-xs text-slate-400">Your fastest and slowest questions</p><div className="mt-4 space-y-2">{slow.map((q, i) => <div key={i} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5"><span className="text-sm font-medium text-slate-700">Q{q.questionNumber || i + 1}</span><span className="text-sm font-bold text-orange-600">{formatTime(q.timeTaken)}</span></div>)}</div><div className="mt-4 border-t border-slate-100 pt-4"><div className="flex items-center justify-between text-xs text-slate-400"><span>Fastest</span><b className="text-slate-700">{fastest[0] ? `Q${fastest[0].questionNumber || 1} · ${formatTime(fastest[0].timeTaken)}` : "—"}</b></div><div className="mt-2 flex items-center justify-between text-xs text-slate-400"><span>Average</span><b className="text-slate-700">{formatTime(avgTime)} / question</b></div></div></section>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {[{ title: "Strong topics", icon: TrendingUp, tone: "text-emerald-600", rows: strong, empty: "No strong topic yet. Aim for 70%+ accuracy." }, { title: "Weak topics", icon: TrendingDown, tone: "text-rose-600", rows: weak, empty: "Great — no topic is currently below 50%." }].map(({ title, icon: Icon, tone, rows, empty }) => <section key={title} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"><div className="flex items-center justify-between"><div><h2 className="flex items-center gap-2 font-bold text-slate-900"><Icon size={18} className={tone} />{title}</h2><p className="mt-1 text-xs text-slate-400">Topic-wise accuracy and average time</p></div><span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">{rows.length} topics</span></div><div className="mt-5 space-y-4">{rows.length ? rows.map(x => <div key={x.topic}><div className="mb-1.5 flex items-center justify-between gap-3"><span className="text-sm font-semibold text-slate-700">{cap(x.topic)}</span><span className={`text-sm font-bold ${x.accuracy >= 70 ? "text-emerald-600" : "text-rose-600"}`}>{x.accuracy}%</span></div><div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${x.accuracy >= 70 ? "bg-emerald-500" : "bg-rose-500"}`} style={{ width: `${x.accuracy}%` }} /></div><p className="mt-1.5 text-[11px] text-slate-400">{x.correct}/{x.total} correct · {formatTime(x.avgTime)} average time</p></div>) : <div className="rounded-xl bg-slate-50 p-5 text-center text-sm text-slate-400">{empty}</div>}</div></section>)}
        </div>

        <section className="rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="border-b border-slate-100 p-5"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold text-slate-900">Question-wise review</h2><p className="mt-1 text-xs text-slate-400">See exactly how much time you spent on each question.</p></div><div className="flex flex-wrap gap-2"><div className="relative"><Filter size={14} className="pointer-events-none absolute left-3 top-3 text-slate-400" /><select value={topicFilter} onChange={e => setTopicFilter(e.target.value)} className="appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-xs font-semibold text-slate-600 outline-none"><option value="all">All topics</option>{topicRows.map(x => <option key={x.topic} value={x.topic}>{cap(x.topic)}</option>)}</select><ChevronDown size={13} className="pointer-events-none absolute right-2.5 top-3.5 text-slate-400" /></div><select value={sort} onChange={e => setSort(e.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 outline-none"><option value="question">Question order</option><option value="time">Longest time</option><option value="status">Status</option></select></div></div><div className="mt-4 flex flex-wrap gap-1.5">{["all", "correct", "wrong", "skipped"].map(x => <button key={x} onClick={() => setTab(x)} className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition ${tab === x ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>{cap(x)}</button>)}</div></div>
          <div className="divide-y divide-slate-100">{filteredQuestions.length ? filteredQuestions.map((q, i) => { const m = statusMeta[q.status] || statusMeta.skipped; const Icon = m.icon; const slowQ = avgTime > 0 && (q.timeTaken || 0) > avgTime * 1.5; return <div key={`${q.questionNumber || i}-${q.text || "q"}`} className="group flex flex-wrap items-center gap-3 px-5 py-4 transition hover:bg-slate-50/80"><div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl border ${m.badge}`}><Icon size={16} /></div><div className="min-w-[220px] flex-1"><div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400"><span>Q{q.questionNumber || i + 1}</span><span>•</span><span>{cap(q.topic || "General")}</span>{slowQ && <span className="flex items-center gap-1 text-orange-600"><AlertTriangle size={11} /> Slow</span>}</div><div className="mt-1 line-clamp-2 text-sm font-semibold text-slate-700"><RichText preview>{q.text || "Question"}</RichText></div></div><div className="min-w-[85px] text-right"><p className={`text-sm font-bold ${slowQ ? "text-orange-600" : "text-slate-800"}`}>{formatTime(q.timeTaken)}</p><p className="text-[10px] text-slate-400">time spent</p></div><span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold ${m.badge}`}>{m.label}</span><ArrowUpRight size={15} className="text-slate-300 transition group-hover:text-slate-500" /></div>; }) : <div className="p-10 text-center text-sm text-slate-400">No questions match these filters.</div>}</div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]"><div className="flex items-center justify-between"><div><h2 className="font-bold text-slate-900">Topic performance</h2><p className="mt-1 text-xs text-slate-400">A complete breakdown of accuracy and speed.</p></div><span className="text-xs font-semibold text-slate-400">{topicRows.length} topics</span></div><div className="mt-4 overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead><tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider text-slate-400"><th className="pb-3">Topic</th><th className="pb-3">Questions</th><th className="pb-3">Correct</th><th className="pb-3">Accuracy</th><th className="pb-3">Avg time</th><th className="pb-3">Level</th></tr></thead><tbody>{topicRows.map(x => <tr key={x.topic} className="border-b border-slate-50 last:border-0"><td className="py-3.5 font-semibold text-slate-700">{cap(x.topic)}</td><td className="text-slate-500">{x.total}</td><td className="text-slate-500">{x.correct}</td><td className="font-bold text-slate-700">{x.accuracy}%</td><td className="text-slate-500">{formatTime(x.avgTime)}</td><td><span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${x.accuracy >= 70 ? "bg-emerald-50 text-emerald-700" : x.accuracy < 50 ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-700"}`}>{x.accuracy >= 70 ? "Strong" : x.accuracy < 50 ? "Weak" : "Average"}</span></td></tr>)}</tbody></table></div></section>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4"><div><p className="text-sm font-bold text-slate-900">Ready to improve your next attempt?</p><p className="mt-1 text-xs text-slate-500">Focus first on {weakestTopic ? cap(weakestTopic.topic) : "your lowest-accuracy topics"} and reduce time spent on slow questions.</p></div><button onClick={() => navigate("/dashboard/test-series")} className="rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-slate-800">Take another test</button></div>
      </div>
    </div>
  );
}
