import { useEffect, useState } from "react";
import { fetchSeries, getCachedSeries } from "./useAllSeries";

// Loads one technology's "test series" (its levels). Uses the shared, cached
// summary list - no need to download every quiz and all of its questions.
export default function useSeries(techId) {
  const pick = (list) => {
    const found = list?.find((s) => s.id === techId);
    return found
      ? {
          id: found.id,
          name: found.name,
          category: found.category,
          marksPerQuestion: found.marksPerQuestion,
          negativeMarking: found.negativeMarking,
          levels: found.levels,
        }
      : null;
  };

  const cached = getCachedSeries();
  const [series, setSeries] = useState(() => (cached ? pick(cached) : null));
  const [isLoading, setIsLoading] = useState(!cached);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetchSeries()
      .then((list) => {
        if (!active) return;
        setSeries(pick(list));
        setError("");
      })
      .catch(() => {
        if (active && !getCachedSeries()) setError("Could not load this test series.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [techId]);

  return { series, isLoading, error };
}

export const getStoredUser = () => {
  try {
    return (
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(sessionStorage.getItem("user")) ||
      null
    );
  } catch {
    return null;
  }
};
