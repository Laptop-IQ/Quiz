import TestSeriesCard from "./TestSeriesCard";
import useAllSeries from "../../services/useAllSeries";

const TestSeriesGrid = ({ title = "All Test Series", items, isLoading: externalLoading = false }) => {
  // Only fetch when the parent did not pass items (avoids a duplicate request)
  const fallback = useAllSeries(items === undefined);
  const series = items ?? fallback.series;
  const isLoading = items === undefined ? fallback.isLoading : externalLoading;
  const error = items === undefined ? fallback.error : null;

  return (
    <div className="test-series-grid-wrap">
      {title && <h2 className="mb-6 text-xl font-semibold text-white">{title}</h2>}

      {isLoading && (
        <div className="test-series-grid">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="test-series-skeleton" />)}
        </div>
      )}

      {!isLoading && error && <p className="rounded-2xl border border-red-400/20 bg-red-500/10 py-10 text-center text-red-300">{error}</p>}

      {!isLoading && !error && series.length === 0 && (
        <div className="test-series-empty">
          <p>No test series found.</p>
          <span>Try another search or check back later.</span>
        </div>
      )}

      {!isLoading && !error && series.length > 0 && (
        <div className="test-series-grid">
          {series.map((item) => <TestSeriesCard key={item.id} item={item} />)}
        </div>
      )}
    </div>
  );
};

export default TestSeriesGrid;
