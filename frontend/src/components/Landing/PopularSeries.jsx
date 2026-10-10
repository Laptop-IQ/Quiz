import { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import useAllSeries from "../../services/useAllSeries";
import TestSeriesCard from "./TestSeriesCard";

const GAP = 24;
const SPEED = 0.5; // px per frame, smaller = slower

const visibleFor = (w) => (w >= 1024 ? 4 : w >= 640 ? 2 : 1);

// Auto-scrolling, draggable carousel like testbook.com "Popular Test Series"
const PopularSeries = () => {
  const { series } = useAllSeries();
  const wrapRef = useRef(null);
  const [width, setWidth] = useState(0);
  const hovered = useRef(false);
  const dragging = useRef(false);
  const x = useMotionValue(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setWidth(el.clientWidth));
    ro.observe(el);
    setWidth(el.clientWidth);
    return () => ro.disconnect();
  }, [series.length]);

  const visible = visibleFor(width);
  const cardW = width ? (width - GAP * (visible - 1)) / visible : 0;
  const step = cardW + GAP;
  const animated = series.length > visible;

  // one "unit" of cards that loops seamlessly
  const unit = useMemo(() => series, [series]);
  const loop = useMemo(() => [...unit, ...unit, ...unit], [unit]);
  const unitWidth = unit.length * step;

  // start in the middle copy
  useEffect(() => {
    if (animated && unitWidth) x.set(-unitWidth);
  }, [animated, unitWidth, x]);

  const wrap = () => {
    const cur = x.get();
    if (cur <= -2 * unitWidth) x.set(cur + unitWidth);
    else if (cur > -unitWidth + step) x.set(cur - unitWidth);
  };

  useAnimationFrame(() => {
    if (!animated || !unitWidth || hovered.current || dragging.current) return;
    x.set(x.get() - SPEED);
    wrap();
  });

  const onDragEnd = () => {
    dragging.current = false;
    const snapped = Math.round(x.get() / step) * step;
    animate(x, snapped, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      onComplete: wrap,
    });
  };

  if (series.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#070d1a] py-20">
      <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-cyan-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6 sm:px-12">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">Most attempted</span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-white sm:text-4xl">Popular Test Series</h2>
            <p className="mt-2 max-w-md text-sm text-slate-400">
              Pick your exam, start from Basic and work your way up to Advanced.
            </p>
          </div>
          <Link
            to="/test-series"
            className="group inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm font-bold text-white transition hover:border-cyan-400/50 hover:bg-white/10"
          >
            View all series
            <ArrowRight size={16} className="transition group-hover:translate-x-1" />
          </Link>
        </div>

        <div ref={wrapRef} className="overflow-hidden">
          {animated ? (
            <motion.div
              drag="x"
              style={{ x, gap: GAP }}
              dragConstraints={{ left: -100000, right: 100000 }}
              dragElastic={0.1}
              onDragStart={() => (dragging.current = true)}
              onDragEnd={onDragEnd}
              onMouseEnter={() => (hovered.current = true)}
              onMouseLeave={() => (hovered.current = false)}
              className="flex cursor-grab active:cursor-grabbing"
            >
              {loop.map((item, i) => (
                <div key={`${item.id}-${i}`} className="shrink-0" style={{ width: cardW }}>
                  <TestSeriesCard item={item} />
                </div>
              ))}
            </motion.div>
          ) : (
            <div className="flex" style={{ gap: GAP }}>
              {series.map((item) => (
                <div key={item.id} className="shrink-0" style={{ width: cardW || "25%" }}>
                  <TestSeriesCard item={item} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularSeries;
