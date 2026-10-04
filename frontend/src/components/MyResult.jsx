import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  RotateCcw,
  Trophy,
  Clock,
  Target,
  ListChecks,
  Code,
  Layout,
  Zap,
  Cpu,
  Terminal,
  Database,
  Coffee,
  Globe,
} from "lucide-react";
import { useApi } from "../services/api/api.js";

const techIcons = {
  html: { Icon: Code, color: "text-orange-500", bg: "bg-orange-50" },
  css: { Icon: Layout, color: "text-blue-500", bg: "bg-blue-50" },
  javascript: { Icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50" },
  react: { Icon: Cpu, color: "text-cyan-500", bg: "bg-cyan-50" },
  node: { Icon: Terminal, color: "text-green-600", bg: "bg-green-50" },
  mongodb: { Icon: Database, color: "text-green-700", bg: "bg-green-50" },
  java: { Icon: Coffee, color: "text-red-500", bg: "bg-red-50" },
  python: { Icon: Globe, color: "text-blue-600", bg: "bg-blue-50" },
};

const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

const perf = (pct) => {
  if (pct >= 80) return { label: "Excellent", cls: "bg-green-100 text-green-700", bar: "bg-green-600" };
  if (pct >= 60) return { label: "Good", cls: "bg-blue-100 text-blue-700", bar: "bg-blue-600" };
  if (pct >= 40) return { label: "Average", cls: "bg-yellow-100 text-yellow-700", bar: "bg-yellow-500" };
  return { label: "Needs Work", cls: "bg-red-100 text-red-700", bar: "bg-red-500" };
};

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

const formatTime = (seconds) => {
  if (!seconds || seconds <= 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  if (m === 0) return `${s}s`;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
};

const StatCard = ({ icon, label, value, accent }) => {
  const Icon = icon;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${accent}`}>
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 leading-tight">{label}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
};

const AttemptCard = ({ item }) => {
  const navigate = useNavigate();
  const pct = item.totalQuestions
    ? Math.round((item.correct / item.totalQuestions) * 100)
    : 0;
  const { label, cls, bar } = perf(pct);
  const { Icon, color, bg } = techIcons[item.technology?.toLowerCase()] || {
    Icon: Code,
    color: "text-gray-500",
    bg: "bg-gray-100",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col sm:flex-row">
      <div className={`w-full sm:w-1.5 h-1.5 sm:h-auto ${bar}`} />

      <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${bg}`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-gray-900 truncate">
              {cap(item.technology)} - {cap(item.level)}
            </p>
            <p className="text-xs text-gray-500">
              {formatDate(item.createdAt)} &middot; {formatTime(item.timeTaken)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 sm:gap-8 shrink-0">
          <div className="text-center">
            <p className="text-xs text-gray-500">Score</p>
            <p className="font-bold text-gray-900">
              {item.correct}/{item.totalQuestions}
            </p>
          </div>
          <div className="text-center w-16">
            <p className="text-xs text-gray-500">Accuracy</p>
            <p className="font-bold text-gray-900">{pct}%</p>
          </div>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${cls}`}>
            {label}
          </span>
        </div>

        <button
          onClick={() =>
            navigate(`/exam/${item.technology?.toLowerCase()}/${item.level?.toLowerCase()}`)
          }
          className="flex items-center justify-center gap-1.5 text-sm font-medium text-[#16A34A] hover:text-[#15803D] border border-[#16A34A] hover:bg-green-50 rounded-md px-3 py-1.5 shrink-0 cursor-pointer"
        >
          <RotateCcw size={14} /> Retake
        </button>
      </div>
    </div>
  );
};

const SORTS = {
  newest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  highest: (a, b) => scoreOf(b) - scoreOf(a),
  lowest: (a, b) => scoreOf(a) - scoreOf(b),
};
const scoreOf = (r) => (r.totalQuestions ? r.correct / r.totalQuestions : 0);

export default function MyResult() {
  const { request } = useApi();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [techFilter, setTechFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await request("/result/my-result");
        if (active) setResults(Array.isArray(data) ? data : []);
      } catch {
        if (active) setError("Could not load your results.");
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [request]);

  const technologies = useMemo(
    () => Array.from(new Set(results.map((r) => r.technology).filter(Boolean))),
    [results],
  );

  const summary = useMemo(() => {
    if (!results.length)
      return { attempts: 0, avg: 0, best: 0, totalTime: 0 };
    const totalQ = results.reduce((s, r) => s + (r.totalQuestions || 0), 0);
    const totalC = results.reduce((s, r) => s + (r.correct || 0), 0);
    const best = Math.round(Math.max(...results.map((r) => scoreOf(r) * 100)));
    const totalTime = results.reduce((s, r) => s + (r.timeTaken || 0), 0);
    return {
      attempts: results.length,
      avg: totalQ ? Math.round((totalC / totalQ) * 100) : 0,
      best,
      totalTime,
    };
  }, [results]);

  const filtered = useMemo(() => {
    return results
      .filter((r) =>
        techFilter === "all" ? true : r.technology === techFilter,
      )
      .filter((r) =>
        query.trim()
          ? `${r.technology} ${r.level}`
              .toLowerCase()
              .includes(query.trim().toLowerCase())
          : true,
      )
      .sort(SORTS[sortBy]);
  }, [results, techFilter, query, sortBy]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Performance</h1>
        <p className="text-gray-500 text-sm mt-1">
          Every test you&apos;ve attempted, in one place.
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#16A34A]" />
        </div>
      )}

      {!isLoading && error && (
        <p className="text-center text-red-600 py-10">{error}</p>
      )}

      {!isLoading && !error && results.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-600 mb-4">
            You haven&apos;t attempted any test yet.
          </p>
          <a
            href="/test-series"
            className="inline-block bg-[#16A34A] hover:bg-[#15803D] text-white px-6 py-2.5 rounded-md font-medium"
          >
            Browse Test Series
          </a>
        </div>
      )}

      {!isLoading && !error && results.length > 0 && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard icon={ListChecks} label="Tests Attempted" value={summary.attempts} accent="bg-blue-50 text-blue-600" />
            <StatCard icon={Target} label="Average Score" value={`${summary.avg}%`} accent="bg-green-50 text-green-600" />
            <StatCard icon={Trophy} label="Best Score" value={`${summary.best}%`} accent="bg-yellow-50 text-yellow-600" />
            <StatCard icon={Clock} label="Time Practiced" value={formatTime(summary.totalTime)} accent="bg-purple-50 text-purple-600" />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by technology or level..."
                className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-[#16A34A] bg-white"
              />
            </div>
            <select
              value={techFilter}
              onChange={(e) => setTechFilter(e.target.value)}
              className="border border-gray-200 rounded-lg text-sm px-3 py-2.5 bg-white cursor-pointer"
            >
              <option value="all">All Technologies</option>
              {technologies.map((t) => (
                <option key={t} value={t}>
                  {cap(t)}
                </option>
              ))}
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg text-sm px-3 py-2.5 bg-white cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Score</option>
              <option value="lowest">Lowest Score</option>
            </select>
          </div>

          <div className="space-y-3">
            {filtered.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No attempts match your filters.
              </p>
            ) : (
              filtered.map((item) => (
                <AttemptCard key={item._id} item={item} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
