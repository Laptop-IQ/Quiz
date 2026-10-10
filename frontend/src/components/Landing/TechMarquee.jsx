import { Code, Layout, Zap, Cpu, Terminal, Database, Coffee, Globe } from "lucide-react";

const techs = [
  { name: "HTML", Icon: Code, color: "text-orange-500 bg-orange-50" },
  { name: "CSS", Icon: Layout, color: "text-blue-500 bg-blue-50" },
  { name: "JavaScript", Icon: Zap, color: "text-yellow-600 bg-yellow-50" },
  { name: "React", Icon: Cpu, color: "text-cyan-600 bg-cyan-50" },
  { name: "Node.js", Icon: Terminal, color: "text-green-600 bg-green-50" },
  { name: "MongoDB", Icon: Database, color: "text-emerald-700 bg-emerald-50" },
  { name: "Java", Icon: Coffee, color: "text-red-500 bg-red-50" },
  { name: "Python", Icon: Globe, color: "text-indigo-600 bg-indigo-50" },
];

const Row = ({ hidden = false }) => (
  <ul className="flex shrink-0 items-center gap-3 pr-3" aria-hidden={hidden || undefined}>
    {techs.map(({ name, Icon, color }) => (
      <li key={name} className="flex items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${color}`}>
          <Icon size={14} />
        </span>
        <span className="text-sm font-bold text-slate-700">{name}</span>
      </li>
    ))}
  </ul>
);

const TechMarquee = () => (
  <section className="pb-14 pt-14" aria-label="Technologies you can practice">
    <p className="mb-6 px-4 text-center text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400 sm:text-xs sm:tracking-[0.18em]">
      Practice the stack companies hire for
    </p>
    <div className="lp-marquee overflow-hidden">
      <div className="lp-marquee-track flex w-max">
        <Row />
        <Row hidden />
      </div>
    </div>
  </section>
);

export default TechMarquee;
