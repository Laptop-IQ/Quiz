import { LETTERS } from "../../lib/grading";
import RichText from "../RichText";
import NatKeypad from "./NatKeypad";

const RADIO = "w-[15px] h-[15px] cursor-pointer";

// The question text + the answer input for its type.
// value: number (mcq) | number[] (msq) | string (nat) | undefined
const QuestionBody = ({ q, qIndex, value, onChange }) => {
  const type = q.type || "mcq";

  const toggleMsq = (i) => {
    const cur = Array.isArray(value) ? value : [];
    const next = cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i].sort((a, b) => a - b);
    onChange(next.length ? next : undefined);
  };

  return (
    <div className="mx-[20px] mb-5 border border-[#e2e2e2]">
      <div className="px-[20px] py-[10px] text-[20px] text-[#222] border-b border-[#e2e2e2]">
        <RichText>{q.text}</RichText>
        {type === "msq" && (
          <p className="mt-2 text-[14px] text-gray-500">Select all the correct options.</p>
        )}
      </div>

      {type === "nat" ? (
        <NatKeypad value={typeof value === "string" ? value : ""} onChange={(v) => onChange(v === "" ? undefined : v)} />
      ) : (
        q.options.map((opt, i) => {
          const checked = type === "msq" ? Array.isArray(value) && value.includes(i) : value === i;
          return (
            <div
              key={i}
              onClick={() => (type === "msq" ? toggleMsq(i) : onChange(checked ? undefined : i))}
              className="flex items-stretch border-b border-[#e2e2e2] last:border-b-0 cursor-pointer hover:bg-gray-50"
            >
              <div className="w-[56px] shrink-0 border-r border-[#e2e2e2] flex items-center justify-center">
                <input
                  type={type === "msq" ? "checkbox" : "radio"}
                  name={`q-${qIndex}`}
                  checked={checked}
                  readOnly
                  aria-label={`Option ${LETTERS[i]}`}
                  className={RADIO}
                />
              </div>
              <div className="px-5 py-[22px] text-[20px] min-w-0"><RichText>{opt}</RichText></div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default QuestionBody;
