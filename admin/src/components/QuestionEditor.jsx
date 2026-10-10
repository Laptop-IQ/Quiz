import { useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, PlusCircle, Trash2 } from "lucide-react";
import { Badge, buttonStyles, cx, inputStyles } from "./ui";
import { emptyQuestion, questionIssues } from "../lib/csv";

const LETTERS = ["A", "B", "C", "D"];
const PAGE = 20;

const Row = ({ q, index, issues, open, onToggle, onChange, onRemove }) => {
  const set = (patch) => onChange({ ...q, ...patch });
  const setOption = (i, v) => set({ options: q.options.map((o, j) => (j === i ? v : o)) });

  return (
    <li className={cx("rounded-2xl border bg-white transition", issues.length ? "border-rose-200" : "border-slate-200", open && "shadow-md")}>
      <div className="flex items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={`${open ? "Collapse" : "Edit"} question ${index + 1}`}
          className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500">{index + 1}</span>
          <span className={cx("min-w-0 flex-1 truncate text-sm font-semibold", q.question ? "text-slate-900" : "italic text-slate-400")}>
            {q.question || "Untitled question"}
          </span>
          {q.topic && <Badge className="hidden bg-slate-50 text-slate-600 ring-slate-200 sm:inline-flex">{q.topic}</Badge>}
          {issues.length ? (
            <Badge className="bg-rose-50 text-rose-700 ring-rose-200"><AlertCircle size={12} className="mr-1" />{issues.length}</Badge>
          ) : (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle2 size={14} />{q.answerKey}</span>
          )}
          <ChevronDown size={16} className={cx("shrink-0 text-slate-400 transition", open && "rotate-180")} />
        </button>
        <button type="button" onClick={onRemove} className={cx(buttonStyles.icon, "hover:bg-rose-50 hover:text-rose-600")} aria-label={`Remove question ${index + 1}`}>
          <Trash2 size={16} />
        </button>
      </div>

      {open && (
        <div className="space-y-4 border-t border-slate-100 px-4 pb-5 pt-4">
          {issues.length > 0 && (
            <ul className="space-y-1 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
              {issues.map((i) => <li key={i}>• {i}</li>)}
            </ul>
          )}

          <div>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400" htmlFor={`${q.key}-q`}>Question</label>
            <textarea id={`${q.key}-q`} rows={2} value={q.question} onChange={(e) => set({ question: e.target.value })} className={cx(inputStyles, "h-auto py-2.5 leading-6")} />
          </div>

          <fieldset>
            <legend className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400">Options · select the correct one</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {q.options.map((o, i) => {
                const correct = q.answerKey === LETTERS[i];
                return (
                  <label key={i} className={cx("flex items-center gap-2.5 rounded-xl border p-2 transition", correct ? "border-emerald-300 bg-emerald-50/60" : "border-slate-200")}>
                    <input
                      type="radio"
                      name={`${q.key}-ans`}
                      checked={correct}
                      onChange={() => set({ answerKey: LETTERS[i] })}
                      className="h-4 w-4 shrink-0 accent-emerald-600"
                      aria-label={`Option ${LETTERS[i]} is correct`}
                    />
                    <span className="w-4 shrink-0 text-xs font-black text-slate-400">{LETTERS[i]}</span>
                    <input value={o} onChange={(e) => setOption(i, e.target.value)} placeholder={`Option ${LETTERS[i]}`} className="min-w-0 flex-1 bg-transparent text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400" />
                  </label>
                );
              })}
            </div>
          </fieldset>

          <div className="sm:max-w-xs">
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400" htmlFor={`${q.key}-t`}>Topic / subject</label>
            <input id={`${q.key}-t`} list="topic-suggestions" value={q.topic} onChange={(e) => set({ topic: e.target.value })} placeholder="e.g. Quantitative Aptitude" className={inputStyles} />
          </div>
        </div>
      )}
    </li>
  );
};

const QuestionEditor = ({ questions, onChange }) => {
  const [openKey, setOpenKey] = useState(null);
  const [onlyIssues, setOnlyIssues] = useState(false);
  const [limit, setLimit] = useState(PAGE);

  const issuesMap = useMemo(() => new Map(questions.map((q) => [q.key, questionIssues(q, questions)])), [questions]);
  const topics = useMemo(() => [...new Set(questions.map((q) => q.topic.trim()).filter(Boolean))], [questions]);
  const issueCount = [...issuesMap.values()].filter((i) => i.length).length;

  const rows = questions.map((q, index) => ({ q, index })).filter(({ q }) => !onlyIssues || issuesMap.get(q.key).length);
  const shown = rows.slice(0, limit);

  const update = (next) => onChange(questions.map((q) => (q.key === next.key ? next : q)));
  const remove = (key) => onChange(questions.filter((q) => q.key !== key));
  const add = () => {
    const q = emptyQuestion();
    onChange([...questions, q]);
    setOnlyIssues(false);
    setLimit(questions.length + 1);
    setOpenKey(q.key);
  };

  return (
    <div>
      <datalist id="topic-suggestions">{topics.map((t) => <option key={t} value={t} />)}</datalist>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <b className="text-slate-900">{questions.length} question{questions.length === 1 ? "" : "s"}</b>
          {issueCount > 0 ? (
            <button type="button" onClick={() => setOnlyIssues((v) => !v)} className={cx("rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset transition", onlyIssues ? "bg-rose-600 text-white ring-rose-600" : "bg-rose-50 text-rose-700 ring-rose-200 hover:bg-rose-100")}>
              {issueCount} need{issueCount === 1 ? "s" : ""} attention {onlyIssues ? "· showing only these" : "· show"}
            </button>
          ) : (
            questions.length > 0 && <span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle2 size={14} /> All questions are valid</span>
          )}
        </div>
        <button type="button" onClick={add} className={buttonStyles.secondary}><PlusCircle size={15} /> Add question</button>
      </div>

      {questions.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">No questions yet. Import a CSV above or add one manually.</p>
      ) : (
        <>
          <ul className="space-y-2.5">
            {shown.map(({ q, index }) => (
              <Row key={q.key} q={q} index={index} issues={issuesMap.get(q.key)} open={openKey === q.key}
                onToggle={() => setOpenKey(openKey === q.key ? null : q.key)} onChange={update} onRemove={() => remove(q.key)} />
            ))}
          </ul>
          {rows.length > shown.length && (
            <button type="button" onClick={() => setLimit((l) => l + PAGE)} className={cx(buttonStyles.secondary, "mt-4 w-full")}>
              Show {Math.min(PAGE, rows.length - shown.length)} more ({rows.length - shown.length} hidden)
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionEditor;
