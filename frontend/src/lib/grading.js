// Shared grading rules for MCQ / MSQ / NAT questions.
// NOTE: frontend/src/lib/grading.js is an identical copy - change both together.
//
//  mcq : one correct option.          Wrong answer costs negative marks.
//  msq : one or more correct options.  All-or-nothing, no negative marks (GATE rule).
//  nat : numerical answer, accepted if it lies in [natMin, natMax]. No negative marks.

export const LETTERS = ["A", "B", "C", "D", "E", "F"];
export const QUESTION_TYPES = ["mcq", "msq", "nat"];

const EPS = 1e-9;
export const round2 = (n) => Math.round(n * 100) / 100;

const hasValue = (v) => v !== undefined && v !== null && v !== "";

// Marks for a correct answer: the question's own, else the quiz default
export const marksOf = (q, quiz = {}) => {
  const own = Number(q?.marks);
  if (hasValue(q?.marks) && Number.isFinite(own) && own > 0) return own;
  const base = Number(quiz.marksPerQuestion);
  return base > 0 ? base : 1;
};

// Marks lost for a wrong answer. An explicit per-question value wins; otherwise only MCQs are
// penalised, scaled to the question's marks (e.g. GATE: 1/3 for a 1-mark, 2/3 for a 2-mark MCQ).
export const negativeOf = (q, quiz = {}) => {
  if (hasValue(q?.negativeMarks)) {
    const own = Number(q.negativeMarks);
    if (Number.isFinite(own) && own >= 0) return round2(own);
  }
  if ((q?.type || "mcq") !== "mcq") return 0;
  const base = Number(quiz.negativeMarking) || 0;
  if (!base) return 0;
  const unit = Number(quiz.marksPerQuestion) > 0 ? Number(quiz.marksPerQuestion) : 1;
  return round2((base * marksOf(q, quiz)) / unit);
};

// indices (0-based) of the correct option(s)
export const correctIndices = (q) =>
  ((q?.type || "mcq") === "msq" ? q.answerKeys || [] : [q?.answerKey])
    .map((k) => LETTERS.indexOf(String(k ?? "").toUpperCase()))
    .filter((i) => i >= 0)
    .sort((a, b) => a - b);

export const natRange = (q) => {
  const lo = Number(q?.natMin);
  const hi = hasValue(q?.natMax) ? Number(q.natMax) : lo;
  return [Math.min(lo, hi), Math.max(lo, hi)];
};

const natValue = (r) => {
  const s = String(r ?? "").trim();
  if (!/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
  return Number(s);
};

// Has the candidate actually given an answer?
export const isAnswered = (q, r) => {
  if (r === undefined || r === null) return false;
  if (Array.isArray(r)) return r.length > 0;
  if (typeof r === "string") return (q?.type || "mcq") === "nat" ? Number.isFinite(natValue(r)) : r.trim() !== "";
  return true;
};

export const gradeQuestion = (q, r, quiz = {}) => {
  const type = q?.type || "mcq";
  const max = marksOf(q, quiz);
  const negative = negativeOf(q, quiz);
  if (!isAnswered(q, r)) return { type, status: "skipped", awarded: 0, max, negative };

  let ok = false;
  if (type === "mcq") {
    ok = Number(r) === correctIndices(q)[0];
  } else if (type === "msq") {
    const mine = [...new Set((Array.isArray(r) ? r : [r]).map(Number))].sort((a, b) => a - b);
    const right = correctIndices(q);
    ok = mine.length === right.length && mine.every((v, i) => v === right[i]);
  } else {
    const x = natValue(r);
    const [lo, hi] = natRange(q);
    ok = Number.isFinite(lo) && Number.isFinite(hi) && x >= lo - EPS && x <= hi + EPS;
  }
  return ok
    ? { type, status: "correct", awarded: max, max, negative }
    : { type, status: "wrong", awarded: -negative, max, negative };
};

// responses: { [questionIndex]: number | number[] | string }
export const gradeAttempt = (quiz, responses = {}) => {
  const questions = quiz?.questions || [];
  const results = questions.map((q, i) => gradeQuestion(q, responses?.[i], quiz));
  const correct = results.filter((r) => r.status === "correct").length;
  const wrong = results.filter((r) => r.status === "wrong").length;
  return {
    results,
    total: questions.length,
    correct,
    wrong,
    skipped: questions.length - correct - wrong,
    marksObtained: round2(results.reduce((s, r) => s + r.awarded, 0)),
    totalMarks: round2(results.reduce((s, r) => s + r.max, 0)),
  };
};

// Human-readable answers for review screens
export const describeCorrect = (q) => {
  const type = q?.type || "mcq";
  if (type === "nat") {
    const [lo, hi] = natRange(q);
    return lo === hi ? String(lo) : `${lo} to ${hi}`;
  }
  return correctIndices(q).map((i) => LETTERS[i]).join(", ");
};

export const describeAnswer = (q, r) => {
  if (!isAnswered(q, r)) return "";
  if ((q?.type || "mcq") === "nat") return String(r).trim();
  return (Array.isArray(r) ? [...r].sort((a, b) => a - b) : [r]).map((i) => LETTERS[Number(i)]).join(", ");
};
