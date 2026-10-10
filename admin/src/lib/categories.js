// Must match EXAM_CATEGORY_IDS in backend/models/Quiz.js
export const CATEGORIES = [
  { id: "ssc", label: "SSC", tone: "bg-sky-50 text-sky-700 ring-sky-200", bar: "bg-sky-500" },
  { id: "gate", label: "GATE", tone: "bg-violet-50 text-violet-700 ring-violet-200", bar: "bg-violet-500" },
  { id: "banking", label: "Banking", tone: "bg-emerald-50 text-emerald-700 ring-emerald-200", bar: "bg-emerald-500" },
  { id: "railways", label: "Railways", tone: "bg-orange-50 text-orange-700 ring-orange-200", bar: "bg-orange-500" },
  { id: "upsc", label: "UPSC", tone: "bg-amber-50 text-amber-700 ring-amber-200", bar: "bg-amber-500" },
  { id: "defence", label: "Defence", tone: "bg-slate-100 text-slate-700 ring-slate-200", bar: "bg-slate-500" },
  { id: "teaching", label: "Teaching", tone: "bg-pink-50 text-pink-700 ring-pink-200", bar: "bg-pink-500" },
  { id: "state-psc", label: "State PSC", tone: "bg-teal-50 text-teal-700 ring-teal-200", bar: "bg-teal-500" },
  { id: "tech", label: "Tech Skills", tone: "bg-cyan-50 text-cyan-700 ring-cyan-200", bar: "bg-cyan-500" },
];

export const getCategory = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[CATEGORIES.length - 1];

export const LEVELS = ["Basic", "Intermediate", "Advanced"];

export const LEVEL_TONE = {
  Basic: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  Intermediate: "bg-amber-50 text-amber-700 ring-amber-200",
  Advanced: "bg-rose-50 text-rose-700 ring-rose-200",
};

// Common negative-marking schemes (marks deducted per wrong answer)
export const NEGATIVE_PRESETS = [
  { value: 0, label: "None" },
  { value: 0.25, label: "¼ (0.25)" },
  { value: 0.33, label: "⅓ (0.33)" },
  { value: 0.5, label: "½ (0.5)" },
  { value: 1, label: "1" },
];
