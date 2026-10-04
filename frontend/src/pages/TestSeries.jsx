import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Landing/Footer";
import TestSeriesGrid from "../components/Landing/TestSeriesGrid";

const TestSeries = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <section className="bg-blue-50 py-8 flex-1">
      <div className="max-w-7xl mx-auto px-6 lg:px-18">
        <TestSeriesGrid />
      </div>
    </section>
    <Footer />
  </div>
);

export default TestSeries;
