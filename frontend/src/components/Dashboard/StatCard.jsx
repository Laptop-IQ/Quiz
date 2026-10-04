import React from "react";

const StatCard = ({ title, value, sub, accent = "text-[#0B2D6B]" }) => (
  <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
    <p className="text-sm text-gray-500">{title}</p>
    <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
    {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
  </div>
);

export default StatCard;
