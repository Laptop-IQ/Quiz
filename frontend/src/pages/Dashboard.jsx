import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import StatCard from "../components/Dashboard/StatCard";
import useMyResults from "../services/useMyResults";
import { getStoredUser } from "../services/useSeries";

const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

const Dashboard = () => {
  const { results, isLoading, error } = useMyResults();
  const user = getStoredUser();

  const stats = useMemo(() => {
    if (!results.length)
      return { attempted: 0, avgScore: 0, accuracy: 0, best: null };

    let totalCorrect = 0;
    let totalQuestions = 0;
    let best = results[0];

    results.forEach((r) => {
      totalCorrect += r.correct || 0;
      totalQuestions += r.totalQuestions || 0;
      const rPct = r.totalQuestions ? (r.correct / r.totalQuestions) * 100 : 0;
      const bestPct = best.totalQuestions
        ? (best.correct / best.totalQuestions) * 100
        : 0;
      if (rPct > bestPct) best = r;
    });

    return {
      attempted: results.length,
      avgScore: totalQuestions
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0,
      accuracy: totalQuestions
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0,
      best,
    };
  }, [results]);

  // oldest -> newest, score % per attempt, for the trend line
  const trend = useMemo(() => {
    return [...results]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map((r, i) => ({
        name: `#${i + 1}`,
        score: r.totalQuestions
          ? Math.round((r.correct / r.totalQuestions) * 100)
          : 0,
      }));
  }, [results]);

  // accuracy grouped by technology, for the bar chart
  const byTech = useMemo(() => {
    const grouped = {};
    results.forEach((r) => {
      const key = r.technology || "unknown";
      if (!grouped[key]) grouped[key] = { correct: 0, total: 0 };
      grouped[key].correct += r.correct || 0;
      grouped[key].total += r.totalQuestions || 0;
    });
    return Object.entries(grouped).map(([tech, v]) => ({
      name: cap(tech),
      accuracy: v.total ? Math.round((v.correct / v.total) * 100) : 0,
    }));
  }, [results]);

  const recent = useMemo(
    () =>
      [...results]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 6),
    [results],
  );

  return (
    <div>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
          Welcome back{user?.name ? `, ${user.name}` : ""}
        </h1>
        <p className="text-gray-600 mb-6">
          Here&apos;s how your practice is going.
        </p>

        {isLoading && (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#16A34A]" />
          </div>
        )}

        {!isLoading && error && (
          <p className="text-center text-red-600 py-10">{error}</p>
        )}

        {!isLoading && !error && results.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
            <p className="text-gray-600 mb-4">
              You haven&apos;t attempted any test yet.
            </p>
            <Link
              to="/dashboard/test-series"
              className="inline-block bg-[#16A34A] hover:bg-[#15803D] text-white px-6 py-2.5 rounded-md font-medium"
            >
              Browse Test Series
            </Link>
          </div>
        )}

        {!isLoading && !error && results.length > 0 && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard title="Tests Attempted" value={stats.attempted} />
              <StatCard title="Average Score" value={`${stats.avgScore}%`} />
              <StatCard title="Accuracy" value={`${stats.accuracy}%`} />
              <StatCard
                title="Best Score"
                value={
                  stats.best
                    ? `${stats.best.correct}/${stats.best.totalQuestions}`
                    : "—"
                }
                sub={
                  stats.best
                    ? `${cap(stats.best.technology)} - ${cap(stats.best.level)}`
                    : ""
                }
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Score Trend
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={trend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#16A34A"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Accuracy by Technology
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={byTech}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis
                      domain={[0, 100]}
                      tick={{ fontSize: 12 }}
                      tickFormatter={(v) => `${v}%`}
                    />
                    <Tooltip formatter={(v) => `${v}%`} />
                    <Bar dataKey="accuracy" fill="#15803D" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent attempts */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Recent Attempts</h3>
                <Link
                  to="/dashboard/attempted-tests"
                  className="text-sm text-[#16A34A] hover:text-[#15803D] font-medium"
                >
                  View all
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recent.map((r) => {
                  const pct = r.totalQuestions
                    ? Math.round((r.correct / r.totalQuestions) * 100)
                    : 0;
                  return (
                    <div
                      key={r._id}
                      className="px-5 py-3 flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0">
                        <p className="font-medium text-gray-800 truncate">
                          {cap(r.technology)} - {cap(r.level)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleDateString()
                            : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-28 bg-gray-100 rounded-full h-2 hidden sm:block">
                          <div
                            className="bg-[#16A34A] h-2 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-sm font-semibold text-gray-700 w-14 text-right">
                          {r.correct}/{r.totalQuestions}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
