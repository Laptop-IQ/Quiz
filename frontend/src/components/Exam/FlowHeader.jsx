import React from "react";

// Shared header for the Test Series "instructions" and "start" pages,
// styled like testbook.com's pre-test flow: logo + small subtitle on the
// left, the full test title centered next to it.
const FlowHeader = ({ title }) => (
  <div className="flex items-center gap-4 px-6 py-3 bg-white border-b border-gray-200">
    <div className="flex items-center gap-2 shrink-0">
      <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
        <rect x="1" y="1" width="24" height="28" rx="5" fill="#fff" stroke="#16A34A" strokeWidth="1.8" />
        <path d="M8 22V9l5 4 5-4v13l-5-3-5 3z" fill="#15803D" />
      </svg>
      <div className="leading-tight">
        <p className="text-[#15803D] font-bold text-lg">techquiz</p>
        <p className="text-gray-500 text-xs truncate max-w-[180px]">{title}</p>
      </div>
    </div>
    <div className="hidden sm:block text-gray-800 font-medium truncate">
      {title}
    </div>
  </div>
);

export default FlowHeader;
