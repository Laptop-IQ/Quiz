import React from "react";
import { useNavigate } from "react-router-dom";

const cards = [
  { bg: "bg-green-50", ic: "bg-green-500", icon: "/icons/training-icon.svg", title: "Learn from the Best", text: "Concept-focused questions with clear explanations on every answer", cls: "" },
  { bg: "bg-pink-50", ic: "bg-pink-500", icon: "/icons/live-streaming-icon.svg", title: "Timed Tests for Real Experience", text: "Feel the pressure of a real test and improve your time management", cls: "lg:mt-14" },
  { bg: "bg-yellow-50", ic: "bg-yellow-400", icon: "/icons/growth-icon.svg", title: "Detailed Score Analysis", text: "Get a breakdown of your strengths and weaknesses", cls: "lg:-mt-24" },
  { bg: "bg-purple-50", ic: "bg-purple-500", icon: "/icons/language-translate-bubbles-icon.svg", title: "Multiple Technologies", text: "HTML, CSS, JavaScript, React, Node and more in one place", cls: "lg:-mt-11" },
];

const WhyUs = () => {
  const navigate = useNavigate();
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-16 py-20">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-16">
        <div className="lg:w-1/2 lg:py-24">
          <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-6">
            <img src="/icons/training-icon.svg" alt="" className="w-6 h-6" />
          </div>
          <h2 className="text-4xl font-semibold mb-6">Why Tech Quiz Master?</h2>
          <p className="text-gray-600 max-w-md mb-10 leading-relaxed">
            Practice with <span className="font-medium">level-wise tests</span> and{" "}
            <span className="font-semibold">instant result analysis</span> to grow faster.
          </p>
          <button onClick={() => navigate("/test-series")} className="bg-green-500 hover:bg-green-600 text-white px-7 py-3 rounded-lg font-medium cursor-pointer">
            Get Started For Free
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-16">
          {cards.map((c) => (
            <div key={c.title} className={`${c.bg} ${c.cls} p-7 rounded-2xl shadow-sm w-64 h-64`}>
              <div className={`w-12 h-12 ${c.ic} rounded-xl flex items-center justify-center mb-4`}>
                <img src={c.icon} alt="" className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{c.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
