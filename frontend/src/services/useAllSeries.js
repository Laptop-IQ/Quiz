import { useEffect, useState } from "react";
import { apiRequest } from "./api/api";

const LEVEL_ORDER = ["basic", "intermediate", "advanced"];
const CACHE_KEY = "series-cache-v2";
const FRESH_MS = 60_000; // within this window no network request is made at all

let memory = null; // { at, series }
let inflight = null; // shared request so several components never fetch twice

const readCache = () => {
  if (memory) return memory;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (raw) memory = JSON.parse(raw);
  } catch {
    /* ignore corrupt / unavailable storage */
  }
  return memory;
};

const writeCache = (series) => {
  memory = { at: Date.now(), series };
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(memory));
  } catch {
    /* storage full / blocked - memory cache still works */
  }
};

// Accepts both the light summary rows ({ questionCount }) and the full quiz
// documents ({ questions: [...] }) so it keeps working with an older backend.
const groupSeries = (rows) => {
  const grouped = {};
  rows.forEach((q) => {
    const id = q.technology?.toLowerCase();
    if (!id) return;
    if (!grouped[id]) {
      grouped[id] = {
        id,
        name: q.examName || id.charAt(0).toUpperCase() + id.slice(1),
        category: q.category || "tech",
        marksPerQuestion: q.marksPerQuestion ?? 1,
        negativeMarking: q.negativeMarking ?? 0,
        levels: [],
        totalQuestions: 0,
      };
    }
    const count = q.questionCount ?? q.questions?.length ?? 0;
    grouped[id].levels.push({
      level: q.level,
      questionCount: count,
      timeLimit: q.timeLimit || 0,
      marksPerQuestion: q.marksPerQuestion ?? 1,
      negativeMarking: q.negativeMarking ?? 0,
    });
    grouped[id].totalQuestions += count;
  });
  Object.values(grouped).forEach((s) =>
    s.levels.sort(
      (a, b) =>
        LEVEL_ORDER.indexOf(a.level?.toLowerCase()) -
        LEVEL_ORDER.indexOf(b.level?.toLowerCase()),
    ),
  );
  return Object.values(grouped);
};

export const getCachedSeries = () => readCache()?.series ?? null;

export const fetchSeries = ({ force = false } = {}) => {
  const cached = readCache();
  if (!force && cached && Date.now() - cached.at < FRESH_MS) {
    return Promise.resolve(cached.series);
  }
  if (inflight) return inflight;

  inflight = (async () => {
    let rows;
    try {
      rows = await apiRequest("/user/quizzes/summary");
      if (!Array.isArray(rows)) throw new Error("Unexpected response");
    } catch {
      // older backend without the summary route -> fall back to the full list
      rows = await apiRequest("/user/quizzes");
    }
    const series = groupSeries(Array.isArray(rows) ? rows : []);
    writeCache(series);
    return series;
  })().finally(() => {
    inflight = null;
  });

  return inflight;
};

// Warm the cache before the user opens a page that needs it.
export const prefetchSeries = () => {
  fetchSeries().catch(() => {});
};

// Loads every technology as a "test series".
// Stale-while-revalidate: cached data renders instantly, fresh data replaces it silently.
// Pass `false` to skip fetching (when the caller already has the data).
export default function useAllSeries(enabled = true) {
  const cached = enabled ? readCache() : null;
  const [series, setSeries] = useState(cached?.series ?? []);
  const [isLoading, setIsLoading] = useState(enabled && !cached);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!enabled) return undefined;
    let active = true;
    fetchSeries()
      .then((next) => {
        if (!active) return;
        setSeries(next);
        setError("");
      })
      .catch(() => {
        if (active && !readCache()) setError("Could not load test series. Please try again.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [enabled]);

  return { series, isLoading, error };
}
