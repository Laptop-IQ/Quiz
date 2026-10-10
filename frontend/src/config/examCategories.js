import {
  Landmark, GraduationCap, Banknote, TrainFront, Scale, ShieldCheck, BookOpen, MapPinned, Code,
} from "lucide-react";

// Exam families a test series can belong to. `id` must match the backend's
// EXAM_CATEGORY_IDS (models/Quiz.js). "tech" is the original tech-skills group.
export const EXAM_CATEGORIES = [
  {
    id: "ssc",
    label: "SSC",
    full: "Staff Selection Commission",
    blurb: "Quant, reasoning, English and GA for CGL, CHSL, MTS and more.",
    exams: ["CGL", "CHSL", "MTS", "GD", "CPO"],
    Icon: Landmark,
    iconWrap: "bg-sky-50 text-sky-600",
    gradient: "from-sky-400 to-blue-600",
    glow: "bg-sky-50",
    color: "text-sky-500",
  },
  {
    id: "gate",
    label: "GATE",
    full: "Graduate Aptitude Test in Engineering",
    blurb: "Subject-wise engineering practice for CSE, ECE, EE, ME and CE.",
    exams: ["CSE", "ECE", "EE", "ME", "CE"],
    Icon: GraduationCap,
    iconWrap: "bg-violet-50 text-violet-600",
    gradient: "from-violet-400 to-purple-600",
    glow: "bg-violet-50",
    color: "text-violet-500",
  },
  {
    id: "banking",
    label: "Banking",
    full: "Bank & insurance exams",
    blurb: "Prelims-style tests for IBPS, SBI and RBI recruitment.",
    exams: ["IBPS PO", "IBPS Clerk", "SBI PO", "SBI Clerk", "RBI"],
    Icon: Banknote,
    iconWrap: "bg-emerald-50 text-emerald-600",
    gradient: "from-emerald-400 to-teal-600",
    glow: "bg-emerald-50",
    color: "text-emerald-500",
  },
  {
    id: "railways",
    label: "Railways",
    full: "Railway Recruitment Boards",
    blurb: "CBT-pattern practice for RRB NTPC, Group D, ALP and JE.",
    exams: ["NTPC", "Group D", "ALP", "JE"],
    Icon: TrainFront,
    iconWrap: "bg-orange-50 text-orange-600",
    gradient: "from-orange-400 to-red-500",
    glow: "bg-orange-50",
    color: "text-orange-500",
  },
  {
    id: "upsc",
    label: "UPSC",
    full: "Union Public Service Commission",
    blurb: "Prelims GS and CSAT practice for civil services aspirants.",
    exams: ["Prelims GS", "CSAT", "CAPF"],
    Icon: Scale,
    iconWrap: "bg-amber-50 text-amber-600",
    gradient: "from-amber-400 to-orange-500",
    glow: "bg-amber-50",
    color: "text-amber-500",
  },
  {
    id: "defence",
    label: "Defence",
    full: "Armed forces entrance exams",
    blurb: "Mock tests for NDA, CDS and AFCAT entry.",
    exams: ["NDA", "CDS", "AFCAT"],
    Icon: ShieldCheck,
    iconWrap: "bg-slate-100 text-slate-700",
    gradient: "from-slate-500 to-slate-800",
    glow: "bg-slate-100",
    color: "text-slate-600",
  },
  {
    id: "teaching",
    label: "Teaching",
    full: "Teaching eligibility exams",
    blurb: "Practice for CTET, UGC NET, KVS and state TETs.",
    exams: ["CTET", "UGC NET", "KVS"],
    Icon: BookOpen,
    iconWrap: "bg-pink-50 text-pink-600",
    gradient: "from-pink-400 to-rose-600",
    glow: "bg-pink-50",
    color: "text-pink-500",
  },
  {
    id: "state-psc",
    label: "State PSC",
    full: "State public service exams",
    blurb: "State-level civil services and subordinate service tests.",
    exams: ["State PCS", "Police", "Patwari"],
    Icon: MapPinned,
    iconWrap: "bg-teal-50 text-teal-600",
    gradient: "from-teal-400 to-cyan-600",
    glow: "bg-teal-50",
    color: "text-teal-500",
  },
  {
    id: "tech",
    label: "Tech Skills",
    full: "Programming & web development",
    blurb: "HTML, CSS, JavaScript, React and more for tech interviews.",
    exams: ["HTML", "CSS", "JavaScript", "React"],
    Icon: Code,
    iconWrap: "bg-cyan-50 text-cyan-600",
    gradient: "from-cyan-400 to-blue-600",
    glow: "bg-cyan-50",
    color: "text-cyan-500",
  },
];

const BY_ID = Object.fromEntries(EXAM_CATEGORIES.map((c) => [c.id, c]));

export const getCategory = (id) => BY_ID[id] || BY_ID.tech;

// "+2 / −0.5" style summary of a marking scheme
export const markingLabel = (marksPerQuestion = 1, negativeMarking = 0) =>
  negativeMarking > 0
    ? `+${marksPerQuestion} / −${negativeMarking}`
    : `+${marksPerQuestion} / no negative`;
