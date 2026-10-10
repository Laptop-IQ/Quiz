import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Activity, Library, BarChart3, PlusCircle, Clock, Trophy, UserPlus, FileQuestion } from "lucide-react";
import { api } from "../services/api/api";
import { Badge, Card, ErrorState, PageHeader, Skeleton, StatCard, buttonStyles, cx } from "../components/ui";
import { CATEGORIES, getCategory, LEVEL_TONE } from "../lib/categories";
import { formatTime, initials, prettySlug, timeAgo } from "../lib/format";

const scoreTone = (s) => (s >= 70 ? "text-emerald-600" : s >= 40 ? "text-amber-600" : "text-rose-600");

// 14-day attempts bar chart (plain SVG, no chart library needed)
const AttemptsChart = ({ data }) => {
  const max = Math.max(1, ...data.map((d) => d.attempts));
  const total = data.reduce((n, d) => n + d.attempts, 0);
  const W = 560;
  const H = 150;
  const gap = 8;
  const bw = (W - gap * (data.length - 1)) / data.length;

  return (
    <div>
      <p className="mb-3 text-xs text-slate-500">
        <span className="text-base font-black text-slate-950">{total}</span> attempts in the last 14 days
      </p>
      <svg viewBox={`0 0 ${W} ${H + 22}`} className="w-full" role="img" aria-label={`Attempts per day, ${total} in total over the last 14 days`}>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1="0" x2={W} y1={H - H * f} y2={H - H * f} stroke="#eef2f7" />
        ))}
        {data.map((d, i) => {
          const h = Math.max(d.attempts ? 4 : 2, (d.attempts / max) * (H - 8));
          const x = i * (bw + gap);
          const day = new Date(`${d.date}T00:00:00Z`);
          return (
            <g key={d.date}>
              <title>{`${d.date}: ${d.attempts} attempt${d.attempts === 1 ? "" : "s"}`}</title>
              <rect x={x} y={H - h} width={bw} height={h} rx="5" className={d.attempts ? "fill-emerald-500" : "fill-slate-200"} />
              {(i % 2 === 0 || data.length < 8) && (
                <text x={x + bw / 2} y={H + 16} textAnchor="middle" className="fill-slate-400" fontSize="10">
                  {day.getUTCDate()}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const Overview = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      setData(await api.get("/admin/overview"));
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const loading = !data && !error;
  const maxCat = Math.max(1, ...(data?.byCategory || []).map((c) => c.quizzes));

  return (
    <>
      <PageHeader title="Overview" subtitle="How your platform is doing right now.">
        <Link to="/quizzes/new" className={buttonStyles.primary}>
          <PlusCircle size={16} /> Add quiz
        </Link>
      </PageHeader>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard loading={loading} icon={Users} tone="bg-blue-50 text-blue-600" label="Total users" value={data?.users.total ?? 0}
              detail={`+${data?.users.newThisWeek ?? 0} this week · ${data?.users.verified ?? 0} verified`} />
            <StatCard loading={loading} icon={Activity} tone="bg-emerald-50 text-emerald-600" label="Active learners" value={data?.users.active30d ?? 0}
              detail="Took a test in the last 30 days" />
            <StatCard loading={loading} icon={Library} tone="bg-violet-50 text-violet-600" label="Quizzes" value={data?.content.quizzes ?? 0}
              detail={`${data?.content.series ?? 0} series · ${data?.content.questions ?? 0} questions`} />
            <StatCard loading={loading} icon={BarChart3} tone="bg-amber-50 text-amber-600" label="Attempts" value={data?.attempts.total ?? 0}
              detail={data?.attempts.total ? `Avg score ${data.attempts.avgScore}% · avg time ${formatTime(data.attempts.avgTime)}` : "No attempts yet"} />
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="p-5 lg:col-span-2">
              <h2 className="mb-4 text-base font-extrabold text-slate-950">Attempts per day</h2>
              {loading ? <Skeleton className="h-44 w-full" /> : <AttemptsChart data={data.attemptsPerDay} />}
            </Card>

            <Card className="p-5">
              <h2 className="mb-4 text-base font-extrabold text-slate-950">Quizzes by exam</h2>
              {loading ? (
                <Skeleton className="h-44 w-full" />
              ) : data.byCategory.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">No quizzes yet.</p>
              ) : (
                <ul className="space-y-3">
                  {data.byCategory.map((c) => {
                    const cat = getCategory(c.category);
                    return (
                      <li key={c.category}>
                        <div className="mb-1 flex justify-between text-xs font-bold">
                          <span className="text-slate-700">{cat.label}</span>
                          <span className="text-slate-400">{c.quizzes}</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div className={cx("h-full rounded-full", cat.bar)} style={{ width: `${(c.quizzes / maxCat) * 100}%` }} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-950"><Trophy size={17} className="text-amber-500" /> Most attempted quizzes</h2>
                <Link to="/quizzes" className="text-xs font-bold text-emerald-600 hover:underline">View all</Link>
              </div>
              {loading ? (
                <Skeleton className="h-40 w-full" />
              ) : data.topQuizzes.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">Attempts will show up here.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {data.topQuizzes.map((t, i) => (
                    <li key={`${t.technology}-${t.level}`} className="flex items-center gap-3 py-3">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500">{i + 1}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">{t.name || prettySlug(t.technology)}</p>
                        <Badge className={LEVEL_TONE[t.level] || "bg-slate-100 text-slate-600 ring-slate-200"}>{t.level}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">{t.attempts}</p>
                        <p className={cx("text-xs font-bold", scoreTone(t.avgScore))}>{t.avgScore}% avg</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card className="p-5">
              <h2 className="mb-4 flex items-center gap-2 text-base font-extrabold text-slate-950"><Clock size={17} className="text-sky-500" /> Recent attempts</h2>
              {loading ? (
                <Skeleton className="h-40 w-full" />
              ) : data.recentAttempts.length === 0 ? (
                <p className="py-8 text-center text-sm text-slate-500">No attempts yet.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {data.recentAttempts.map((a) => (
                    <li key={a._id} className="flex items-center gap-3 py-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-black text-slate-600">{initials(a.user)}</div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-900">{a.user}</p>
                        <p className="truncate text-xs text-slate-500">{a.name || prettySlug(a.technology)} · {a.level} · {formatTime(a.timeTaken)}</p>
                      </div>
                      <div className="text-right">
                        <p className={cx("text-sm font-black", scoreTone(a.score))}>{a.score}%</p>
                        <p className="text-[11px] text-slate-400">{timeAgo(a.createdAt)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-extrabold text-slate-950"><UserPlus size={17} className="text-emerald-500" /> Newest users</h2>
              <Link to="/users" className="text-xs font-bold text-emerald-600 hover:underline">All users</Link>
            </div>
            {loading ? (
              <Skeleton className="h-24 w-full" />
            ) : data.recentUsers.length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-500">No users yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {data.recentUsers.map((u) => (
                  <div key={u._id} className="flex items-center gap-3 rounded-xl border border-slate-100 p-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-sm font-black text-emerald-700">{initials(u.name)}</div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-slate-900">{u.name}</p>
                      <p className="truncate text-xs text-slate-500">{u.email}</p>
                    </div>
                    <span className="ml-auto shrink-0 text-[11px] text-slate-400">{timeAgo(u.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {!loading && data.content.quizzes === 0 && (
            <Card className="flex flex-col items-center gap-3 border-dashed p-8 text-center">
              <FileQuestion className="text-slate-400" size={28} />
              <p className="font-extrabold text-slate-900">No quizzes yet</p>
              <p className="max-w-md text-sm text-slate-500">Create your first quiz by importing a CSV of questions for any of the {CATEGORIES.length} exam categories.</p>
              <Link to="/quizzes/new" className={buttonStyles.primary}>Add your first quiz</Link>
            </Card>
          )}
        </div>
      )}
    </>
  );
};

export default Overview;
