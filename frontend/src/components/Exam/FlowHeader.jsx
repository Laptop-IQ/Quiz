
// Shared header for the Test Series "instructions" and "start" pages,
// styled like testbook.com's pre-test flow: logo + wordmark, then the
// test title inline on the same row (a single row, not stacked).
const FlowHeader = ({ title }) => (
  <div className="flex items-center gap-4 px-6 py-3.5 bg-white border-b border-gray-200">
    <div className="flex items-center gap-2 shrink-0">
      <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
        <rect
          x="1"
          y="1"
          width="24"
          height="28"
          rx="5"
          fill="#fff"
          stroke="#16A34A"
          strokeWidth="1.8"
        />
        <path d="M8 22V9l5 4 5-4v13l-5-3-5 3z" fill="#15803D" />
      </svg>
      <p className="text-[#15803D] font-bold text-xl">Tech Quiz Master</p>
    </div>
    <p className="text-gray-700 font-medium truncate">{title}</p>
  </div>
);

export default FlowHeader;
