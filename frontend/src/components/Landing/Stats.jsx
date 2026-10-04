import React from "react";

const items = [
  { bg: "bg-green-50", icon: "/icons/safety-icon.png", label: "Registered Students", value: "10K+" },
  { bg: "bg-yellow-50", icon: "/icons/gold-winner.png", label: "Student Selections", value: "2K+" },
  { bg: "bg-purple-50", icon: "/icons/clipboard.svg", label: "Tests Attempted", value: "50K+" },
  { bg: "bg-orange-50", icon: "/icons/chat-question-icon.svg", label: "Questions Practiced", value: "1M+" },
];

const Stats = () => (
  <section className="relative -mt-16 z-10">
    <div className="max-w-6xl mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 p-2">
        {items.map((s) => (
          <div key={s.label} className={`flex items-center gap-4 ${s.bg} rounded-xl p-5`}>
            <img src={s.icon} className="w-10 h-10" alt="" />
            <div>
              <p className="text-gray-600 text-sm">{s.label}</p>
              <p className="text-xl font-bold">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;
