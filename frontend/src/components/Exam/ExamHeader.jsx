import { Maximize2, Minimize2 } from "lucide-react";

const formatTime = (s) => {
  const t = Math.max(0, s);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const sec = t % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(sec).padStart(2, "0");
  return h > 0 ? `${String(h).padStart(2, "0")} : ${mm} : ${ss}` : `${mm} : ${ss}`;
};

const Silhouette = ({ label }) => (
  <div className="relative w-[70px] h-[70px] shrink-0">
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="36" r="21" fill="#b9b9b9" />
      <path d="M6 100c0-28 19-42 44-42s44 14 44 42z" fill="#b9b9b9" />
    </svg>
    <span className="absolute bottom-0 inset-x-0 text-[5px] font-bold text-center text-gray-800 leading-[14px]">
      {label}
    </span>
  </div>
);

const Logo = () => (
  <div className="flex items-center gap-1.5">
    <svg width="26" height="30" viewBox="0 0 26 30" fill="none">
      <rect x="1" y="1" width="24" height="28" rx="5" fill="#fff" stroke="#00bcd4" strokeWidth="1.5" />
      <path d="M8 22V9l5 4 5-4v13l-5-3-5 3z" fill="#0b2545" />
    </svg>
    <span className="text-[20px] leading-none font-semibold tracking-tight text-[#00bcd4]">
      Tech Quiz Master
    </span>
  </div>
);

export default function ExamHeader({
  title,
  rollNo,
  timeLeft,
  timeLabel = "Section Time",
  onZoomIn,
  onZoomOut,
  onPause,
  onFullscreen,
  isFullscreen,
}) {
  return (
    <header className="bg-white shadow-[0_2px_6px_rgba(0,0,0,0.12)] relative z-20">
      <div className="flex items-center justify-between gap-3 px-5 h-[80px]">
        {/* LEFT */}
        <div className="min-w-0 w-[200px] lg:w-[520px] shrink-0 relative h-full flex flex-col justify-center">
          <Logo />
          <div className="mt-2 text-[13px] font-bold text-black truncate w-[200px]">
            {title}
          </div>
          <div className="hidden lg:flex gap-2 absolute left-[324px] bottom-[26px]">
            <button onClick={onZoomIn} className="bg-[#1a6fd0] text-white text-[13px] px-2.5 py-[3px] rounded-full cursor-pointer">
              Zoom (+)
            </button>
            <button onClick={onZoomOut} className="bg-[#1a6fd0] text-white text-[13px] px-2.5 py-[3px] rounded-full cursor-pointer">
              Zoom (-)
            </button>
          </div>
        </div>

        {/* CENTER */}
        <div className="hidden md:block flex-1 text-center min-w-0">
          <div className="text-[14px] font-bold text-[#222] truncate max-w-[420px] mx-auto">
            {title}
          </div>
          <div className="text-[12px] font-semibold text-[#222] mt-2">
            Roll No : {rollNo}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex gap-1.5">
            <button
              onClick={onFullscreen}
              aria-label="Fullscreen"
              className="w-8 h-8 border-2 border-[#26c6da] rounded flex items-center justify-center cursor-pointer bg-white"
            >
              {isFullscreen ? (
                <Minimize2 size={20} className="text-[#26c6da]" />
              ) : (
                <Maximize2 size={20} className="text-[#26c6da]" />
              )}
            </button>
            <button
              onClick={onPause}
              aria-label="Pause test"
              className="w-8 h-8 border-2 border-[#26c6da] rounded flex items-center justify-center gap-[4px] cursor-pointer bg-white"
            >
              <span className="w-[5px] h-[18px] bg-[#26c6da]" />
              <span className="w-[5px] h-[18px] bg-[#26c6da]" />
            </button>
          </div>

          <div className="text-center">
            <div className="text-[16px] text-[#333] leading-5">{timeLabel}</div>
            <div className="bg-[#fff3c4] text-[#f00] font-bold text-[16px] leading-7 px-1.5 mt-0.5 whitespace-nowrap">
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className="hidden xl:flex gap-2">
            <Silhouette label="Registration Photo" />
            <Silhouette label="Captured Photo" />
          </div>
        </div>
      </div>
    </header>
  );
}
