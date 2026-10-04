import React from "react";
import { Link } from "react-router-dom";
import {
  Code,
  Database,
  Coffee,
  Cpu,
  Globe,
  Layout,
  Terminal,
  Zap,
} from "lucide-react";

const techIcons = {
  html: { Icon: Code, color: "text-orange-500" },
  css: { Icon: Layout, color: "text-blue-500" },
  javascript: { Icon: Zap, color: "text-yellow-500" },
  react: { Icon: Cpu, color: "text-cyan-500" },
  node: { Icon: Terminal, color: "text-green-600" },
  mongodb: { Icon: Database, color: "text-green-700" },
  java: { Icon: Coffee, color: "text-red-500" },
  python: { Icon: Globe, color: "text-blue-600" },
};

const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

const nice = {
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  react: "React",
  node: "Node.js",
  mongodb: "MongoDB",
  java: "Java",
  python: "Python",
};

// Same structure as the testbook.com test-series card
const TestSeriesCard = ({ item }) => {
  const { Icon, color } = techIcons[item.id] || {
    Icon: Code,
    color: "text-gray-600",
  };

  const points = item.levels.map(
    (l) => `${cap(l.level)} Test - ${l.questionCount} Qs`,
  );
  points.push("Detailed Solutions & Analysis");
  const shown = points.length > 4 ? [...points.slice(0, 3), `+${points.length - 3} more`] : points;

  return (
    <div className="bg-white shadow-sm border border-gray-100 overflow-hidden flex flex-col h-full">
      <div className="bg-linear-to-b from-purple-200 to-white p-5 pb-6 min-h-25 flex justify-between items-center">
        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <span className="bg-white text-xs px-3 py-1 rounded-full text-gray-600">
          {item.totalQuestions} Questions
        </span>
      </div>

      <div className="px-5 mb-5 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 mb-3">
          {nice[item.id] || item.name} Mock Test Series 2026
        </h3>

        <p className="text-sm text-gray-700 mb-3">
          {item.levels.length} Total Tests |{" "}
          <span className="text-green-600">{item.levels.length} Free Tests</span>
        </p>

        <div className="border-t border-b border-gray-200 py-1 flex items-center px-2 mb-3">
          <p className="text-sm text-sky-600">English</p>
        </div>

        <ul className="text-sm text-gray-600 space-y-2 mb-6">
          {shown.map((p, i) => (
            <li key={i}>• {p}</li>
          ))}
        </ul>

        <Link
          to={`/test-series/${item.id}`}
          className="mt-auto bg-sky-500 text-white text-sm py-2.5 inline-block text-center hover:bg-blue-700"
        >
          View Test Series
        </Link>
      </div>
    </div>
  );
};

export default TestSeriesCard;
