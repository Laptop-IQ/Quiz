import { Link } from "react-router-dom";
import { Code, Database, Coffee, Cpu, Globe, Layout, Terminal, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { getCategory, markingLabel } from "../../config/examCategories";

const techIcons = {
  html: { Icon: Code, color: "text-orange-500", glow: "bg-orange-50" },
  css: { Icon: Layout, color: "text-blue-500", glow: "bg-blue-50" },
  javascript: { Icon: Zap, color: "text-yellow-500", glow: "bg-yellow-50" },
  react: { Icon: Cpu, color: "text-cyan-500", glow: "bg-cyan-50" },
  node: { Icon: Terminal, color: "text-green-600", glow: "bg-green-50" },
  mongodb: { Icon: Database, color: "text-green-700", glow: "bg-green-50" },
  java: { Icon: Coffee, color: "text-red-500", glow: "bg-red-50" },
  python: { Icon: Globe, color: "text-blue-600", glow: "bg-blue-50" },
};

const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);
const nice = { html: "HTML", css: "CSS", javascript: "JavaScript", react: "React", node: "Node.js", mongodb: "MongoDB", java: "Java", python: "Python" };

const TestSeriesCard = ({ item }) => {
  const category = getCategory(item.category);
  const isExam = !!item.category && item.category !== "tech";
  // tech series keep their own brand icon; exam series use their category's icon + colour
  const { Icon, color, glow } = (!isExam && techIcons[item.id]) || {
    Icon: category.Icon,
    color: category.color,
    glow: category.glow,
  };
  const hasScheme = (item.negativeMarking || 0) > 0 || (item.marksPerQuestion ?? 1) !== 1;
  const points = item.levels.map((l) => `${cap(l.level)} Test - ${l.questionCount} Qs`);
  points.push("Detailed Solutions & Analysis");
  const shown = points.length > 4 ? [...points.slice(0, 3), `+${points.length - 3} more`] : points;

  return (
    <article className="group flex h-[430px] w-full min-w-0 max-w-none flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0d1524] shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-sky-200 hover:shadow-[0_18px_45px_rgba(14,165,233,0.14)]">
      <div className="relative h-[118px] shrink-0 overflow-hidden bg-gradient-to-br from-[#111b30] via-[#0b1322] to-[#06253b] p-5">
        <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-sky-400/20 blur-2xl transition group-hover:bg-sky-300/30" />
        <div className="relative flex items-start justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-lg ${glow}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">{item.totalQuestions} Questions</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300">{isExam ? category.label : "Mock Series"}</span>
          <span className="text-xs font-medium text-slate-400">2026</span>
        </div>
        <h3 className="line-clamp-2 min-h-[48px] text-[17px] font-bold leading-6 text-white">{nice[item.id] || item.name} Mock Test Series</h3>
        <p className="mt-2 truncate text-xs font-medium text-slate-400">{item.levels.length} Tests <span className="mx-1 text-slate-300">•</span> <span className="text-emerald-400">{item.levels.length} Free Tests</span></p>
        <div className="my-3 flex items-center gap-2 border-y border-white/10 py-2 text-xs font-medium text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> English{hasScheme && <><span className="text-slate-600">•</span><span className="truncate text-amber-300/90" title="Marks per correct answer / deduction per wrong answer">{markingLabel(item.marksPerQuestion, item.negativeMarking)} marking</span></>}</div>
        <ul className="min-h-0 flex-1 space-y-2 overflow-hidden text-xs leading-5 text-slate-300">
          {shown.map((p, i) => <li key={i} className="flex items-center gap-2 truncate"><CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" /><span className="truncate">{p}</span></li>)}
        </ul>
        <Link to={`/test-series/${item.id}`} className="mt-4 flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-sm font-semibold text-white transition hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2">
          View Test Series <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
};

export default TestSeriesCard;
