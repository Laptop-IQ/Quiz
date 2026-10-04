import React from "react";
import TestSeriesGrid from "../components/Landing/TestSeriesGrid";

// Test Series, browsed from inside the dashboard shell (sidebar stays visible).
const DashboardTestSeries = () => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
    <TestSeriesGrid title="Test Series" />
  </div>
);

export default DashboardTestSeries;
