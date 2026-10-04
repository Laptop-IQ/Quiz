import { useEffect, useState } from "react";
import { useApi } from "./api/api";

const LEVEL_ORDER = ["basic", "intermediate", "advanced"];

// Loads one technology's "test series" (its levels) from /user/quizzes
export default function useSeries(techId) {
  const { request } = useApi();
  const [series, setSeries] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await request("/user/quizzes");
        const levels = data
          .filter((q) => q.technology?.toLowerCase() === techId)
          .map((q) => ({
            level: q.level,
            questionCount: q.questions?.length || 0,
            timeLimit: q.timeLimit || 0, // minutes
          }))
          .sort(
            (a, b) =>
              LEVEL_ORDER.indexOf(a.level?.toLowerCase()) -
              LEVEL_ORDER.indexOf(b.level?.toLowerCase()),
          );

        if (!active) return;
        setSeries(
          levels.length
            ? {
                id: techId,
                name: techId.charAt(0).toUpperCase() + techId.slice(1),
                levels,
              }
            : null,
        );
      } catch (e) {
        if (active) setError("Could not load this test series.");
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [request, techId]);

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
