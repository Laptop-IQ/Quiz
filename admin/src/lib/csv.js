const LETTERS = ["A", "B", "C", "D"];

let counter = 0;
export const newKey = () => `q${Date.now().toString(36)}${(counter += 1)}`;

export const emptyQuestion = () => ({
  key: newKey(),
  question: "",
  options: ["", "", "", ""],
  answerKey: "",
  topic: "",
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

// "B", "b", "(B)", "Option B", "2" -> "B". Anything else -> "" (never guessed)
const letterFrom = (raw) => {
  const m = String(raw).trim().match(/^(?:option|opt|choice|ans(?:wer)?)?\s*[.:)-]?\s*\(?([a-d1-4])\)?\.?$/i);
  if (!m) return "";
  const c = m[1].toUpperCase();
  return /[1-4]/.test(c) ? LETTERS[Number(c) - 1] : c;
};

// Answer may be a letter, a number 1-4, or the exact text of one option.
// An answer that cannot be resolved is left empty so the admin must pick it.
export const resolveAnswer = (raw, options) => {
  const value = String(raw ?? "").trim();
  if (!value) return "";
  const byLetter = letterFrom(value);
  if (byLetter) return byLetter;
  const idx = options.findIndex((o) => o.trim().toLowerCase() === value.toLowerCase());
  return idx >= 0 ? LETTERS[idx] : "";
};

const findCol = (header, patterns) => header.findIndex((h) => patterns.some((p) => p.test(h)));

// rows -> question objects. Detects a header row; otherwise assumes
// Question, A, B, C, D, Answer, Topic (optional).
export const rowsToQuestions = (rows) => {
  if (!rows.length) return [];
  const first = rows[0].map((c) => c.trim().toLowerCase());
  const hasHeader = first.some((c) => /^(question|q\.?|sr|s\.?no|no\.?)$/.test(c)) || first.includes("answer");

  let map = { q: 0, a: 1, b: 2, c: 3, d: 4, ans: 5, topic: 6 };
  let body = rows;
  if (hasHeader) {
    body = rows.slice(1);
    const h = first;
    const found = {
      q: findCol(h, [/^question/, /^q\.?$/]),
      a: findCol(h, [/^(option|choice|opt)\s*\(?a\)?$/, /^a$/, /^(option|opt)\s*1$/]),
      b: findCol(h, [/^(option|choice|opt)\s*\(?b\)?$/, /^b$/, /^(option|opt)\s*2$/]),
      c: findCol(h, [/^(option|choice|opt)\s*\(?c\)?$/, /^c$/, /^(option|opt)\s*3$/]),
      d: findCol(h, [/^(option|choice|opt)\s*\(?d\)?$/, /^d$/, /^(option|opt)\s*4$/]),
      ans: findCol(h, [/^(correct\s*)?(answer|ans|key)/]),
      topic: findCol(h, [/^(topic|subject|section|category)/]),
    };
    // headers we could not match fall back to their positional default
    map = Object.fromEntries(Object.entries(found).map(([k, v]) => [k, v >= 0 ? v : map[k]]));
  }

  return body
    .map((cols) => {
      const options = [map.a, map.b, map.c, map.d].map((i) => (cols[i] ?? "").trim());
      return {
        key: newKey(),
        question: (cols[map.q] ?? "").trim(),
        options,
        answerKey: resolveAnswer(cols[map.ans], options),
        topic: (cols[map.topic] ?? "").trim(),
      };
    })
    .filter((q) => q.question || q.options.some(Boolean)); // ignore fully blank rows
};

// Problems that would make the backend reject the question
export const questionIssues = (q, allQuestions = []) => {
  const issues = [];
  if (!q.question.trim()) issues.push("Question text is empty");
  const filled = q.options.filter((o) => o.trim());
  if (filled.length < 4) issues.push("All 4 options are required");
  else if (new Set(filled.map((o) => o.trim().toLowerCase())).size < 4) issues.push("Two options are identical");
  if (!LETTERS.includes(q.answerKey)) issues.push("Correct answer not selected");
  if (q.question.trim() && allQuestions.length) {
    const norm = q.question.trim().toLowerCase();
    const first = allQuestions.findIndex((o) => o.question.trim().toLowerCase() === norm);
    if (first >= 0 && allQuestions[first].key !== q.key) issues.push("Duplicate of an earlier question");
  }
  return issues;
};

export const toPayloadQuestions = (questions) =>
  questions.map((q) => ({
    question: q.question.trim(),
    options: q.options.map((o) => o.trim()),
    answerKey: q.answerKey,
    topic: q.topic.trim() || "General",
  }));

export const fromApiQuestions = (list = []) =>
  list.map((q) => ({
    key: newKey(),
    question: q.question || "",
    options: [0, 1, 2, 3].map((i) => q.options?.[i] ?? ""),
    answerKey: q.answerKey || "",
    topic: q.topic && q.topic !== "General" ? q.topic : q.topic || "",
  }));

const csvCell = (v) => `"${String(v).replace(/"/g, '""')}"`;

export const TEMPLATE_CSV = [
  ["Question", "Option A", "Option B", "Option C", "Option D", "Answer", "Topic"],
  ["What is 15% of 240?", "32", "36", "38", "40", "B", "Quantitative Aptitude"],
  ["Choose the synonym of 'ABUNDANT'", "Plentiful", "Scarce", "Rare", "Limited", "A", "English"],
  ["Capital of India?", "Mumbai", "Kolkata", "New Delhi", "Chennai", "New Delhi", "General Awareness"],
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
