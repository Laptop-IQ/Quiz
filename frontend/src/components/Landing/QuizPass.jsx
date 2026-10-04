import React from "react";
import { useNavigate } from "react-router-dom";
import TestingIllustration from "../../assets/testing-amico.svg";
import RankIcon from "../../assets/icons/gold-winner-trophy-icon.svg";
import PatternIcon from "../../assets/icons/rules-icon.svg";
import AnalysisIcon from "../../assets/icons/growth-icon.svg";
import LanguageIcon from "../../assets/icons/language-translate-bubbles-icon.svg";

const features = [
  { text: "Leaderboard Rank", icon: RankIcon, bg: "bg-yellow-100" },
  { text: "Latest Tech Patterns", icon: PatternIcon, bg: "bg-purple-100" },
  { text: "In-depth Performance Analysis", icon: AnalysisIcon, bg: "bg-orange-100" },
  { text: "Timed Mock Tests", icon: LanguageIcon, bg: "bg-green-100" },
];

const QuizPass = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full bg-[#f8fbff] py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <img src={TestingIllustration} alt="Testing" className="w-full max-w-md" loading="lazy" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">Practice every technology with</p>
          <div className="flex items-center gap-2 mb-6">
            <h1 className="text-4xl font-bold text-gray-900">Tech Quiz</h1>
            <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">FREE</span>
          </div>
          <p className="text-gray-600 max-w-lg mb-8">
            Unlimited access to level-wise mock tests on a structured online practice platform.
          </p>
          <h3 className="font-semibold text-gray-900 mb-6">What you get</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            {features.map((f) => (
              <div key={f.text} className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${f.bg}`}>
                  <img src={f.icon} alt="" className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-gray-800">{f.text}</p>
              </div>
            ))}
          </div>
          <button onClick={() => navigate("/test-series")} className="bg-sky-500 text-white font-medium px-6 py-3 rounded-lg cursor-pointer">
            Explore Test Series
          </button>
        </div>
      </div>
    </section>
  );
};

export default QuizPass;
