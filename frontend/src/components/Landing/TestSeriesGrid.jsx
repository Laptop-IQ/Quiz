import React from "react";
import TestSeriesCard from "./TestSeriesCard";
import useAllSeries from "../../services/useAllSeries";

// The grid part of "All Test Series", reused by the public /test-series
// page and by /dashboard/test-series (rendered inside the sidebar shell).
const TestSeriesGrid = ({ title = "All Test Series" }) => {
  const { series, isLoading, error } = useAllSeries();

  return (
    <div>
      {title && <h1 className="text-3xl font-semibold mb-10">{title}</h1>}

      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-500" />
        </div>
      )}

      {!isLoading && error && (
        <p className="text-center text-red-600 py-10">{error}</p>
      )}

      {!isLoading && !error && series.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          No test series available yet.
        </p>
      )}

      {!isLoading && !error && series.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {series.map((item) => (
            <TestSeriesCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TestSeriesGrid;
