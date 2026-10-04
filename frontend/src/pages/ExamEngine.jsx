import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useApi } from "../services/api/api";
import { getStoredUser } from "../services/useSeries";
import ExamHeader from "../components/Exam/ExamHeader";

const LETTERS = ["A", "B", "C", "D"];
const hasToken = () =>
  !!(localStorage.getItem("token") || sessionStorage.getItem("token"));
const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------- palette shapes (Testbook colours) ---------- */
const PAL = {
  notVisited: "bg-[#0000ff] text-white",
  notAnswered: "bg-[#ff0000] text-white",
  answered: "bg-[#008000] text-white",
  marked: "bg-[#ff0000] text-white",
  answeredMarked: "bg-[#ffff00] text-black",
};

const Pal = ({ status, children, current, onClick, small }) => (
  <button
    onClick={onClick}
    className={`relative ${small ? "h-[20px] w-[30px] text-[12px]" : "h-[24px] w-[44px] text-[13px]"} rounded-[3px] font-bold leading-none ${PAL[status]} ${
      current ? "outline outline-2 outline-black outline-offset-1" : ""
    } ${onClick ? "cursor-pointer" : "cursor-default"}`}
  >
    {children}
    {(status === "marked" || status === "answeredMarked") && (
      <span className="absolute left-1/2 -translate-x-1/2 top-full text-[9px] leading-[9px] text-black">▲</span>
    )}
  </button>
);

const Btn = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="bg-[#2360d8] hover:bg-[#1b4fb8] text-white text-[16px] px-[15px] py-[6px] rounded whitespace-nowrap disabled:opacity-50 cursor-pointer"
  >
    {children}
  </button>
);

const Num = ({ children }) => (
  <span className="text-[#f00] font-bold mx-1">{children}</span>
);

const YellowNum = ({ children }) => (
  <span className="bg-[#ffff00] text-[#f00] font-bold px-[5px]">{children}</span>
);

/* dark overlay dialog */
const Dialog = ({ width = 748, children }) => (
  <div className="fixed inset-0 z-50 bg-black/80">
    <div
      className="absolute left-1/2 -translate-x-1/2 top-[76px] bg-white rounded-sm shadow-lg max-w-[96vw] max-h-[88vh] overflow-y-auto"
      style={{ width }}
    >
      {children}
    </div>
  </div>
);

const CyanBtn = ({ children, onClick, plain }) => (
  <button
    onClick={onClick}
    className={`${plain ? "text-black px-3" : "bg-[#0aa0cc] hover:bg-[#088db5] text-white px-4"} py-[9px] rounded text-[16px] font-medium cursor-pointer`}
  >
    {children}
  </button>
);

const SummaryTable = ({ rows }) => (
  <table className="w-full border-collapse text-center text-[18px]">
    <thead>
      <tr className="bg-[#00b7cd] text-white">
        {["Section", "No. of questions", "Answered", "Not Answered", "Marked for Review", "Not Visited"].map((h) => (
          <th key={h} className="border border-[#00b7cd] py-5 px-2 font-bold">{h}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((r) => (
        <tr key={r.name}>
          <td className="border border-gray-300 py-3 px-2">{r.name}</td>
          <td className="border border-gray-300">{r.n}</td>
          <td className="border border-gray-300">{r.answered}</td>
          <td className="border border-gray-300">{r.notAnswered}</td>
          <td className="border border-gray-300">{r.marked}</td>
          <td className="border border-gray-300">{r.notVisited}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

const PopHead = ({ children }) => (
  <div className="bg-[#d7cbb1] px-2 py-1 text-[13px] font-bold text-[#333]">{children}</div>
);

export default function ExamEngine() {
  const { techId, level } = useParams();
  const navigate = useNavigate();
  const { request } = useApi();
  const user = getStoredUser();
  const storageKey = `techQuizExam:${techId}:${level}`;

  const [quiz, setQuiz] = useState(null);
  const [loadError, setLoadError] = useState("");

  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { qIdx: optionIdx }
  const [review, setReview] = useState({});
  const [visited, setVisited] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [zoom, setZoom] = useState(100);

  const [popover, setPopover] = useState(null); // symbols | instructions | summary
  const [dialog, setDialog] = useState(null); // pause | paused | submit | section | report
  const [panelOpen, setPanelOpen] = useState(() => window.innerWidth >= 1024);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDone, setReportDone] = useState(false);

  const [result, setResult] = useState(null);
  const [showReview, setShowReview] = useState(false);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | guest | error

  const submittingRef = useRef(false);

  /* ---------- LOAD REAL QUIZ DATA ---------- */
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await request("/user/quizzes");
        const found = data.find(
          (q) =>
            q.technology?.toLowerCase() === techId &&
            q.level?.toLowerCase() === level.toLowerCase(),
        );
        if (!active) return;
        if (!found) return setLoadError("This test was not found.");

        const questions = found.questions.map((q) => ({
          text: q.question,
          options: q.options,
          correct: LETTERS.indexOf(String(q.answerKey).toUpperCase()),
        }));
        const total = (found.timeLimit || 0) * 60;

        let saved = null;
        try {
          saved = JSON.parse(localStorage.getItem(storageKey));
        } catch {
          saved = null;
        }

        setQuiz({ questions, total, level: found.level });
        if (saved) {
          setAnswers(saved.answers || {});
          setReview(saved.review || {});
          setVisited(saved.visited || {});
          setQIndex(saved.qIndex || 0);
          setTimeLeft(saved.timeLeft ?? total);
          if (saved.isPaused) {
            setIsPaused(true);
            setDialog("paused");
          }
        } else {
          setTimeLeft(total);
        }
      } catch {
        if (active) setLoadError("Could not load the test. Please try again.");
      }
    })();
    return () => {
      active = false;
    };
  }, [request, techId, level, storageKey]);

  /* ---------- SAVE PROGRESS (resume support) ---------- */
  useEffect(() => {
    if (!quiz || result) return;
    localStorage.setItem(
      storageKey,
      JSON.stringify({ answers, review, visited, qIndex, timeLeft, isPaused }),
    );
  }, [quiz, result, answers, review, visited, qIndex, timeLeft, isPaused, storageKey]);

  /* ---------- VISITED ---------- */
  useEffect(() => {
    if (quiz) setVisited((v) => ({ ...v, [qIndex]: true }));
  }, [quiz, qIndex]);

  /* ---------- FULLSCREEN STATE ---------- */
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };

  /* ---------- SUBMIT ---------- */
  const submit = useCallback(async () => {
    if (!quiz || submittingRef.current) return;
    submittingRef.current = true;
    setDialog(null);
    setPopover(null);
    if (document.fullscreenElement) document.exitFullscreen?.();

    let correct = 0;
    let wrong = 0;
    quiz.questions.forEach((q, i) => {
      if (answers[i] === undefined) return;
      if (answers[i] === q.correct) correct++;
      else wrong++;
    });
    const total = quiz.questions.length;
    const timeTaken = Math.max(0, quiz.total - timeLeft);

    setResult({ correct, wrong, unattempted: total - correct - wrong, total, timeTaken });
    localStorage.removeItem(storageKey);

    if (hasToken()) {
      setSaveState("saving");
      try {
        await request("/result/save-result", "POST", {
          technology: techId,
          level: quiz.level,
          totalQuestions: total,
          correct,
          wrong,
          timeTaken,
          startDate: new Date(Date.now() - timeTaken * 1000),
        });
        setSaveState("saved");
      } catch {
        setSaveState("error");
      }
    } else {
      setSaveState("guest");
    }
  }, [quiz, answers, timeLeft, request, techId, storageKey]);

  /* ---------- TIMER (timestamp based, so it stays accurate) ---------- */
  const timeLeftRef = useRef(0);
  useEffect(() => {
    timeLeftRef.current = timeLeft;
  }, [timeLeft]);

  useEffect(() => {
    if (!quiz || result || isPaused) return;
    const endAt = Date.now() + timeLeftRef.current * 1000;
    const tick = () =>
      setTimeLeft(Math.max(0, Math.ceil((endAt - Date.now()) / 1000)));
    const t = setInterval(tick, 250);
    return () => clearInterval(t);
  }, [quiz, result, isPaused]);

  useEffect(() => {
    if (quiz && !result && timeLeft <= 0 && quiz.total > 0) submit();
  }, [timeLeft, quiz, result, submit]);

  // warn before accidentally leaving a running test
  useEffect(() => {
    if (!quiz || result) return;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [quiz, result]);

  /* ---------- HELPERS ---------- */
  const counts = useMemo(() => {
    if (!quiz) return {};
    const n = quiz.questions.length;
    let answered = 0, marked = 0, notAnswered = 0, notVisited = 0;
    for (let i = 0; i < n; i++) {
      const ans = answers[i] !== undefined;
      if (ans) answered++;
      if (review[i]) marked++;
      if (!visited[i]) notVisited++;
      else if (!ans) notAnswered++;
    }
    return { n, answered, marked, notAnswered, notVisited };
  }, [quiz, answers, review, visited]);

  const statusOf = (i) => {
    const ans = answers[i] !== undefined;
    if (review[i] && ans) return "answeredMarked";
    if (review[i]) return "marked";
    if (ans) return "answered";
    // like Testbook: the question you are on stays blue until you move away
    if (visited[i] && i !== qIndex) return "notAnswered";
    return "notVisited";
  };

  const goNext = () => setQIndex((i) => Math.min(i + 1, quiz.questions.length - 1));
  const saveAndNext = () => goNext();

  const toggleReview = () => {
    if (review[qIndex]) {
      setReview((r) => ({ ...r, [qIndex]: false }));
    } else {
      setReview((r) => ({ ...r, [qIndex]: true }));
      goNext();
    }
  };

  // clicking the chosen option again removes it (as Testbook does)
  const chooseOption = (i) =>
    setAnswers((a) => {
      if (a[qIndex] === i) {
        const c = { ...a };
        delete c[qIndex];
        return c;
      }
      return { ...a, [qIndex]: i };
    });

  const retake = () => {
    localStorage.removeItem(storageKey);
    window.location.reload();
  };

  const submitReport = () => {
    try {
      const all = JSON.parse(localStorage.getItem("techQuizReports") || "[]");
      all.push({ techId, level, question: qIndex + 1, reason: reportReason, at: Date.now() });
      localStorage.setItem("techQuizReports", JSON.stringify(all));
    } catch {
      /* ignore */
    }
    setReportDone(true);
  };

  /* ================= STATES ================= */
  if (loadError) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-red-600">{loadError}</p>
        <button onClick={() => navigate("/test-series")} className="bg-blue-500 text-white px-5 py-2 rounded cursor-pointer">
          Go to Tests
        </button>
      </div>
    );
  }
  if (!quiz) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading test...</div>;
  }

  const title = `${cap(techId)} Test Series - ${cap(quiz.level)}`;
  const sectionName = `${cap(techId)} - ${cap(quiz.level)}`;
  // stable 12-digit roll number derived from the logged-in user (like Testbook)
  const rollSeed = user?._id || user?.id || user?.email || user?.name || "";
  let h = 7;
  for (let i = 0; i < rollSeed.length; i++) h = (h * 131 + rollSeed.charCodeAt(i)) % 900000000000;
  const rollNo = rollSeed ? String(h + 100000000000).slice(0, 12) : "GUEST";

  /* ================= RESULT ================= */
  if (result) {
    const pct = result.total ? Math.round((result.correct / result.total) * 100) : 0;
    const mins = Math.floor(result.timeTaken / 60);
    const secs = result.timeTaken % 60;
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto bg-white border rounded shadow-sm p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800">{title}</h1>
          <p className="text-center text-green-600 font-semibold mt-1">Test Submitted Successfully ✅</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 text-center">
            <div className="bg-green-50 rounded p-4"><p className="text-xs text-gray-600">Score</p><p className="text-xl font-bold">{result.correct}/{result.total}</p></div>
            <div className="bg-blue-50 rounded p-4"><p className="text-xs text-gray-600">Accuracy</p><p className="text-xl font-bold">{pct}%</p></div>
            <div className="bg-yellow-50 rounded p-4"><p className="text-xs text-gray-600">Correct / Wrong</p><p className="text-xl font-bold">{result.correct} / {result.wrong}</p></div>
            <div className="bg-purple-50 rounded p-4"><p className="text-xs text-gray-600">Time Taken</p><p className="text-xl font-bold">{mins}m {secs}s</p></div>
          </div>
          <p className="text-center text-sm text-gray-500 mt-3">Unattempted: {result.unattempted}</p>

          <p className="text-center text-sm mt-3">
            {saveState === "saving" && <span className="text-gray-500">Saving result...</span>}
            {saveState === "saved" && <span className="text-green-600">Result saved to My Results.</span>}
            {saveState === "guest" && <span className="text-orange-600">You are not logged in, so this result was not saved.</span>}
            {saveState === "error" && <span className="text-red-600">Could not save the result. Please check your connection.</span>}
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <button onClick={() => setShowReview((s) => !s)} className="bg-blue-600 text-white px-5 py-2 rounded cursor-pointer">
              {showReview ? "Hide Solutions" : "Review Solutions"}
            </button>
            <button onClick={retake} className="bg-cyan-500 text-white px-5 py-2 rounded cursor-pointer">Retake Test</button>
            {hasToken() && <button onClick={() => navigate("/result")} className="border border-blue-600 text-blue-600 px-5 py-2 rounded cursor-pointer">My Results</button>}
            <button onClick={() => navigate("/test-series")} className="border px-5 py-2 rounded cursor-pointer">Back to Test Series</button>
          </div>

          {showReview && (
            <div className="mt-8 space-y-4">
              {quiz.questions.map((q, i) => {
                const mine = answers[i];
                return (
                  <div key={i} className="border rounded">
                    <div className="border-b px-3 py-2 font-medium bg-gray-50">Q{i + 1}. {q.text}</div>
                    {q.options.map((opt, oi) => {
                      const isCorrect = oi === q.correct;
                      const isMine = oi === mine;
                      return (
                        <div key={oi} className={`px-3 py-2 border-t text-sm flex justify-between ${isCorrect ? "bg-green-50 text-green-800" : isMine ? "bg-red-50 text-red-700" : ""}`}>
                          <span>{LETTERS[oi]}. {opt}</span>
                          <span className="text-xs font-semibold">
                            {isCorrect ? "Correct answer" : isMine ? "Your answer" : ""}
                            {isCorrect && isMine ? " • Your answer" : ""}
                          </span>
                        </div>
                      );
                    })}
                    {mine === undefined && <p className="px-3 py-2 border-t text-xs text-gray-500">Not attempted</p>}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  /* ================= EXAM UI ================= */
  const q = quiz.questions[qIndex];
  const summaryRows = [
    { name: sectionName, n: counts.n, answered: counts.answered, notAnswered: counts.notAnswered, marked: counts.marked, notVisited: counts.notVisited },
  ];

  return (
    <div className="h-screen flex flex-col bg-white font-[Arial,Helvetica,sans-serif] text-[#222] select-none overflow-hidden">
      <ExamHeader
        title={title}
        rollNo={rollNo}
        timeLeft={timeLeft}
        onZoomIn={() => setZoom((z) => Math.min(z + 10, 150))}
        onZoomOut={() => setZoom((z) => Math.max(z - 10, 80))}
        onPause={() => setDialog(isPaused ? "paused" : "pause")}
        onFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />

      <div className="flex flex-1 min-h-0">
        {/* ============ LEFT ============ */}
        <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
          <div className="relative shrink-0">
            {/* links row */}
            <div className="flex items-center justify-between px-5 pt-[14px]">
              <div className="flex gap-5 text-[14px] font-semibold uppercase">
                <button onClick={() => setPopover(popover === "symbols" ? null : "symbols")} className="text-[#1e88b5] underline cursor-pointer uppercase">Symbols</button>
                <button onClick={() => setPopover(popover === "instructions" ? null : "instructions")} className="text-[#f0623c] underline cursor-pointer uppercase">Instructions</button>
                <button onClick={() => setPopover(popover === "summary" ? null : "summary")} className="text-[#a52a1a] underline cursor-pointer uppercase">Overall Test Summary</button>
              </div>
              <div className="text-[18px] font-bold whitespace-nowrap">
                Total Questions Answered: <YellowNum>{counts.answered}</YellowNum>
              </div>
            </div>

            {/* part tabs + actions */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 pt-3">
              <span className="bg-[#008000] text-white font-bold tracking-wider text-[16px] px-[8px] py-[4px] rounded">PART-A</span>
              <div className="flex flex-wrap items-center gap-[15px] lg:ml-[270px]">
                {qIndex > 0 && <Btn onClick={() => setQIndex((i) => Math.max(i - 1, 0))}>Previous</Btn>}
                <Btn onClick={toggleReview}>{review[qIndex] ? "Unmark Review" : "Mark for Review"}</Btn>
                <Btn onClick={saveAndNext}>Save &amp; Next</Btn>
                <Btn onClick={() => setDialog("section")}>Submit Section</Btn>
                <Btn onClick={() => setDialog("submit")}>Submit Test</Btn>
              </div>
            </div>

            {/* popovers */}
            {popover && <div className="fixed inset-0 z-30" onClick={() => setPopover(null)} />}

            {popover === "symbols" && (
              <div className="absolute z-40 left-5 top-[78px] w-[min(940px,94vw)] bg-white border border-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.45)] max-h-[70vh] overflow-y-auto">
                <table className="w-full text-[12px] font-bold text-[#1f1fbf]">
                  <thead>
                    <tr className="bg-[#d7cbb1] text-black">
                      <th className="py-1 w-[165px]">Symbol</th>
                      <th className="py-1">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      [<input key="a" type="radio" disabled />, "Option Not chosen"],
                      [<input key="b" type="radio" checked readOnly />, "Option chosen as correct (By clicking on it again you can delete your option and choose another option if desired.)"],
                      [<Pal key="c" status="notVisited" small>12</Pal>, "Question number shown in blue color indicates that you have not yet attempted the question."],
                      [<Pal key="d" status="answered" small>13</Pal>, "Question number shown in green color indicates that you have answered the question."],
                      [<span key="e" className="inline-block mb-2"><Pal status="marked" small>14</Pal></span>, "You have not yet answered the question, but marked it for coming back for review later, if time permits."],
                      [<span key="f" className="inline-block mb-2"><Pal status="answeredMarked" small>15</Pal></span>, "You have answered the question, but marked it for review later, if time permits."],
                      [<span key="g" className="bg-[#2360d8] text-white px-6 py-1 rounded">Save &amp; Next</span>, "Clicking on this will take you to the next question."],
                      [<span key="h" className="bg-[#2360d8] text-white px-8 py-1 rounded">Previous</span>, "Clicking on this will take you to the previous question."],
                      [<span key="i" className="bg-[#2360d8] text-white px-3 py-1 rounded">Mark for Review</span>, "By clicking on this button, you can mark the question for review later. Please note that if you answer the question and mark for review, the question will be treated as answered and evaluated even if you do not review it."],
                      [<span key="j" className="bg-[#e6ddc6] text-black px-4 py-1 border border-gray-300">Unmark Review</span>, "By clicking on this button, you can unmark the question for review"],
                    ].map(([sym, desc], i) => (
                      <tr key={i} className="border-t border-[#d7cbb1]">
                        <td className="py-2 text-center">{sym}</td>
                        <td className="py-2 pr-3">{desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {popover === "instructions" && (
              <div className="absolute z-40 left-5 top-[78px] w-[min(760px,94vw)] bg-white border border-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.45)] max-h-[70vh] overflow-y-auto">
                <PopHead>Instructions</PopHead>
                <ol className="list-decimal ml-8 mr-4 my-3 space-y-2 text-[13px]">
                  <li>The test has {counts.n} questions. Each has 4 options and only one is correct.</li>
                  <li>Click an option to choose it. Click it again to remove your choice.</li>
                  <li>Click <b>Save &amp; Next</b> to go to the next question.</li>
                  <li>Click <b>Mark for Review</b> to come back to a question later. If it is answered, it is still evaluated.</li>
                  <li>Click a question number in the palette to jump to that question.</li>
                  <li>1 mark for each correct answer. There is no negative marking.</li>
                  <li>Use the pause button to pause the timer. The test is submitted automatically when time is over.</li>
                </ol>
              </div>
            )}

            {popover === "summary" && (
              <div className="absolute z-40 left-[200px] top-[78px] w-[min(815px,94vw)] bg-white border border-gray-400 shadow-[0_2px_10px_rgba(0,0,0,0.45)] p-[50px] pt-[28px]">
                <div className="border border-gray-300">
                  <PopHead>Test Summary</PopHead>
                  <div className="py-3 text-center text-[19px] space-y-3">
                    <p>You have answered <Num>{counts.answered}</Num> questions out of <Num>{counts.n}</Num> questions.</p>
                    <p>You have not answered <Num>{counts.n - counts.answered}</Num> questions out of <Num>{counts.n}</Num> questions.</p>
                    <p>You have marked for review <Num>{counts.marked}</Num> questions out of <Num>{counts.n}</Num> questions.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-5 pt-[30px] pb-2 text-[16px] font-bold">Question No. {qIndex + 1}</div>

          {/* question box */}
          <div className="mx-5 mb-5 border border-[#e2e2e2] flex-1 min-h-[420px]" style={{ zoom: zoom / 100 }}>
            <div className="flex items-center justify-end gap-6 px-[22px] pt-[8px] pb-[6px] text-[14px]">
              <label className="flex items-center gap-1 font-bold">
                Select Language
                <select disabled className="ml-1 border border-gray-300 rounded text-gray-400 font-normal text-[17px] px-1.5 py-[3px] bg-white">
                  <option>English</option>
                </select>
              </label>
              <button
                onClick={() => {
                  setReportDone(false);
                  setReportReason("");
                  setDialog("report");
                }}
                className="flex items-center gap-1.5 text-gray-700 cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#555"><path d="M12 2 1 21h22L12 2zm1 15h-2v-2h2v2zm0-4h-2V9h2v4z" /></svg>
                Report
              </button>
            </div>

            <div className="mx-[20px] mb-5 border border-[#e2e2e2]">
              <div className="px-[20px] py-[10px] text-[20px] text-[#222] whitespace-pre-line border-b border-[#e2e2e2]">
                {q.text}
              </div>
              {q.options.map((opt, i) => (
                <div
                  key={i}
                  onClick={() => chooseOption(i)}
                  className="flex items-stretch border-b border-[#e2e2e2] last:border-b-0 cursor-pointer hover:bg-gray-50"
                >
                  <div className="w-[56px] shrink-0 border-r border-[#e2e2e2] flex items-center justify-center">
                    <input type="radio" name={`q-${qIndex}`} checked={answers[qIndex] === i} readOnly className="w-[15px] h-[15px] cursor-pointer" />
                  </div>
                  <div className="px-5 py-[22px] text-[20px]">{opt}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ============ RIGHT PANEL ============ */}
        {panelOpen ? (
          <aside className="w-[375px] max-w-[85vw] shrink-0 overflow-y-auto pb-10 max-lg:absolute max-lg:right-0 max-lg:top-[120px] max-lg:bottom-0 max-lg:bg-white max-lg:shadow-xl max-lg:z-30">
            <div className="flex items-center gap-4 mt-[55px] px-[26px]">
              <button onClick={() => setPanelOpen(false)} aria-label="Collapse panel" className="cursor-pointer">
                <svg width="18" height="26" viewBox="0 0 18 26"><path d="M1 1l16 12L1 25z" fill="#1e9ac0" /></svg>
              </button>
              <div className="text-[18px] font-bold leading-6">{sectionName}</div>
            </div>

            <div className="grid grid-cols-6 gap-y-[26px] px-[6px] mt-[36px] justify-items-center">
              {quiz.questions.map((_, i) => (
                <Pal key={i} status={statusOf(i)} current={i === qIndex} onClick={() => setQIndex(i)}>
                  {i + 1}
                </Pal>
              ))}
            </div>

            <table className="mt-[34px] w-full border-collapse text-[16px]">
              <thead>
                <tr>
                  <th colSpan={2} className="bg-[#bdbdbd] border border-black py-1 text-[18px] font-bold">
                    PART-A Analysis
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Answered", counts.answered],
                  ["Not Answered", counts.n - counts.answered],
                  ["Mark for Review", counts.marked],
                ].map(([label, val]) => (
                  <tr key={label}>
                    <td className="border border-black px-[9px] py-[3px]">{label}</td>
                    <td className="border border-black w-[58px] text-center">
                      <YellowNum>{val}</YellowNum>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </aside>
        ) : (
          <button
            onClick={() => setPanelOpen(true)}
            aria-label="Open panel"
            className="fixed right-0 top-[236px] z-20 cursor-pointer"
          >
            <svg width="20" height="26" viewBox="0 0 20 26"><path d="M19 1L3 13l16 12z" fill="#1e9ac0" /></svg>
          </button>
        )}
      </div>

      {/* ============ DIALOGS ============ */}
      {dialog === "pause" && (
        <Dialog>
          <div className="px-5 py-[18px] text-[17px] border-b border-gray-200">
            Are you sure you want to pause the test?
          </div>
          <div className="px-5 py-3 flex justify-end items-center gap-3">
            <CyanBtn plain onClick={() => setDialog(null)}>No</CyanBtn>
            <CyanBtn
              onClick={() => {
                setIsPaused(true);
                setDialog("paused");
              }}
            >
              Yes
            </CyanBtn>
          </div>
        </Dialog>
      )}

      {dialog === "paused" && (
        <Dialog width={1123}>
          <div className="p-5">
            <SummaryTable rows={summaryRows} />
          </div>
          <div className="px-5 py-2 border-t border-gray-200 flex justify-between items-center">
            <CyanBtn onClick={() => navigate("/test-series")}>Tests</CyanBtn>
            <CyanBtn
              onClick={() => {
                setIsPaused(false);
                setDialog(null);
              }}
            >
              Resume Test
            </CyanBtn>
          </div>
        </Dialog>
      )}

      {(dialog === "submit" || dialog === "section") && (
        <Dialog width={1000}>
          <div className="px-5 py-[18px] text-[17px] border-b border-gray-200">
            {dialog === "section"
              ? "Are you sure you want to submit this section? This is the last section, so your test will be submitted."
              : "Are you sure you want to submit the test?"}
          </div>
          <div className="p-5">
            <SummaryTable rows={summaryRows} />
          </div>
          <div className="px-5 py-3 border-t border-gray-200 flex justify-end items-center gap-3">
            <CyanBtn plain onClick={() => setDialog(null)}>No</CyanBtn>
            <CyanBtn onClick={submit}>Yes</CyanBtn>
          </div>
        </Dialog>
      )}

      {dialog === "report" && (
        <Dialog width={520}>
          <div className="px-5 py-[16px] text-[17px] font-semibold border-b border-gray-200">
            Report Question No. {qIndex + 1}
          </div>
          <div className="p-5 text-[15px]">
            {reportDone ? (
              <p className="text-green-700">Thank you! Your report has been recorded.</p>
            ) : (
              <div className="space-y-2">
                {["Question is incorrect", "Options are incorrect", "Correct answer seems wrong", "Other issue"].map((r) => (
                  <label key={r} className="flex items-center gap-2 cursor-pointer">
                    <input type="radio" name="report" checked={reportReason === r} onChange={() => setReportReason(r)} />
                    {r}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="px-5 py-3 border-t border-gray-200 flex justify-end gap-3">
            <CyanBtn plain onClick={() => setDialog(null)}>{reportDone ? "Close" : "Cancel"}</CyanBtn>
            {!reportDone && (
              <button
                onClick={submitReport}
                disabled={!reportReason}
                className="bg-[#0aa0cc] text-white px-4 py-[9px] rounded disabled:opacity-40 cursor-pointer"
              >
                Submit
              </button>
            )}
          </div>
        </Dialog>
      )}
    </div>
  );
}
