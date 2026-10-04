import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSeries, { getStoredUser } from "../services/useSeries";
import FlowHeader from "../components/Exam/FlowHeader";

// Same colours the real exam engine's question palette uses, so the
// legend here matches exactly what the candidate sees during the test.
const Swatch = ({ style, children }) => (
  <span
    className="inline-flex items-center justify-center w-7 h-6 text-xs font-bold rounded-sm shrink-0"
    style={style}
  >
    {children}
  </span>
);

const symbols = [
  {
    swatch: <Swatch style={{ background: "#fff", border: "1px solid #999" }} />,
    text: "You have not visited the question yet.",
  },
  {
    swatch: <Swatch style={{ background: "#ff0000", color: "#fff" }}>12</Swatch>,
    text: "You have not answered the question.",
  },
  {
    swatch: <Swatch style={{ background: "#008000", color: "#fff" }}>13</Swatch>,
    text: "You have answered the question.",
  },
  {
    swatch: <Swatch style={{ background: "#ff0000", color: "#fff" }}>14</Swatch>,
    text: "You have NOT answered the question, but marked it for review.",
  },
  {
    swatch: <Swatch style={{ background: "#ffff00", color: "#000" }}>15</Swatch>,
    text: "You have answered the question, but marked it for review.",
  },
];

const SeriesInstructions = () => {
  const { techId } = useParams();
  const navigate = useNavigate();
  const { series, isLoading, error } = useSeries(techId);
  const user = getStoredUser();
  const name = user?.name || user?.email || "Guest";
  const title = series ? `${series.name} Test Series` : "";

  return (
    <div className="h-screen flex flex-col bg-white">
      <FlowHeader title={title || "Loading..."} />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <p className="p-6 text-gray-500">Loading instructions...</p>
          )}
          {!isLoading && (error || !series) && (
            <p className="p-6 text-red-600">
              {error || "This test series was not found."}
            </p>
          )}

          {!isLoading && series && (
            <div className="p-6 md:p-8 text-[15px] text-gray-800 leading-relaxed max-w-4xl">
              <h2 className="font-bold text-lg mb-3">General Instructions:</h2>

              <ol className="list-decimal ml-6 space-y-4">
                <li>
                  The countdown timer at the top of the quiz screen shows the
                  time remaining. When it reaches zero, the test is submitted
                  automatically. You do not need to submit it yourself.
                </li>
                <li>
                  The Question Palette on the side shows the status of each
                  question using one of the following symbols:
                  <div className="mt-3 space-y-2.5">
                    {symbols.map((s, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {s.swatch}
                        <span>{s.text}</span>
                      </div>
                    ))}
                  </div>
                </li>
              </ol>

              <p className="mt-5">
                The <b>Mark for Review</b> status simply means you&apos;d like
                to look at that question again. If a question is answered but
                marked for review, the answer is still counted in your score
                unless you change it.
              </p>

              <h2 className="font-bold text-lg mt-7 mb-1">
                Navigating to a Question:
              </h2>
              <ol className="list-decimal ml-6 space-y-4" start={3}>
                <li>
                  To answer a question, do the following:
                  <ol className="list-decimal ml-6 mt-2 space-y-1.5">
                    <li>
                      Click a question number in the palette to go to that
                      question directly.
                    </li>
                    <li>
                      Click <b>Save &amp; Next</b> to save your answer and
                      move to the next question.
                    </li>
                    <li>
                      Click <b>Mark for Review &amp; Next</b> to save your
                      answer, mark it for review, and move on.
                    </li>
                  </ol>
                </li>
              </ol>

              <h2 className="font-bold text-lg mt-7 mb-1">
                Answering a Question:
              </h2>
              <ol className="list-decimal ml-6 space-y-4" start={4}>
                <li>
                  Choose one answer from the 4 options (A, B, C, D) by
                  clicking the bubble before it. Click it again, or use{" "}
                  <b>Clear Response</b>, to deselect it.
                </li>
                <li>
                  To change your answer, just click another option &mdash;
                  you don&apos;t need to clear it first.
                </li>
                <li>
                  Only questions you&apos;ve saved (with or without
                  &quot;marked for review&quot;) are counted in your score.
                </li>
                <li>
                  Once you submit, your result is saved automatically to{" "}
                  <b>My Results</b> if you&apos;re logged in.
                </li>
              </ol>
            </div>
          )}
        </div>

        <div className="hidden sm:flex w-64 border-l border-gray-200 flex-col items-center pt-12 shrink-0">
          <div className="w-28 h-28 rounded-full bg-[#16A34A] text-white text-4xl font-bold flex items-center justify-center uppercase border">
            {name.charAt(0)}
          </div>
          <p className="mt-4 font-semibold text-gray-800 px-4 text-center break-all">
            {name}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-3 flex justify-between items-center bg-white">
        <button
          onClick={() => navigate("/test-series")}
          className="text-base font-semibold text-blue-600 hover:text-blue-800 px-2 py-2 cursor-pointer"
        >
          ← Go to Tests
        </button>
        <button
          disabled={!series}
          onClick={() => navigate(`/test-series/${techId}/start`)}
          className="text-base font-semibold bg-blue-500 text-white px-8 py-2.5 rounded hover:bg-blue-600 transition-all disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default SeriesInstructions;
