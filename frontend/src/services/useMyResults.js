import { useEffect, useState } from "react";
import { useApi } from "./api/api";

// Loads the logged-in user's saved quiz results from /result/my-result
export default function useMyResults() {
  const { request } = useApi();
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await request("/result/my-result");
        if (active) setResults(Array.isArray(data) ? data : []);
      } catch {
        if (active) setError("Could not load your results.");
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [request]);

  return { results, isLoading, error };
}
