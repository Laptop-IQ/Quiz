import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useSeries, { getStoredUser } from "../services/useSeries";
import FlowHeader from "../components/Exam/FlowHeader";

const declaration =
  "I have read all the instructions carefully and have understood them. I agree not to cheat or use unfair means in this test. I understand that using unfair means of any sort for my own or someone else's advantage will lead to my immediate disqualification. The decision of Tech Quiz Master will be final in these matters and cannot be appealed.";

const SeriesStart = () => {
  const { techId } = useParams();
  const navigate = useNavigate();
  const { series, isLoading, error } = useSeries(techId);
  const user = getStoredUser();
  const name = user?.name || user?.email || "Guest";

  const [levelId, setLevelId] = useState("");
  const [checked, setChecked] = useState(false);

  // default to the first level until the user picks one
  const activeLevel = levelId || series?.levels[0]?.level || "";
  const current = series?.levels.find((l) => l.level === activeLevel);

  const begin = () => {
    if (!checked || !current) return;
    navigate(`/exam/${techId}/${current.level.toLowerCase()}`);
  };

  const title = series
    ? `${series.name} Test Series${current ? ` - ${current.level.charAt(0).toUpperCase() + current.level.slice(1)}` : ""}`
    : "";

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <FlowHeader title={title || "Loading..."} />

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          {isLoading && <p className="p-6 text-gray-500">Loading...</p>}
          {!isLoading && (error || !series) && (
            <p className="p-6 text-red-600">
              {error || "This test series was not found."}
            </p>
          )}

          {!isLoading && series && current && (
            <div className="max-w-4xl mx-auto border border-gray-200 my-1">
              <div className="bg-white border-b border-gray-200 p-6">
                <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
                  {title}
                </h1>

                <div className="flex justify-between text-base mb-5 text-gray-800 font-semibold">
                  <span>
                    Duration:{" "}
                    {current.timeLimit ? `${current.timeLimit} Mins` : "No limit"}
                  </span>
                  <span>Maximum Marks: {current.questionCount}</span>
                </div>

                <p className="font-bold text-base mb-3 text-gray-800">
                  Read the following instructions carefully.
                </p>

                <ol className="list-decimal ml-8 space-y-2 text-[15px] text-gray-700">
                  <li>The test contains {current.questionCount} total questions.</li>
                  <li>
                    Each question has 4 options out of which only one is correct.
                  </li>
                  {current.timeLimit > 0 && (
                    <li>
                      You have to finish the test in {current.timeLimit} minutes.
                    </li>
                  )}
                  <li>You will be awarded 1 mark for each correct answer.</li>
                  <li>
                    There is no negative marking for wrong or unattempted
                    questions.
                  </li>
                </ol>
              </div>

              <div className="bg-white p-6 space-y-6">
                <div>
                  <label className="text-base font-bold text-gray-800 block mb-3">
                    Choose your level:{" "}
                    <select
                      value={activeLevel}
                      onChange={(e) => setLevelId(e.target.value)}
                      className="border border-gray-300 px-2 py-1 text-base rounded hover:border-gray-400 capitalize font-normal"
                    >
                      {series.levels.map((l) => (
                        <option key={l.level} value={l.level}>
                          {l.level}
                        </option>
                      ))}
                    </select>
                  </label>
                  <p className="text-red-600 text-sm mt-3">
                    Please note the level cannot be changed once the test has
                    started.
                  </p>
                </div>

                <div>
                  <p className="font-bold text-base text-black mb-1">
                    Declaration:
                  </p>
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 w-4 h-4 cursor-pointer flex-shrink-0"
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                    />
                    <p className="text-base text-gray-800 leading-relaxed">
                      {declaration}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="hidden md:flex w-64 border-l border-gray-200 bg-white flex-col items-center pt-12">
          <div className="w-28 h-28 rounded-full bg-[#16A34A] text-white text-4xl font-bold flex items-center justify-center uppercase border">
            {name.charAt(0)}
          </div>
          <p className="mt-6 text-xl font-bold text-gray-800 break-all text-center">
            {name}
          </p>
        </div>
      </div>

      <div className="flex items-center px-8 py-4 border-t border-gray-200 bg-white">
        <button
          onClick={() => navigate(`/test-series/${techId}`)}
          className="px-6 py-2.5 bg-blue-400 text-white font-semibold rounded hover:bg-blue-500 transition-all cursor-pointer"
        >
          Previous
        </button>
        <div className="flex-1 flex justify-center">
          <button
            onClick={begin}
            disabled={!checked || !current}
            className={`px-8 py-2.5 text-white font-semibold rounded transition-all ${
              checked && current
                ? "bg-cyan-500 hover:bg-cyan-600 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed opacity-60"
            }`}
          >
            I am ready to begin
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeriesStart;
