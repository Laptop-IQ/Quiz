import { useEffect, useRef, useState } from "react";
import { Users, Trophy, ClipboardCheck, HelpCircle } from "lucide-react";

const items = [
  { icon: Users, tone: "bg-emerald-50 text-emerald-600", label: "Registered Students", value: 10, suffix: "K+" },
  { icon: Trophy, tone: "bg-amber-50 text-amber-600", label: "Student Selections", value: 2, suffix: "K+" },
  { icon: ClipboardCheck, tone: "bg-violet-50 text-violet-600", label: "Tests Attempted", value: 50, suffix: "K+" },
  { icon: HelpCircle, tone: "bg-sky-50 text-sky-600", label: "Questions Practiced", value: 1, suffix: "M+" },
];

const reduceMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// counts 0 -> value once the stat scrolls into view
const useCountUp = (target, start, duration = 1400) => {
  const [n, setN] = useState(0);
  const reduce = reduceMotion();
  useEffect(() => {
    if (!start || reduce) return undefined;
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      setN(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration, reduce]);
  return reduce ? target : n;
};

const Stat = ({ item, start }) => {
  const n = useCountUp(item.value, start);
  const Icon = item.icon;
  return (
    <div className="flex flex-col items-start gap-3 rounded-2xl p-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:gap-4 sm:p-5">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${item.tone}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-black tracking-tight text-slate-900 tabular-nums">
          {n}
          {item.suffix}
        </p>
        <p className="text-xs font-semibold text-slate-500">{item.label}</p>
      </div>
    </div>
  );
};

const Stats = () => {
  const ref = useRef(null);
  const [start, setStart] = useState(
    () => typeof window === "undefined" || !("IntersectionObserver" in window),
  );

  useEffect(() => {
    const el = ref.current;
    if (!el || start) return undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStart(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [start]);

  return (
    <section className="relative z-10 -mt-20">
      <div className="mx-auto max-w-6xl px-5">
        <div
          ref={ref}
          className="grid grid-cols-2 gap-1 rounded-3xl border border-slate-200/80 bg-white p-2 shadow-[0_20px_60px_-15px_rgba(15,23,42,0.18)] md:grid-cols-4"
        >
          {items.map((s) => (
            <Stat key={s.label} item={s} start={start} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
