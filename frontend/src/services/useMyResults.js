import { useEffect, useState } from "react";
import { apiRequest } from "./api/api";

const FRESH_MS = 30_000;

// Results are per-user, so the cache lives in memory only and is keyed by the
// auth token: logging out / switching accounts can never show someone else's data.
let cache = null; // { token, at, data }
let inflight = null; // { token, promise }

const currentToken = () =>
  localStorage.getItem("token") || sessionStorage.getItem("token") || "";

const validCache = () => (cache && cache.token === currentToken() ? cache : null);

// Call after a new result is saved so the next screen shows it.
export const invalidateResults = () => {
  cache = null;
  inflight = null;
};

export const getCachedResults = () => validCache()?.data ?? null;

export const fetchResults = ({ force = false } = {}) => {
  const token = currentToken();
  if (!token) return Promise.resolve([]);

  const cached = validCache();
  if (!force && cached && Date.now() - cached.at < FRESH_MS) {
    return Promise.resolve(cached.data);
  }
  if (inflight && inflight.token === token) return inflight.promise;

  const promise = apiRequest("/result/my-result")
    .then((d) => {
      const data = Array.isArray(d) ? d : [];
      if (inflight?.promise === promise) cache = { token, at: Date.now(), data };
      return data;
    })
    .finally(() => {
      if (inflight?.promise === promise) inflight = null;
    });
  inflight = { token, promise };
  return promise;
};

export const prefetchResults = () => {
  fetchResults().catch(() => {});
};

// Loads the logged-in user's saved quiz results from /result/my-result.
// Cached data renders instantly; fresh data replaces it silently (stale-while-revalidate).
export default function useMyResults() {
  const cached = getCachedResults();
  const [results, setResults] = useState(cached ?? []);
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchResults()
      .then((data) => {
        if (!active) return;
        setResults(data);
        setError("");
      })
      .catch(() => {
        if (active && !getCachedResults()) setError("Could not load your results.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { results, isLoading, error };
}
