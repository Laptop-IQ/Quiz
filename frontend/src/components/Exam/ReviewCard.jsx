import { LETTERS, correctIndices, describeAnswer, describeCorrect, isAnswered, natRange } from "../../lib/grading";
import RichText from "../RichText";
import { TYPE_LABEL } from "../../lib/richText";

const fmt = (n) => (Number.isInteger(n) ? n : Math.round(n * 100) / 100);

// One solved question: your answer vs the correct one, marks and the explanation
const ReviewCard = ({ q, index, response, graded }) => {
  const type = q.type || "mcq";
  const right = correctIndices(q);
  const mine = Array.isArray(response) ? response : response !== undefined && response !== null && type !== "nat" ? [response] : [];
  const answered = isAnswered(q, response);
  const status = graded?.status || (answered ? "wrong" : "skipped");
  const tone = status === "correct" ? "text-green-700" : status === "wrong" ? "text-red-700" : "text-gray-500";

  return (
    <div className="border rounded">
      <div className="border-b px-3 py-2 bg-gray-50 flex flex-wrap items-start justify-between gap-2">
        <div className="font-medium flex gap-1.5 min-w-0">
          <span className="shrink-0">Q{index + 1}.</span>
          <RichText>{q.text}</RichText>
        </div>
        <div className="text-xs text-right shrink-0">
          <p className="text-gray-500">{TYPE_LABEL[type]}</p>
          {graded && (
            <p className={`font-bold ${tone}`}>
              {graded.awarded >= 0 ? "+" : "−"}{fmt(Math.abs(graded.awarded))} / {fmt(graded.max)} marks
            </p>
          )}
        </div>
      </div>

      {type === "nat" ? (
        <div className="px-3 py-3 text-sm space-y-1 border-t">
          <p>Your answer: <b className={tone}>{answered ? String(response).trim() : "Not attempted"}</b></p>
          <p className="text-green-700">
            Correct answer: <b>{describeCorrect(q)}</b>
            {natRange(q)[0] !== natRange(q)[1] && <span className="text-gray-500"> (any value in this range)</span>}
          </p>
        </div>
      ) : (
        q.options.map((opt, oi) => {
          const isCorrect = right.includes(oi);
          const isMine = mine.includes(oi);
          return (
            <div
              key={oi}
              className={`px-3 py-2 border-t text-sm flex justify-between gap-3 ${isCorrect ? "bg-green-50 text-green-800" : isMine ? "bg-red-50 text-red-700" : ""}`}
            >
              <span className="flex gap-1.5 min-w-0"><span>{LETTERS[oi]}.</span><RichText>{opt}</RichText></span>
              <span className="text-xs font-semibold shrink-0">
                {isCorrect ? "Correct answer" : isMine ? "Your answer" : ""}
                {isCorrect && isMine ? " • Your answer" : ""}
              </span>
            </div>
          );
        })
      )}

      {!answered && type !== "nat" && <p className="px-3 py-2 border-t text-xs text-gray-500">Not attempted</p>}
      {type !== "nat" && answered && (
        <p className="px-3 py-2 border-t text-xs text-gray-500">
          Your answer: <b>{describeAnswer(q, response)}</b> · Correct: <b>{describeCorrect(q)}</b>
        </p>
      )}
      {q.explanation && (
        <div className="px-3 py-2 border-t text-sm bg-blue-50/50">
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700 mb-1">Explanation</p>
          <RichText>{q.explanation}</RichText>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
