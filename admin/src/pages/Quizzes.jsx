import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, PlusCircle, Pencil, Trash2, Library, Clock, X } from "lucide-react";
import { api } from "../services/api/api";
import { useToast } from "../components/Toast";
import { Badge, Card, ConfirmDialog, EmptyState, ErrorState, PageHeader, Skeleton, buttonStyles, cx, inputStyles } from "../components/ui";
import { CATEGORIES, getCategory, LEVELS, LEVEL_TONE } from "../lib/categories";
import { formatDate, markingLabel, prettySlug } from "../lib/format";

const SORTS = {
  updated: { label: "Recently updated", fn: (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt) },
  attempts: { label: "Most attempted", fn: (a, b) => b.attempts - a.attempts },
  questions: { label: "Most questions", fn: (a, b) => b.questionCount - a.questionCount },
  name: { label: "Name A → Z", fn: (a, b) => (a.examName || a.technology).localeCompare(b.examName || b.technology) },
};

// small caption shown above each value on mobile (the desktop table has a header row instead)
const lbl = "mb-0.5 block text-[10px] font-bold uppercase tracking-wide text-slate-400 lg:hidden";

const scoreTone = (s) => (s >= 70 ? "text-emerald-600" : s >= 40 ? "text-amber-600" : "text-rose-600");

const Quizzes = () => {
  const { toast } = useToast();
  const [quizzes, setQuizzes] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [level, setLevel] = useState("all");
  const [sort, setSort] = useState("updated");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      setQuizzes(await api.get("/admin/quizzes"));
    } catch (e) {
      setError(e.message);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    if (!quizzes) return [];
    const q = query.trim().toLowerCase();
    return quizzes
      .filter((z) => {
        if (category !== "all" && z.category !== category) return false;
        if (level !== "all" && z.level !== level) return false;
        return !q || `${z.examName || ""} ${z.technology} ${z.level} ${getCategory(z.category).label}`.toLowerCase().includes(q);
      })
      .sort(SORTS[sort].fn);
  }, [quizzes, query, category, level, sort]);

  const totals = useMemo(
    () => ({ questions: (quizzes || []).reduce((n, z) => n + z.questionCount, 0), attempts: (quizzes || []).reduce((n, z) => n + z.attempts, 0) }),
    [quizzes],
  );
  const filtersOn = query || category !== "all" || level !== "all";

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await api.del(`/admin/quiz/${toDelete._id}`);
      setQuizzes((list) => list.filter((z) => z._id !== toDelete._id));
      toast("Quiz deleted");
      setToDelete(null);
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setDeleting(false);
    }
  };

  const nameOf = (z) => z.examName || prettySlug(z.technology);

  return (
    <>
      <PageHeader title="Quizzes" subtitle={quizzes ? `${quizzes.length} quizzes · ${totals.questions} questions · ${totals.attempts} attempts` : "Manage every test series."}>
        <Link to="/quizzes/new" className={buttonStyles.primary}>
          <PlusCircle size={16} /> Add quiz
        </Link>
      </PageHeader>

      <Card className="mb-5 flex flex-col gap-3 p-4 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by exam, series or level…" aria-label="Search quizzes" className={cx(inputStyles, "pl-9 pr-9")} />
          {query && (
            <button onClick={() => setQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Clear search">
              <X size={14} />
            </button>
          )}
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filter by exam" className={cx(inputStyles, "lg:w-44")}>
          <option value="all">All exams</option>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <select value={level} onChange={(e) => setLevel(e.target.value)} aria-label="Filter by level" className={cx(inputStyles, "lg:w-40")}>
          <option value="all">All levels</option>
          {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort quizzes" className={cx(inputStyles, "lg:w-48")}>
          {Object.entries(SORTS).map(([id, s]) => <option key={id} value={id}>{s.label}</option>)}
        </select>
      </Card>

      {error ? (
        <ErrorState message={error} onRetry={load} />
      ) : !quizzes ? (
        <div className="space-y-3">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-20 w-full" />)}</div>
      ) : quizzes.length === 0 ? (
        <EmptyState icon={Library} title="No quizzes yet" text="Import a CSV of questions to create your first quiz.">
          <Link to="/quizzes/new" className={buttonStyles.primary}>Add quiz</Link>
        </EmptyState>
      ) : visible.length === 0 ? (
        <EmptyState icon={Search} title="No quizzes match your filters" text="Try a different keyword or clear the filters.">
          {filtersOn && <button className={buttonStyles.secondary} onClick={() => { setQuery(""); setCategory("all"); setLevel("all"); }}>Clear filters</button>}
        </EmptyState>
      ) : (
        <Card className="overflow-hidden">
          <div className="hidden grid-cols-[2.2fr_0.9fr_0.7fr_0.8fr_0.9fr_0.8fr_auto] gap-4 border-b border-slate-100 bg-slate-50/70 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 lg:grid">
            <span>Quiz</span><span>Level</span><span>Questions</span><span>Time</span><span>Marking</span><span>Attempts</span><span className="w-[84px]" />
          </div>
          <ul className="divide-y divide-slate-100">
            {visible.map((z) => {
              const cat = getCategory(z.category);
              return (
                <li key={z._id} className="grid gap-3 px-5 py-4 transition hover:bg-slate-50/60 lg:grid-cols-[2.2fr_0.9fr_0.7fr_0.8fr_0.9fr_0.8fr_auto] lg:items-center lg:gap-4">
                  <div className="min-w-0">
                    <Link to={`/quizzes/${z._id}`} className="block truncate text-sm font-extrabold text-slate-950 hover:text-emerald-600">{nameOf(z)}</Link>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                      <Badge className={cat.tone}>{cat.label}</Badge>
                      <span className="text-xs text-slate-400">ID: {z.technology} · {formatDate(z.updatedAt)}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 lg:contents">
                    <div>
                      <span className={lbl}>Level</span>
                      <Badge className={LEVEL_TONE[z.level] || "bg-slate-100 text-slate-600 ring-slate-200"}>{z.level}</Badge>
                    </div>
                    <div>
                      <span className={lbl}>Questions</span>
                      <p className="text-sm font-bold text-slate-800">{z.questionCount}</p>
                    </div>
                    <div>
                      <span className={lbl}>Time</span>
                      <p className="flex items-center gap-1 text-sm font-semibold text-slate-700"><Clock size={13} className="text-slate-400" />{z.timeLimit}m</p>
                    </div>
                    <div>
                      <span className={lbl}>Marking</span>
                      <p className="text-sm font-semibold text-slate-700">{markingLabel(z.marksPerQuestion, z.negativeMarking)}</p>
                    </div>
                    <div>
                      <span className={lbl}>Attempts</span>
                      <p className="text-sm font-bold text-slate-800">{z.attempts}</p>
                      {z.avgScore !== null && <p className={cx("text-xs font-bold", scoreTone(z.avgScore))}>{z.avgScore}% avg</p>}
                    </div>
                  </div>
                  <div className="flex gap-1 lg:w-[84px] lg:justify-end">
                    <Link to={`/quizzes/${z._id}`} className={buttonStyles.icon} aria-label={`Edit ${nameOf(z)} ${z.level}`} title="Edit"><Pencil size={16} /></Link>
                    <button onClick={() => setToDelete(z)} className={cx(buttonStyles.icon, "hover:bg-rose-50 hover:text-rose-600")} aria-label={`Delete ${nameOf(z)} ${z.level}`} title="Delete"><Trash2 size={16} /></button>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      )}

      <ConfirmDialog open={!!toDelete} danger busy={deleting} title="Delete this quiz?" confirmLabel="Delete quiz" onConfirm={confirmDelete} onCancel={() => setToDelete(null)}>
        <p>
          <b className="text-slate-800">{toDelete && nameOf(toDelete)} · {toDelete?.level}</b> ({toDelete?.questionCount} questions) will be removed and
          students can no longer take it. Their past results are kept.
        </p>
      </ConfirmDialog>
    </>
  );
};

export default Quizzes;
