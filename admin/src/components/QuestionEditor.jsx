import { useMemo, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, ChevronDown, ImagePlus, PlusCircle, Trash2 } from "lucide-react";
import { api } from "../services/api/api";
import { useToast } from "./Toast";
import RichText from "./RichText";
import { Badge, Spinner, buttonStyles, cx, inputStyles } from "./ui";
import { emptyQuestion, questionIssues } from "../lib/csv";
import { looksRich } from "../lib/richText";

const LETTERS = ["A", "B", "C", "D"];
const PAGE = 20;
const TYPES = [
  { id: "mcq", label: "MCQ", hint: "One correct option" },
  { id: "msq", label: "MSQ", hint: "One or more correct" },
  { id: "nat", label: "NAT", hint: "Numerical answer" },
];
const TYPE_TONE = {
  mcq: "bg-blue-50 text-blue-700 ring-blue-200",
  msq: "bg-violet-50 text-violet-700 ring-violet-200",
  nat: "bg-amber-50 text-amber-700 ring-amber-200",
};

const label = "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400";

// Uploads a figure and hands back its Markdown, e.g. ![figure](https://...)
const ImageButton = ({ onInsert, title = "Insert image" }) => {
  const { toast } = useToast();
  const [busy, setBusy] = useState(false);
  const ref = useRef(null);

  const pick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    try {
      const form = new FormData();
      form.append("image", file);
      const { url } = await api.post("/admin/upload-image", form);
      onInsert(`![figure](${url})`);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <input ref={ref} type="file" accept="image/png,image/jpeg,image/webp,image/gif" className="hidden" onChange={pick} aria-label={title} />
      <button type="button" onClick={() => ref.current?.click()} disabled={busy} title={title} aria-label={title}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-bold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-60">
        {busy ? <Spinner size={13} /> : <ImagePlus size={14} />} Image
      </button>
    </>
  );
};

// A text field that accepts Markdown + LaTeX, with an image button and a live preview
const RichField = ({ id, value, onChange, rows = 2, placeholder, compact }) => {
  const ref = useRef(null);

  const insert = (snippet) => {
    const el = ref.current;
    const s = el?.selectionStart ?? value.length;
    const e = el?.selectionEnd ?? s;
    const pad = (before) => (before && !before.endsWith("\n") ? "\n" : "");
    const text = `${value.slice(0, s)}${pad(value.slice(0, s))}${snippet}\n${value.slice(e)}`;
    onChange(text);
  };

  return (
    <div>
      <div className="relative">
        <textarea id={id} ref={ref} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
          className={cx(inputStyles, "h-auto py-2.5 font-mono text-[13px] leading-6", compact && "min-h-10")} spellCheck={false} />
      </div>
      <div className="mt-1.5 flex flex-wrap items-center gap-2">
        <ImageButton onInsert={insert} />
        <span className="text-[11px] text-slate-400">Maths: <code className="rounded bg-slate-100 px-1">$x^2$</code> · tables &amp; **bold** supported</span>
      </div>
      {looksRich(value) && (
        <div className="mt-2 rounded-xl border border-dashed border-emerald-200 bg-emerald-50/40 p-3 text-sm text-slate-800">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-emerald-600">Preview (what students see)</p>
          <RichText>{value}</RichText>
        </div>
      )}
    </div>
  );
};

const Row = ({ q, index, issues, open, onToggle, onChange, onRemove }) => {
  const set = (patch) => onChange({ ...q, ...patch });
  const setOption = (i, v) => set({ options: q.options.map((o, j) => (j === i ? v : o)) });
  const type = q.type || "mcq";

  const toggleKey = (letter) =>
    set({ answerKeys: q.answerKeys.includes(letter) ? q.answerKeys.filter((k) => k !== letter) : [...q.answerKeys, letter].sort() });

  const answerLabel = type === "nat" ? (q.natMin !== "" ? `${q.natMin}${q.natMax !== "" ? `–${q.natMax}` : ""}` : "") : type === "msq" ? q.answerKeys.join(",") : q.answerKey;

  return (
    <li className={cx("rounded-2xl border bg-white transition", issues.length ? "border-rose-200" : "border-slate-200", open && "shadow-md")}>
      <div className="flex items-center gap-3 px-4 py-3">
        <button type="button" onClick={onToggle} aria-expanded={open} aria-label={`${open ? "Collapse" : "Edit"} question ${index + 1}`}
          className="flex min-w-0 flex-1 items-center gap-3 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-500">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500">{index + 1}</span>
          <Badge className={TYPE_TONE[type]}>{type.toUpperCase()}</Badge>
          <span className={cx("min-w-0 flex-1 truncate text-sm font-semibold", q.question ? "text-slate-900" : "italic text-slate-400")}>
            {q.question.replace(/!\[[^\]]*\]\([^)]+\)/g, "[figure]").replace(/\s+/g, " ").trim() || "Untitled question"}
          </span>
          {q.marks !== "" && <Badge className="hidden bg-slate-50 text-slate-600 ring-slate-200 sm:inline-flex">{q.marks}m</Badge>}
          {q.topic && <Badge className="hidden bg-slate-50 text-slate-600 ring-slate-200 md:inline-flex">{q.topic}</Badge>}
          {issues.length ? (
            <Badge className="bg-rose-50 text-rose-700 ring-rose-200"><AlertCircle size={12} className="mr-1" />{issues.length}</Badge>
          ) : (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600"><CheckCircle2 size={14} />{answerLabel}</span>
          )}
          <ChevronDown size={16} className={cx("shrink-0 text-slate-400 transition", open && "rotate-180")} />
        </button>
        <button type="button" onClick={onRemove} className={cx(buttonStyles.icon, "hover:bg-rose-50 hover:text-rose-600")} aria-label={`Remove question ${index + 1}`}>
          <Trash2 size={16} />
        </button>
      </div>

      {open && (
        <div className="space-y-5 border-t border-slate-100 px-4 pb-5 pt-4">
          {issues.length > 0 && (
            <ul className="space-y-1 rounded-xl bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
              {issues.map((i) => <li key={i}>• {i}</li>)}
            </ul>
          )}

          <div>
            <span className={label}>Question type</span>
            <div role="radiogroup" aria-label="Question type" className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button key={t.id} type="button" role="radio" aria-checked={type === t.id} onClick={() => set({ type: t.id })}
                  className={cx("rounded-xl border px-3.5 py-2 text-left transition", type === t.id ? "border-slate-950 bg-slate-950 text-white" : "border-slate-200 text-slate-600 hover:border-slate-300")}>
                  <span className="block text-sm font-extrabold">{t.label}</span>
                  <span className={cx("block text-[11px]", type === t.id ? "text-slate-300" : "text-slate-400")}>{t.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={label} htmlFor={`${q.key}-q`}>Question</label>
            <RichField id={`${q.key}-q`} value={q.question} onChange={(v) => set({ question: v })} rows={3} />
          </div>

          {type === "nat" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={label} htmlFor={`${q.key}-min`}>Correct answer {q.natMax !== "" ? "(from)" : ""}</label>
                <input id={`${q.key}-min`} inputMode="decimal" value={q.natMin} onChange={(e) => set({ natMin: e.target.value })} placeholder="e.g. 12.5" className={inputStyles} />
              </div>
              <div>
                <label className={label} htmlFor={`${q.key}-max`}>Up to (optional range)</label>
                <input id={`${q.key}-max`} inputMode="decimal" value={q.natMax} onChange={(e) => set({ natMax: e.target.value })} placeholder="e.g. 13.5" className={inputStyles} />
              </div>
              <p className="text-xs text-slate-400 sm:col-span-2">Students type a number on an on-screen keypad. Any value from the first to the second number is accepted; leave the range empty for an exact answer.</p>
            </div>
          ) : (
            <fieldset>
              <legend className={label}>Options · {type === "msq" ? "tick every correct one" : "select the correct one"}</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {q.options.map((o, i) => {
                  const correct = type === "msq" ? q.answerKeys.includes(LETTERS[i]) : q.answerKey === LETTERS[i];
                  return (
                    <div key={i} className={cx("rounded-xl border p-2 transition", correct ? "border-emerald-300 bg-emerald-50/60" : "border-slate-200")}>
                      <div className="flex items-start gap-2.5">
                        <input
                          type={type === "msq" ? "checkbox" : "radio"}
                          name={`${q.key}-ans`}
                          checked={correct}
                          onChange={() => (type === "msq" ? toggleKey(LETTERS[i]) : set({ answerKey: LETTERS[i] }))}
                          className="mt-2 h-4 w-4 shrink-0 accent-emerald-600"
                          aria-label={`Option ${LETTERS[i]} is correct`}
                        />
                        <span className="mt-1.5 w-4 shrink-0 text-xs font-black text-slate-400">{LETTERS[i]}</span>
                        <div className="min-w-0 flex-1">
                          <RichField id={`${q.key}-o${i}`} value={o} onChange={(v) => setOption(i, v)} rows={1} compact placeholder={`Option ${LETTERS[i]}`} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </fieldset>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={label} htmlFor={`${q.key}-m`}>Marks</label>
              <input id={`${q.key}-m`} inputMode="decimal" value={q.marks} onChange={(e) => set({ marks: e.target.value })} placeholder="quiz default" className={inputStyles} />
            </div>
            <div>
              <label className={label} htmlFor={`${q.key}-n`}>Negative marks</label>
              <input id={`${q.key}-n`} inputMode="decimal" value={q.negativeMarks} onChange={(e) => set({ negativeMarks: e.target.value })} placeholder={type === "mcq" ? "auto" : "none"} className={inputStyles} />
            </div>
            <div>
              <label className={label} htmlFor={`${q.key}-t`}>Section / topic</label>
              <input id={`${q.key}-t`} list="topic-suggestions" value={q.topic} onChange={(e) => set({ topic: e.target.value })} placeholder="e.g. General Aptitude" className={inputStyles} />
            </div>
          </div>

          <div>
            <label className={label} htmlFor={`${q.key}-e`}>Explanation (shown in the solutions)</label>
            <RichField id={`${q.key}-e`} value={q.explanation} onChange={(v) => set({ explanation: v })} rows={2} />
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
  const add = (type) => {
    const q = emptyQuestion(type);
    // new questions inherit the section of the previous one (papers are filled in section by section)
    q.topic = questions[questions.length - 1]?.topic || "";
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
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button key={t.id} type="button" onClick={() => add(t.id)} className={buttonStyles.secondary}><PlusCircle size={15} /> {t.label}</button>
          ))}
        </div>
      </div>

      {questions.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-500">No questions yet. Import a CSV/JSON file above or add one manually.</p>
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
