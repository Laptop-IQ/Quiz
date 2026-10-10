import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Landing/Footer";
import TestSeriesGrid from "../components/Landing/TestSeriesGrid";
import useAllSeries from "../services/useAllSeries";
import { EXAM_CATEGORIES, getCategory } from "../config/examCategories";

const TestSeries = () => {
  const { series, isLoading } = useAllSeries();
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "all";
  const setCategory = (id) => setParams(id === "all" ? {} : { category: id }, { replace: true });

  const counts = useMemo(() => {
    const c = {};
    series.forEach((s) => {
      const id = s.category || "tech";
      c[id] = (c[id] || 0) + 1;
    });
    return c;
  }, [series]);

  const tabs = EXAM_CATEGORIES.filter((c) => counts[c.id] > 0 || c.id === category);
  const items = useMemo(
    () => (category === "all" ? series : series.filter((s) => (s.category || "tech") === category)),
    [series, category],
  );
  const active = category === "all" ? null : getCategory(category);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <section className="bg-blue-50 py-8 flex-1">
        <div className="max-w-7xl mx-auto px-6 lg:px-18">
          <div className="mb-6">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              {active ? `${active.label} Test Series` : "All Test Series"}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {active ? active.blurb : "Choose your exam and start with a free mock test."}
            </p>
          </div>

          {(tabs.length > 1 || category !== "all") && (
            <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter by exam">
              {[{ id: "all", label: "All", count: series.length }, ...tabs.map((c) => ({ id: c.id, label: c.label, count: counts[c.id] || 0 }))].map((t) => {
                const on = category === t.id;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setCategory(t.id)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 ${
                      on
                        ? "border-slate-900 bg-slate-900 text-white shadow-md"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                    }`}
                  >
                    {t.label}
                    {!isLoading && (
                      <span className={`rounded-full px-2 py-0.5 text-[11px] ${on ? "bg-white/20" : "bg-slate-100 text-slate-500"}`}>
                        {t.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {!isLoading && active && items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <p className="text-lg font-extrabold text-slate-900">{active.label} tests are coming soon</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                We&apos;re adding {active.label} mock tests. In the meantime, explore the other exam series.
              </p>
              <button
                onClick={() => setCategory("all")}
                className="mt-6 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
              >
                View all series
              </button>
            </div>
          ) : (
            <TestSeriesGrid title="" items={items} isLoading={isLoading} />
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default TestSeries;
