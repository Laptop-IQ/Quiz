import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
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
    <section className="bg-blue-50 py-6 overflow-hidden">
      <div className="max-w-6xl mx-auto px-12">
        <h2 className="text-2xl font-semibold text-black mb-10">
          Popular Test Series
        </h2>

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
