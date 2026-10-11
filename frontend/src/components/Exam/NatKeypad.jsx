import { useRef } from "react";

// What a numerical answer may look like while typing: -, 12, 12., -0.5 ...
const ALLOWED = /^-?\d*\.?\d*$/;

const Key = ({ children, onPress, wide, label }) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()} // keep the caret in the input
    onClick={onPress}
    aria-label={label}
    className={`h-[30px] ${wide ? "px-4" : "w-[26px]"} rounded-[5px] border border-[#555] bg-white text-[14px] font-bold hover:bg-gray-100 active:bg-gray-200 cursor-pointer`}
  >
    {children}
  </button>
);

// GATE-style on-screen keypad for numerical-answer (NAT) questions
const NatKeypad = ({ value = "", onChange }) => {
  const ref = useRef(null);

  const apply = (next, caret) => {
    if (!ALLOWED.test(next)) return;
    onChange(next);
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(caret, caret);
    });
  };

  const selection = () => {
    const el = ref.current;
    const s = el?.selectionStart ?? value.length;
    const e = el?.selectionEnd ?? s;
    return [s, e];
  };

  const insert = (ch) => {
    const [s, e] = selection();
    apply(value.slice(0, s) + ch + value.slice(e), s + 1);
  };

  const backspace = () => {
    const [s, e] = selection();
    if (s !== e) return apply(value.slice(0, s) + value.slice(e), s);
    if (s === 0) return;
    apply(value.slice(0, s - 1) + value.slice(s), s - 1);
  };

  const move = (dir) => {
    const [s] = selection();
    const pos = Math.max(0, Math.min(value.length, s + dir));
    ref.current?.focus();
    ref.current?.setSelectionRange(pos, pos);
  };

  const rows = [["7", "8", "9"], ["4", "5", "6"], ["1", "2", "3"], ["0", ".", "-"]];

  return (
    <div className="px-[20px] py-4">
      <input
        ref={ref}
        value={value}
        onChange={(e) => ALLOWED.test(e.target.value) && onChange(e.target.value)}
        inputMode="decimal"
        autoComplete="off"
        aria-label="Your numerical answer"
        className="block w-[230px] max-w-full h-[34px] border border-[#767676] rounded-[3px] px-2 text-[18px] outline-none focus:border-[#0aa0cc] select-text"
      />
      <div className="mt-3 inline-block bg-[#f0f0f0] p-3 rounded-[4px]" role="group" aria-label="Number pad">
        <div className="mb-2">
          <Key wide onPress={backspace} label="Backspace">Backspace</Key>
        </div>
        <div className="space-y-[6px]">
          {rows.map((r) => (
            <div key={r.join("")} className="flex gap-[6px]">
              {r.map((k) => <Key key={k} onPress={() => insert(k)}>{k}</Key>)}
            </div>
          ))}
        </div>
        <div className="mt-2 flex gap-[6px]">
          <Key onPress={() => move(-1)} label="Move left">←</Key>
          <Key onPress={() => move(1)} label="Move right">→</Key>
        </div>
      </div>
    </div>
  );
};

export default NatKeypad;
