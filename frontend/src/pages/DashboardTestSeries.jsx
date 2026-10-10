import { useEffect, useMemo, useRef, useState } from "react";
import { Search, SlidersHorizontal, Sparkles, X, ChevronDown, RotateCcw, ArrowUpDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import TestSeriesGrid from "../components/Landing/TestSeriesGrid";
import { EXAM_CATEGORIES, getCategory } from "../config/examCategories";
import useAllSeries from "../services/useAllSeries";

const NICE = { html: "HTML", css: "CSS", javascript: "JavaScript", react: "React", node: "Node.js", mongodb: "MongoDB", java: "Java", python: "Python" };
const LEVELS = ["basic", "intermediate", "advanced"];
const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

const SIZE_OPTIONS = [
  { id: "any", label: "Any size" },
  { id: "quick", label: "Quick", hint: "up to 30 Qs", test: (n) => n <= 30 },
  { id: "standard", label: "Standard", hint: "31–100 Qs", test: (n) => n > 30 && n <= 100 },
  { id: "extensive", label: "Extensive", hint: "100+ Qs", test: (n) => n > 100 },
];
const TEST_OPTIONS = [
  { id: "any", label: "Any" },
  { id: "1", label: "1 test", test: (n) => n === 1 },
  { id: "2", label: "2 tests", test: (n) => n === 2 },
  { id: "3", label: "3+ tests", test: (n) => n >= 3 },
];
const SORTS = [
  { id: "popular", label: "Recommended" },
  { id: "questions", label: "Most questions" },
  { id: "tests", label: "Most tests" },
  { id: "az", label: "A → Z" },
];

const DashboardTestSeries = () => {
  const { series = [], isLoading } = useAllSeries();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");
  const [levels, setLevels] = useState([]);
  // exam category lives in the URL (?category=ssc) so links from the home page work
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category") || "all";
  const setCategory = (id) => setSearchParams(id === "all" ? {} : { category: id }, { replace: true });
  const [size, setSize] = useState("any");
  const [tests, setTests] = useState("any");
  const [panelOpen, setPanelOpen] = useState(false);
  const searchRef = useRef(null);

  // "/" focuses the search box (like GitHub / Notion)
  useEffect(() => {
    const onKey = (e) => {
      const tag = e.target?.tagName;
      if (e.key === "/" && tag !== "INPUT" && tag !== "TEXTAREA" && tag !== "SELECT" && !e.target?.isContentEditable) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const levelCounts = useMemo(() => {
    const counts = {};
    LEVELS.forEach((l) => (counts[l] = series.filter((s) => s.levels?.some((x) => x.level?.toLowerCase() === l)).length));
    return counts;
  }, [series]);

  const categoryCounts = useMemo(() => {
    const counts = {};
    series.forEach((s) => {
      const id = s.category || "tech";
      counts[id] = (counts[id] || 0) + 1;
    });
    return counts;
  }, [series]);
  const presentCategories = EXAM_CATEGORIES.filter((c) => categoryCounts[c.id] > 0 || c.id === category);

  const filteredSeries = useMemo(() => {
    const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const sizeOpt = SIZE_OPTIONS.find((o) => o.id === size);
    const testOpt = TEST_OPTIONS.find((o) => o.id === tests);

    const next = series.filter((item) => {
      const haystack = `${item.name} ${item.id} ${NICE[item.id] || ""} ${(item.levels || []).map((l) => l.level).join(" ")}`.toLowerCase();
      if (!tokens.every((t) => `${haystack} ${getCategory(item.category).label} ${item.category || ""}`.toLowerCase().includes(t))) return false;
      if (category !== "all" && (item.category || "tech") !== category) return false;
      if (levels.length && !levels.some((l) => item.levels?.some((x) => x.level?.toLowerCase() === l))) return false;
      if (sizeOpt?.test && !sizeOpt.test(item.totalQuestions || 0)) return false;
      if (testOpt?.test && !testOpt.test(item.levels?.length || 0)) return false;
      return true;
    });

    if (sort === "questions") next.sort((a, b) => (b.totalQuestions || 0) - (a.totalQuestions || 0));
    else if (sort === "tests") next.sort((a, b) => (b.levels?.length || 0) - (a.levels?.length || 0));
    else if (sort === "az") next.sort((a, b) => (NICE[a.id] || a.name).localeCompare(NICE[b.id] || b.name));
    return next;
  }, [query, series, sort, levels, size, tests, category]);

  const toggleLevel = (l) => setLevels((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]));

  const activeChips = [
    ...(category !== "all" ? [{ key: "category", label: getCategory(category).label, clear: () => setCategory("all") }] : []),
    ...levels.map((l) => ({ key: `l-${l}`, label: `${cap(l)} level`, clear: () => toggleLevel(l) })),
    ...(size !== "any" ? [{ key: "size", label: SIZE_OPTIONS.find((o) => o.id === size).label, clear: () => setSize("any") }] : []),
    ...(tests !== "any" ? [{ key: "tests", label: TEST_OPTIONS.find((o) => o.id === tests).label, clear: () => setTests("any") }] : []),
  ];
  const panelFilterCount = (size !== "any" ? 1 : 0) + (tests !== "any" ? 1 : 0);
  const hasAnyFilter = activeChips.length > 0 || query.trim() !== "";

  const resetAll = () => {
    setQuery("");
    setLevels([]);
    setCategory("all");
    setSize("any");
    setTests("any");
    setSort("popular");
  };

  const total = series.length;
  const shown = filteredSeries.length;

  return (
    <section className="test-series-page">
      <div className="test-series-hero">
        <div className="ts-hero-top">
          <div className="ts-hero-copy">
            <div className="test-series-kicker"><Sparkles size={14} /> Learning Hub</div>
            <h1>Test Series</h1>
            <p>Choose a focused series, attempt premium mock tests and track your preparation.</p>
          </div>
          <div className="test-series-total">
            <strong>{isLoading ? "—" : hasAnyFilter ? `${shown}/${total}` : total}</strong>
            <span>{hasAnyFilter && !isLoading ? "Matching series" : "Series available"}</span>
          </div>
        </div>

        <div className="ts-controls">
          <div className="ts-search">
            <Search size={17} className="ts-search-icon" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Escape") { setQuery(""); e.currentTarget.blur(); } }}
              placeholder="Search by exam, subject or level…"
              aria-label="Search test series"
              autoComplete="off"
              spellCheck={false}
            />
            {query ? (
              <button type="button" className="ts-icon-btn" onClick={() => { setQuery(""); searchRef.current?.focus(); }} aria-label="Clear search">
                <X size={15} />
              </button>
            ) : (
              <kbd className="ts-kbd" aria-hidden="true">/</kbd>
            )}
          </div>

          <label className="ts-select">
            <ArrowUpDown size={15} />
            <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort test series">
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
            <ChevronDown size={14} className="ts-select-caret" />
          </label>

          <button
            type="button"
            className={`ts-filter-btn ${panelOpen ? "is-open" : ""}`}
            onClick={() => setPanelOpen((o) => !o)}
            aria-expanded={panelOpen}
            aria-controls="ts-filter-panel"
          >
            <SlidersHorizontal size={15} />
            <span>Filters</span>
            {panelFilterCount > 0 && <b className="ts-badge">{panelFilterCount}</b>}
          </button>
        </div>

        {(presentCategories.length > 1 || category !== "all") && (
          <div className="ts-chip-row" role="group" aria-label="Filter by exam">
            <span className="ts-chip-label">Exam</span>
            <button type="button" className={`ts-chip ${category === "all" ? "is-active" : ""}`} onClick={() => setCategory("all")} aria-pressed={category === "all"}>
              All <em>{isLoading ? "" : series.length}</em>
            </button>
            {presentCategories.map((c) => (
              <button key={c.id} type="button" className={`ts-chip ${category === c.id ? "is-active" : ""}`} onClick={() => setCategory(c.id)} aria-pressed={category === c.id}>
                {c.label} <em>{isLoading ? "" : categoryCounts[c.id] || 0}</em>
              </button>
            ))}
          </div>
        )}

        <div className="ts-chip-row" role="group" aria-label="Filter by level">
          <span className="ts-chip-label">Level</span>
          <button type="button" className={`ts-chip ${levels.length === 0 ? "is-active" : ""}`} onClick={() => setLevels([])} aria-pressed={levels.length === 0}>
            All
          </button>
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              className={`ts-chip ${levels.includes(l) ? "is-active" : ""}`}
              onClick={() => toggleLevel(l)}
              aria-pressed={levels.includes(l)}
              disabled={!isLoading && levelCounts[l] === 0}
            >
              {cap(l)} <em>{isLoading ? "" : levelCounts[l]}</em>
            </button>
          ))}
        </div>

        <div id="ts-filter-panel" className={`ts-panel ${panelOpen ? "is-open" : ""}`} aria-hidden={!panelOpen}>
          <div className="ts-panel-inner">
            <div className="ts-panel-grid">
              <fieldset className="ts-field" disabled={!panelOpen}>
                <legend>Question count</legend>
                <div className="ts-seg">
                  {SIZE_OPTIONS.map((o) => (
                    <button key={o.id} type="button" className={size === o.id ? "is-active" : ""} onClick={() => setSize(o.id)} aria-pressed={size === o.id} tabIndex={panelOpen ? 0 : -1}>
                      {o.label}{o.hint && <small>{o.hint}</small>}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset className="ts-field" disabled={!panelOpen}>
                <legend>Tests in series</legend>
                <div className="ts-seg">
                  {TEST_OPTIONS.map((o) => (
                    <button key={o.id} type="button" className={tests === o.id ? "is-active" : ""} onClick={() => setTests(o.id)} aria-pressed={tests === o.id} tabIndex={panelOpen ? 0 : -1}>
                      {o.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          </div>
        </div>

        {(hasAnyFilter || sort !== "popular") && !isLoading && (
          <div className="ts-active-row">
            <span className="ts-result-count" aria-live="polite">
              Showing <b>{shown}</b> of {total} series
            </span>
            {activeChips.map((c) => (
              <button key={c.key} type="button" className="ts-pill" onClick={c.clear} aria-label={`Remove filter ${c.label}`}>
                {c.label} <X size={12} />
              </button>
            ))}
            <button type="button" className="ts-clear" onClick={resetAll}>
              <RotateCcw size={12} /> Reset all
            </button>
          </div>
        )}
      </div>

      {!isLoading && shown === 0 && total > 0 ? (
        <div className="test-series-empty">
          <p>No series match your filters</p>
          <span>Try a different keyword or remove some filters.</span>
          <button type="button" className="ts-empty-btn" onClick={resetAll}><RotateCcw size={14} /> Reset filters</button>
        </div>
      ) : (
        <TestSeriesGrid title="" items={filteredSeries} isLoading={isLoading} />
      )}
    </section>
  );
};

export default DashboardTestSeries;
