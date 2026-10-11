const LETTERS = ["A", "B", "C", "D"];

let counter = 0;
export const newKey = () => `q${Date.now().toString(36)}${(counter += 1)}`;

export const emptyQuestion = (type = "mcq") => ({
  key: newKey(),
  type,
  question: "",
  options: ["", "", "", ""],
  answerKey: "",
  answerKeys: [],
  natMin: "",
  natMax: "",
  marks: "",
  negativeMarks: "",
  topic: "",
  explanation: "",
});

// ---------- CSV text -> rows (handles quotes, escaped quotes, CRLF, BOM) ----------
export const parseCSV = (text) => {
  const rows = [];
  let row = [];
  let cur = "";
  let quoted = false;
  const src = String(text).replace(/^\uFEFF/, "");

  for (let i = 0; i < src.length; i += 1) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"' && src[i + 1] === '"') {
        cur += '"';
        i += 1;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      row.push(cur);
      cur = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i += 1;
      row.push(cur);
      cur = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else {
      cur += ch;
    }
  }
  row.push(cur);
  if (row.some((c) => c.trim() !== "")) rows.push(row);
  return rows;
};

// ---------- answer parsing ----------

// "B", "b", "(B)", "Option B", "2" -> "B". Anything else -> "" (never guessed)
const letterFrom = (raw) => {
  const m = String(raw).trim().match(/^(?:option|opt|choice|ans(?:wer)?)?\s*[.:)-]?\s*\(?([a-d1-4])\)?\.?$/i);
  if (!m) return "";
  const c = m[1].toUpperCase();
  return /[1-4]/.test(c) ? LETTERS[Number(c) - 1] : c;
};

// Answer may be a letter, a number 1-4, or the exact text of one option.
export const resolveAnswer = (raw, options) => {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  const byLetter = letterFrom(value);
  if (byLetter) return byLetter;
  const idx = options.findIndex((o) => o.trim().toLowerCase() === value.toLowerCase());
  return idx >= 0 ? LETTERS[idx] : "";
};

// MSQ answer: "A;C", "A, C", "A|C", "ACD", or option texts separated by ;
export const resolveAnswers = (raw, options) => {
  const value = String(raw ?? "").trim();
  if (!value) return [];
  let tokens = value.split(/[;,|/&]+/).map((t) => t.trim()).filter(Boolean);
  if (tokens.length === 1 && /^[a-d]{2,4}$/i.test(tokens[0])) tokens = tokens[0].split("");
  if (tokens.length === 1 && /^[1-4]{2,4}$/.test(tokens[0])) tokens = tokens[0].split("");
  const keys = tokens.map((t) => resolveAnswer(t, options));
  return keys.every(Boolean) ? [...new Set(keys)].sort() : [];
};

const NUM = "-?(?:\\d+\\.?\\d*|\\.\\d+)";
// NAT answer: "50", "12.5", "12.5 to 13.5", "12.5-13.5", "12.5:13.5"
export const parseNat = (raw) => {
  const s = String(raw ?? "").trim();
  if (!s) return null;
  let m = s.match(new RegExp(`^(${NUM})$`));
  if (m) return { natMin: m[1], natMax: "" };
  m = s.match(new RegExp(`^(${NUM})\\s*(?:to|~|:|;)\\s*(${NUM})$`, "i")) || s.match(new RegExp(`^(${NUM})\\s*-\\s*(${NUM})$`));
  return m ? { natMin: m[1], natMax: m[2] } : null;
};

const normType = (raw) => {
  const t = String(raw ?? "").trim().toLowerCase();
  if (/^(msq|multi|multiple)/.test(t)) return "msq";
  if (/^(nat|numer|integer|numeric|fill)/.test(t)) return "nat";
  if (/^(mcq|single|choice)/.test(t)) return "mcq";
  return "";
};

const findCol = (header, patterns) => header.findIndex((h) => patterns.some((p) => p.test(h)));

const numOrEmpty = (v) => {
  const s = String(v ?? "").trim();
  return s !== "" && Number.isFinite(Number(s)) ? s : "";
};

// rows -> question objects. Detects a header row (any column order); without one it assumes
//   Question, A, B, C, D, Answer, Topic
export const rowsToQuestions = (rows) => {
  if (!rows.length) return [];
  const first = rows[0].map((c) => c.trim().toLowerCase());
  const hasHeader = first.some((c) => /^(question|q\.?|sr|s\.?no|no\.?|type)$/.test(c)) || first.includes("answer");

  let map = { type: -1, q: 0, a: 1, b: 2, c: 3, d: 4, ans: 5, topic: 6, marks: -1, neg: -1, exp: -1 };
  let body = rows;
  if (hasHeader) {
    body = rows.slice(1);
    const h = first;
    const found = {
      type: findCol(h, [/^(question\s*)?type$/, /^qtype$/]),
      q: findCol(h, [/^question$/, /^question\s*(text|stem)$/, /^q\.?$/]),
      a: findCol(h, [/^(option|choice|opt)\s*\(?a\)?$/, /^a$/, /^(option|opt)\s*1$/]),
      b: findCol(h, [/^(option|choice|opt)\s*\(?b\)?$/, /^b$/, /^(option|opt)\s*2$/]),
      c: findCol(h, [/^(option|choice|opt)\s*\(?c\)?$/, /^c$/, /^(option|opt)\s*3$/]),
      d: findCol(h, [/^(option|choice|opt)\s*\(?d\)?$/, /^d$/, /^(option|opt)\s*4$/]),
      ans: findCol(h, [/^(correct\s*)?(answer|ans|key)/]),
      topic: findCol(h, [/^(topic|subject|section|category)/]),
      marks: findCol(h, [/^marks?$/, /^(positive\s*)?marks/, /^points?$/]),
      neg: findCol(h, [/^neg/, /^penalty/]),
      exp: findCol(h, [/^(explanation|solution|rationale)/]),
    };
    // headers we could not match fall back to their positional default (only the 7 classic columns)
    map = Object.fromEntries(
      Object.entries(found).map(([k, v]) => [k, v >= 0 ? v : ["type", "marks", "neg", "exp"].includes(k) ? -1 : map[k]]),
    );
  }

  const get = (cols, i) => (i >= 0 ? (cols[i] ?? "").trim() : "");

  return body
    .map((cols) => {
      const options = [map.a, map.b, map.c, map.d].map((i) => get(cols, i));
      const answer = get(cols, map.ans);
      const hasOptions = options.some(Boolean);

      // type: explicit column wins; otherwise infer from the answer + options
      let type = normType(get(cols, map.type));
      if (!type) {
        if (!hasOptions && parseNat(answer)) type = "nat";
        else if (resolveAnswers(answer, options).length > 1) type = "msq";
        else type = "mcq";
      }

      const q = { ...emptyQuestion(type), question: get(cols, map.q), topic: get(cols, map.topic),
        marks: numOrEmpty(get(cols, map.marks)), negativeMarks: numOrEmpty(get(cols, map.neg)), explanation: get(cols, map.exp) };

      if (type === "nat") {
        const nat = parseNat(answer);
        if (nat) Object.assign(q, nat);
      } else {
        q.options = options;
        if (type === "msq") q.answerKeys = resolveAnswers(answer, options);
        else q.answerKey = resolveAnswer(answer, options);
      }
      return q;
    })
    .filter((q) => q.question || q.options.some(Boolean) || q.natMin);
};

// ---------- JSON import ----------
// Accepts [...] or { questions: [...] }. Fields: type, question, options[], answer / answerKey /
// answerKeys / natMin+natMax, marks, negativeMarks, topic, explanation.
export const jsonToQuestions = (data) => {
  const list = Array.isArray(data) ? data : Array.isArray(data?.questions) ? data.questions : [];
  return list.map((raw) => {
    const options = [0, 1, 2, 3].map((i) => String(raw?.options?.[i] ?? "").trim());
    const answer = raw?.answerKeys ?? raw?.answerKey ?? raw?.answer ?? "";
    let type = normType(raw?.type);
    if (!type) type = raw?.natMin !== undefined || (!options.some(Boolean) && parseNat(answer)) ? "nat" : Array.isArray(answer) && answer.length > 1 ? "msq" : "mcq";

    const q = { ...emptyQuestion(type), question: String(raw?.question ?? raw?.text ?? "").trim(), topic: String(raw?.topic ?? raw?.section ?? "").trim(),
      marks: numOrEmpty(raw?.marks), negativeMarks: numOrEmpty(raw?.negativeMarks), explanation: String(raw?.explanation ?? "").trim() };

    if (type === "nat") {
      if (raw?.natMin !== undefined) Object.assign(q, { natMin: numOrEmpty(raw.natMin), natMax: numOrEmpty(raw.natMax) });
      else Object.assign(q, parseNat(answer) || {});
    } else {
      q.options = options;
      if (type === "msq") q.answerKeys = Array.isArray(answer) ? answer.map((a) => resolveAnswer(a, options)).filter(Boolean).sort() : resolveAnswers(answer, options);
      else q.answerKey = resolveAnswer(Array.isArray(answer) ? answer[0] : answer, options);
    }
    return q;
  });
};

// ---------- validation / payload ----------

// Problems that would make the backend reject the question
export const questionIssues = (q, allQuestions = []) => {
  const issues = [];
  const type = q.type || "mcq";
  if (!q.question.trim()) issues.push("Question text is empty");

  if (type === "nat") {
    const min = Number(q.natMin);
    if (String(q.natMin).trim() === "" || !Number.isFinite(min)) issues.push("Enter the numerical answer");
    else if (String(q.natMax).trim() !== "" && !Number.isFinite(Number(q.natMax))) issues.push("The upper limit of the range is not a number");
  } else {
    const filled = q.options.filter((o) => o.trim());
    if (filled.length < 4) issues.push("All 4 options are required");
    else if (new Set(filled.map((o) => o.trim().toLowerCase())).size < 4) issues.push("Two options are identical");
    if (type === "mcq" && !LETTERS.includes(q.answerKey)) issues.push("Correct answer not selected");
    if (type === "msq" && !(q.answerKeys || []).length) issues.push("Select at least one correct option");
  }

  if (String(q.marks).trim() !== "" && !(Number(q.marks) > 0)) issues.push("Marks must be above 0");
  if (String(q.negativeMarks).trim() !== "" && !(Number(q.negativeMarks) >= 0)) issues.push("Negative marks cannot be below 0");

  if (q.question.trim() && allQuestions.length) {
    const norm = q.question.trim().toLowerCase();
    const first = allQuestions.findIndex((o) => o.question.trim().toLowerCase() === norm);
    if (first >= 0 && allQuestions[first].key !== q.key) issues.push("Duplicate of an earlier question");
  }
  return issues;
};

export const toPayloadQuestions = (questions) =>
  questions.map((q) => {
    const out = { type: q.type || "mcq", question: q.question.trim(), topic: q.topic.trim() || "General" };
    if (out.type === "nat") {
      out.natMin = Number(q.natMin);
      if (String(q.natMax).trim() !== "") out.natMax = Number(q.natMax);
    } else {
      out.options = q.options.map((o) => o.trim());
      if (out.type === "msq") out.answerKeys = q.answerKeys;
      else out.answerKey = q.answerKey;
    }
    if (String(q.marks).trim() !== "") out.marks = Number(q.marks);
    if (String(q.negativeMarks).trim() !== "") out.negativeMarks = Number(q.negativeMarks);
    if (q.explanation.trim()) out.explanation = q.explanation.trim();
    return out;
  });

export const fromApiQuestions = (list = []) =>
  list.map((q) => ({
    ...emptyQuestion(q.type || "mcq"),
    question: q.question || "",
    options: [0, 1, 2, 3].map((i) => q.options?.[i] ?? ""),
    answerKey: q.answerKey || "",
    answerKeys: q.answerKeys || [],
    natMin: q.natMin ?? "",
    natMax: q.natMax !== undefined && q.natMax !== q.natMin ? q.natMax : "",
    marks: q.marks ?? "",
    negativeMarks: q.negativeMarks ?? "",
    topic: q.topic && q.topic !== "General" ? q.topic : "",
    explanation: q.explanation || "",
  }));

// ---------- template ----------
const csvCell = (v) => `"${String(v).replace(/"/g, '""')}"`;

export const TEMPLATE_CSV = [
  ["Type", "Question", "Option A", "Option B", "Option C", "Option D", "Answer", "Marks", "Negative", "Topic", "Explanation"],
  ["MCQ", "The value of $\\int_0^1 x^2\\,dx$ is", "$1/3$", "$1/2$", "$1$", "$2/3$", "A", "1", "", "Engineering Mathematics", "Since $\\int x^2 dx = x^3/3$."],
  ["MCQ", "Choose the synonym of 'ABUNDANT'", "Plentiful", "Scarce", "Rare", "Limited", "A", "2", "", "General Aptitude", ""],
  ["MSQ", "Which of the following are prime numbers?", "2", "4", "7", "9", "A;C", "2", "", "General Aptitude", "Only 2 and 7 have no other divisors."],
  ["NAT", "A machine delivers 80 m/min with 200 punches/cm$^2$. The frequency (strokes/min) is ____", "", "", "", "", "12.5 to 13.5", "2", "", "Subject", ""],
  ["MCQ", "Study the figure.\n\n![figure](https://example.com/figure.png)\n\nWhat is the area?", "2", "4", "6", "8", "B", "1", "", "Subject", ""],
]
  .map((r) => r.map(csvCell).join(","))
  .join("\r\n");

export const downloadTemplate = () => {
  const blob = new Blob(["\uFEFF" + TEMPLATE_CSV], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quiz-template.csv";
  a.click();
  URL.revokeObjectURL(url);
};
