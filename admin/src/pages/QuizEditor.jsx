import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useBlocker, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, FileUp, Info, Save, TriangleAlert, Upload } from "lucide-react";
import { api } from "../services/api/api";
import { useToast } from "../components/Toast";
import QuestionEditor from "../components/QuestionEditor";
import { Card, ConfirmDialog, ErrorState, PageHeader, Skeleton, Spinner, buttonStyles, cx, inputStyles } from "../components/ui";
import { CATEGORIES, LEVELS, NEGATIVE_PRESETS } from "../lib/categories";
import { downloadTemplate, fromApiQuestions, parseCSV, questionIssues, rowsToQuestions, toPayloadQuestions } from "../lib/csv";
import { slugify } from "../lib/format";

const Field = ({ label, hint, htmlFor, children }) => (
  <div>
    <label htmlFor={htmlFor} className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">{label}</label>
    {children}
    {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
  </div>
);

const blank = { category: "ssc", examName: "", technology: "", level: "Basic", timeLimit: 30, marksPerQuestion: 1, negativeMarking: 0 };

const QuizEditor = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileRef = useRef(null);

  const [form, setForm] = useState(blank);
  const [slugTouched, setSlugTouched] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [importInfo, setImportInfo] = useState("");
  const [existing, setExisting] = useState([]);
  const [pendingReplace, setPendingReplace] = useState(null);

  const load = useCallback(async () => {
    setLoadError("");
    setLoading(true);
    try {
      const q = await api.get(`/admin/quiz/${id}`);
      setForm({
        category: q.category, examName: q.examName || "", technology: q.technology, level: q.level,
        timeLimit: q.timeLimit, marksPerQuestion: q.marksPerQuestion, negativeMarking: q.negativeMarking,
      });
      setQuestions(fromApiQuestions(q.questions));
      setSlugTouched(true);
    } catch (e) {
      setLoadError(e.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEdit) load();
    else api.get("/admin/quizzes").then(setExisting).catch(() => {}); // for the "will replace" warning
  }, [isEdit, load]);

  // ---- unsaved-changes guard ----
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  const blocker = useBlocker(({ currentLocation, nextLocation }) => dirty && !saving && currentLocation.pathname !== nextLocation.pathname);

  const setField = (patch) => { setForm((f) => ({ ...f, ...patch })); setDirty(true); };
  const onName = (value) => {
    setField({ examName: value, ...(slugTouched || isEdit ? {} : { technology: slugify(value) }) });
  };
  const changeQuestions = (next) => { setQuestions(next); setDirty(true); };

  // ---- CSV import ----
  const importFile = async (file, mode) => {
    if (!file) return;
    if (!/\.(csv|txt)$/i.test(file.name) && file.type !== "text/csv") {
      toast("Please choose a .csv file", "error");
      return;
    }
    const parsed = rowsToQuestions(parseCSV(await file.text()));
    if (!parsed.length) {
      toast("No questions found in that file. Download the template to see the expected format.", "error");
      return;
    }
    const next = mode === "append" ? [...questions, ...parsed] : parsed;
    const bad = parsed.filter((q) => questionIssues(q).length).length;
    setQuestions(next);
    setDirty(true);
    setImportInfo(`${file.name}: ${parsed.length} question${parsed.length === 1 ? "" : "s"} read${bad ? `, ${bad} need attention below` : ", all valid"}.`);
  };

  const pickFile = (mode) => (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (mode === "replace" && questions.length) setPendingReplace(file);
    else importFile(file, mode);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (questions.length && file) setPendingReplace(file);
    else importFile(file, "replace");
  };

  // ---- validation / save ----
  const duplicate = !isEdit && existing.find((z) => z.technology === form.technology && z.level === form.level);
  const issues = useMemo(() => questions.filter((q) => questionIssues(q, questions).length).length, [questions]);
  const problems = [];
  if (!form.examName.trim()) problems.push("Enter the exam / series name");
  if (!/^[a-z0-9][a-z0-9-]*$/.test(form.technology)) problems.push("Series ID must use letters, numbers and hyphens");
  if (!(Number(form.timeLimit) >= 1)) problems.push("Set a time limit");
  if (!(Number(form.marksPerQuestion) > 0)) problems.push("Marks per question must be above 0");
  if (questions.length === 0) problems.push("Add at least one question");
  if (issues) problems.push(`${issues} question${issues === 1 ? "" : "s"} need attention`);

  const save = async () => {
    if (problems.length) return;
    setSaving(true);
    const settings = {
      category: form.category, examName: form.examName.trim(), timeLimit: Number(form.timeLimit),
      marksPerQuestion: Number(form.marksPerQuestion), negativeMarking: Number(form.negativeMarking) || 0,
      questions: toPayloadQuestions(questions),
    };
    try {
      if (isEdit) await api.put(`/admin/quiz/${id}`, settings);
      else await api.post("/admin/upload-quiz", { technology: form.technology, level: form.level, ...settings });
      setDirty(false);
      toast(isEdit ? "Changes saved" : duplicate ? "Quiz replaced successfully" : "Quiz created");
      setTimeout(() => navigate("/quizzes"), 0);
    } catch (e) {
      toast(e.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (loadError) return <ErrorState message={loadError} onRetry={load} />;
  if (loading) return <div className="space-y-4"><Skeleton className="h-10 w-64" /><Skeleton className="h-64 w-full" /><Skeleton className="h-40 w-full" /></div>;

  const presetActive = NEGATIVE_PRESETS.some((p) => p.value === Number(form.negativeMarking));

  return (
    <div className="pb-28">
      <Link to="/quizzes" className="mb-3 inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-900"><ArrowLeft size={15} /> Back to quizzes</Link>
      <PageHeader title={isEdit ? `Edit ${form.examName || form.technology} · ${form.level}` : "Add quiz"} subtitle={isEdit ? "Change settings or fix questions, then save." : "Set up the exam, import questions from a CSV, review and publish."} />

      <div className="space-y-6">
        <Card className="p-5 sm:p-6">
          <h2 className="mb-5 text-base font-extrabold text-slate-950">1. Quiz details</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Field label="Exam category" htmlFor="category">
              <select id="category" value={form.category} onChange={(e) => setField({ category: e.target.value })} className={inputStyles}>
                {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Exam / series name" htmlFor="examName" hint="Shown to students, e.g. SSC CGL">
              <input id="examName" value={form.examName} onChange={(e) => onName(e.target.value)} placeholder="SSC CGL" className={inputStyles} maxLength={60} />
            </Field>
            <Field label="Series ID" htmlFor="technology" hint={isEdit ? "Fixed after creation." : "Used in URLs. Auto-filled from the name."}>
              <input id="technology" value={form.technology} disabled={isEdit} maxLength={40}
                onChange={(e) => { setSlugTouched(true); setField({ technology: slugify(e.target.value) }); }} placeholder="ssc-cgl" className={inputStyles} />
            </Field>

            <Field label="Level">
              <div role="radiogroup" aria-label="Level" className="flex gap-1.5">
                {LEVELS.map((l) => (
                  <button key={l} type="button" role="radio" aria-checked={form.level === l} disabled={isEdit} onClick={() => setField({ level: l })}
                    className={cx("h-10 flex-1 rounded-xl border text-sm font-bold transition disabled:cursor-not-allowed", form.level === l ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 disabled:opacity-50")}>
                    {l}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Time limit (minutes)" htmlFor="timeLimit">
              <input id="timeLimit" type="number" min={1} max={600} value={form.timeLimit} onChange={(e) => setField({ timeLimit: e.target.value })} className={inputStyles} />
            </Field>
            <Field label="Marks per correct answer" htmlFor="marks">
              <input id="marks" type="number" min={0.25} step={0.25} value={form.marksPerQuestion} onChange={(e) => setField({ marksPerQuestion: e.target.value })} className={inputStyles} />
            </Field>

            <div className="sm:col-span-2 lg:col-span-3">
              <Field label="Negative marking (deducted per wrong answer)">
                <div className="flex flex-wrap items-center gap-2">
                  {NEGATIVE_PRESETS.map((p) => (
                    <button key={p.value} type="button" aria-pressed={Number(form.negativeMarking) === p.value} onClick={() => setField({ negativeMarking: p.value })}
                      className={cx("h-10 rounded-xl border px-4 text-sm font-bold transition", Number(form.negativeMarking) === p.value ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-slate-200 text-slate-600 hover:border-slate-300")}>
                      {p.label}
                    </button>
                  ))}
                  <input aria-label="Custom negative marking" type="number" min={0} step={0.01} value={form.negativeMarking} onChange={(e) => setField({ negativeMarking: e.target.value })}
                    className={cx(inputStyles, "!w-28", !presetActive && "border-emerald-400")} />
                </div>
              </Field>
            </div>
          </div>

          {duplicate && (
            <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900" role="status">
              <TriangleAlert size={18} className="mt-0.5 shrink-0" />
              <p>A <b>{form.level}</b> quiz for <b>{duplicate.examName || duplicate.technology}</b> already exists ({duplicate.questionCount} questions). Saving will <b>replace</b> its questions and settings. <Link to={`/quizzes/${duplicate._id}`} className="font-bold underline">Edit it instead</Link></p>
            </div>
          )}
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <h2 className="text-base font-extrabold text-slate-950">{isEdit ? "2. Questions" : "2. Import questions"}</h2>
            <button type="button" onClick={downloadTemplate} className={buttonStyles.secondary}><Download size={15} /> CSV template</button>
          </div>

          <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={pickFile(isEdit ? "append" : "replace")} aria-label="Choose CSV file" />
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}
            className={cx("flex flex-col items-center rounded-2xl border-2 border-dashed px-6 py-8 text-center transition", dragging ? "border-emerald-500 bg-emerald-50" : "border-slate-300 bg-slate-50/60")}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm"><FileUp size={22} /></div>
            <p className="mt-3 text-sm font-bold text-slate-900">Drag & drop a CSV file here</p>
            <p className="mt-1 max-w-lg text-xs text-slate-500">Columns: Question, Option A–D, Answer (A/B/C/D, 1–4 or the option text) and an optional Topic. Rows with an answer we cannot match are flagged for you to fix, never guessed.</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button type="button" onClick={() => fileRef.current?.click()} className={buttonStyles.primary}><Upload size={15} /> {isEdit ? "Append from CSV" : "Choose CSV file"}</button>
              {isEdit && (
                <label className={cx(buttonStyles.secondary, "cursor-pointer")}>
                  Replace all with CSV
                  <input type="file" accept=".csv,text/csv" className="hidden" onChange={pickFile("replace")} />
                </label>
              )}
            </div>
          </div>

          {importInfo && (
            <p className="mt-3 flex items-center gap-2 rounded-xl bg-sky-50 px-3 py-2 text-xs font-semibold text-sky-800" role="status"><Info size={14} />{importInfo}</p>
          )}

          <div className="mt-6">
            <QuestionEditor questions={questions} onChange={changeQuestions} />
          </div>
        </Card>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 backdrop-blur lg:left-64">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p className={cx("text-sm font-semibold", problems.length ? "text-amber-700" : "text-emerald-700")} aria-live="polite">
            {problems.length ? problems[0] + (problems.length > 1 ? ` (+${problems.length - 1} more)` : "") : `Ready · ${questions.length} questions · ${form.marksPerQuestion * questions.length} total marks`}
          </p>
          <div className="flex gap-2">
            <Link to="/quizzes" className={buttonStyles.secondary}>Cancel</Link>
            <button onClick={save} disabled={saving || problems.length > 0 || (isEdit && !dirty)} className={buttonStyles.primary}>
              {saving ? <Spinner /> : <Save size={16} />} {isEdit ? "Save changes" : duplicate ? "Replace quiz" : "Create quiz"}
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog open={!!pendingReplace} danger title="Replace all questions?" confirmLabel="Replace" onCancel={() => setPendingReplace(null)}
        onConfirm={() => { importFile(pendingReplace, "replace"); setPendingReplace(null); }}>
        The {questions.length} questions currently in the editor will be replaced by the contents of <b className="text-slate-800">{pendingReplace?.name}</b>.
      </ConfirmDialog>

      <ConfirmDialog open={blocker.state === "blocked"} title="Discard unsaved changes?" confirmLabel="Discard" danger onCancel={() => blocker.reset?.()} onConfirm={() => blocker.proceed?.()}>
        You have changes that haven&apos;t been saved. If you leave now they will be lost.
      </ConfirmDialog>
    </div>
  );
};

export default QuizEditor;
