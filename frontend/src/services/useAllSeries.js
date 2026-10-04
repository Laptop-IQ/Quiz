import { useEffect, useState } from "react";
import { useApi } from "./api/api";

const LEVEL_ORDER = ["basic", "intermediate", "advanced"];

// Loads every technology as a "test series" (grouped from /user/quizzes)
export default function useAllSeries() {
  const { request } = useApi();
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await request("/user/quizzes");
        const grouped = {};
        data.forEach((q) => {
          const id = q.technology?.toLowerCase();
          if (!id) return;
          if (!grouped[id]) {
            grouped[id] = {
              id,
              name: id.charAt(0).toUpperCase() + id.slice(1),
              levels: [],
              totalQuestions: 0,
            };
          }
          const count = q.questions?.length || 0;
          grouped[id].levels.push({
            level: q.level,
            questionCount: count,
            timeLimit: q.timeLimit || 0,
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
        if (active) setSeries(Object.values(grouped));
      } catch {
        if (active) setError("Could not load test series. Please try again.");
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [request]);

  return { series, isLoading, error };
}
