import { useEffect, useRef, useState } from "react";
import { useApi } from "../services/api/api.js";
import { dashboardStyles } from "../assets/dummyStyles";
import {
  AlertCircle,
  BarChart,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Upload,
  Users,
  ChevronRight,
  XCircle,
} from "lucide-react";

const DashboardPage = () => {
  const [technology, setTechnology] = useState("");
  const [level, setLevel] = useState("Basic");
  const [timeLimit, setTimeLimit] = useState(30);
  const [questions, setQuestions] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [toast, setToast] = useState({
    show: false,
    type: "success",
    message: "",
  });
  const [showPreview, setShowPreview] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const fileInputRef = useRef(null);

  const levels = [
    { value: "Basic", bg: "bg-green-100", color: "text-green-600" },
    { value: "Intermediate", bg: "bg-yellow-100", color: "text-yellow-600" },
    { value: "Advanced", bg: "bg-red-100", color: "text-red-600" },
  ];

  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalLoggedIn: 0,
    loggedInPercentage: 0,
  });

  const { request } = useApi();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await request("/admin/stats");
        console.log("ADMIN STATS:", data);
        setAdminStats({
          totalUsers: data.totalUsers || 0,
          totalLoggedIn: data.loggedInUsers || 0,
          loggedInPercentage: data.loggedInPercentage || 0,
        });
      } catch (err) {
        console.log("Stats error:", err);
      }
    };

    loadStats();
  }, [request]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const letterForIndex = (index) => ["A", "B", "C", "D"][index] || "";

  const parseCSVText = (csvText) => {
    const rows = [];
    let row = [];
    let cell = "";
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
      const char = csvText[i];
      const nextChar = csvText[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          cell += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === "," && !inQuotes) {
        row.push(cell.trim());
        cell = "";
      } else if ((char === "\n" || char === "\r") && !inQuotes) {
        if (char === "\r" && nextChar === "\n") i++;
        row.push(cell.trim());
        if (row.some((c) => c !== "")) {
          rows.push(row);
        }
        row = [];
        cell = "";
      } else {
        cell += char;
      }
    }

    if (cell.length > 0 || row.length > 0) {
      row.push(cell.trim());
      if (row.some((c) => c !== "")) {
        rows.push(row);
      }
    }

    return rows;
  };

  const validateForm = () => {
    const errors = {};

    if (!technology.trim()) {
      errors.technology = "Technology name is required";
    }

    if (!level) {
      errors.level = "Level is required";
    }

    if (!timeLimit || timeLimit < 1) {
      errors.timeLimit = "Time limit must be at least 1 minute";
    }

    if (questions.length === 0) {
      errors.questions = "Please upload CSV with questions";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type === "text/csv") {
      processCSVFile(file);
    } else {
      setToast({
        show: true,
        type: "error",
        message: "Please upload a valid CSV file",
      });
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      processCSVFile(file);
    }
  };

  const processCSVFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      processCSVText(text);
    };
    reader.readAsText(file);
  };

  const processCSVText = (csvText) => {
    if (!csvText) return;

    const rows = parseCSVText(csvText);
    if (rows.length === 0) {
      setToast({
        show: true,
        type: "error",
        message: "Uploaded CSV is empty or invalid",
      });
      return;
    }

    const header = rows[0].map((c) => c.toLowerCase());
    let startIdx = 0;

    const hasQuestionHeader = header.some(
      (h) => h.includes("question") || h.includes("q."),
    );
    const hasAnswerHeader = header.some(
      (h) => h.includes("answer") || h.includes("correct"),
    );
    const hasOptionsHeader = header.some(
      (h) => h.includes("option") || h.includes("choice"),
    );

    if (hasQuestionHeader && (hasAnswerHeader || hasOptionsHeader)) {
      startIdx = 1;
    }

    const parsedQuestions = [];

    for (let i = startIdx; i < rows.length; i++) {
      const row = rows[i];

      if (row.length === 0 || row.every((cell) => !cell.trim())) {
        continue;
      }

      const paddedRow = [...row];
      while (paddedRow.length < 6) {
        paddedRow.push("");
      }

      const question = paddedRow[0] || "";
      const options = [
        paddedRow[1] || "",
        paddedRow[2] || "",
        paddedRow[3] || "",
        paddedRow[4] || "",
      ];
      const answerRaw = (paddedRow[5] || "").trim().toUpperCase();

      let answerKey = "";
      let answerText = "";
      let foundAnswer = false;

      if (["A", "B", "C", "D"].includes(answerRaw)) {
        answerKey = answerRaw;
        const idx = ["A", "B", "C", "D"].indexOf(answerRaw);
        answerText = options[idx] || answerRaw;
        foundAnswer = true;
      }

      if (!foundAnswer && ["1", "2", "3", "4"].includes(answerRaw)) {
        const idx = parseInt(answerRaw, 10) - 1;
        answerKey = ["A", "B", "C", "D"][idx];
        answerText = options[idx] || answerRaw;
        foundAnswer = true;
      }

      if (!foundAnswer) {
        for (let j = 0; j < options.length; j++) {
          if (options[j].trim().toLowerCase() === answerRaw.toLowerCase()) {
            answerKey = ["A", "B", "C", "D"][j];
            answerText = options[j];
            foundAnswer = true;
            break;
          }
        }
      }

      if (!foundAnswer) {
        for (let j = 0; j < options.length; j++) {
          if (
            options[j].trim().toLowerCase().includes(answerRaw.toLowerCase()) ||
            answerRaw.toLowerCase().includes(options[j].trim().toLowerCase())
          ) {
            answerKey = ["A", "B", "C", "D"][j];
            answerText = options[j];
            foundAnswer = true;
            break;
          }
        }
      }

      if (!foundAnswer && options[0]) {
        answerKey = "A";
        answerText = options[0];
      }

      if (question.trim()) {
        parsedQuestions.push({
          question: question.trim(),
          options: options.map((opt) => opt.trim()),
          answerKey,
          answerText,
        });
      }
    }

    if (parsedQuestions.length === 0) {
      setToast({
        show: true,
        type: "error",
        message: "No valid questions found in CSV",
      });
      return;
    }

    setQuestions(parsedQuestions);
    setShowPreview(true);
    setValidationErrors((prev) => ({ ...prev, questions: "" }));

    setToast({
      show: true,
      type: "success",
      message: `${parsedQuestions.length} questions loaded successfully`,
    });
  };

  const handleSubmit = async () => {
     const token = localStorage.getItem("adminToken");
    if (!validateForm()) {
      setToast({
        show: true,
        type: "error",
        message: "Please fill all required fields",
      });
      return;
    }

    try {
      const payload = {
        technology: technology.trim(),
        level,
        timeLimit: parseInt(timeLimit, 10),
        questions,
        totalQuestions: questions.length,
      };

      await request("/admin/upload-quiz", "POST", payload);

      setToast({
        show: true,
        type: "success",
        message: `Quiz "${technology}" created successfully`,
      });

      resetForm();
    } catch (err) {
      console.log("UPLOAD ERROR:", err);

      setToast({
        show: true,
        type: "error",
        message: err.message || "Quiz upload failed",
      });
    }
  };

  useEffect(() => {
     const token =
       localStorage.getItem("adminToken"); // ✅ add this
     setIsLoggedIn(!!token);
   }, []);

  const resetForm = () => {
    setTechnology("");
    setLevel("Basic");
    setTimeLimit(30);
    setQuestions([]);
    setShowPreview(false);
    setValidationErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isFormValid =
    technology.trim() && level && timeLimit >= 1 && questions.length > 0;

  return (
    <div className={dashboardStyles.page}>
      <div className={dashboardStyles.container}>
        <div className={dashboardStyles.headerWrapper}>
          <div className={dashboardStyles.headerInner}>
            <div>
              <h1 className={dashboardStyles.title}>Tech Quiz Master</h1>
            </div>
          </div>
        </div>

        <div className={dashboardStyles.grid}>
          <div className={dashboardStyles.mainColumn}>
            <div className={dashboardStyles.card}>
              <h2 className={dashboardStyles.cardTitle}>Create New Quiz</h2>

              <div className={dashboardStyles.formFields}>
                <div>
                  <label className={dashboardStyles.label}>
                    Technology Name*
                  </label>
                  <input
                    type="text"
                    value={technology}
                    onChange={(e) => {
                      setTechnology(e.target.value);
                      setValidationErrors((prev) => ({
                        ...prev,
                        technology: "",
                      }));
                    }}
                    placeholder="e.g., JavaScript, React, Python"
                    className={`${dashboardStyles.inputBase} ${
                      validationErrors.technology
                        ? dashboardStyles.inputErrorBorder
                        : dashboardStyles.inputNormalBorder
                    }`}
                  />
                  {validationErrors.technology && (
                    <p className={dashboardStyles.errorMessage}>
                      <AlertCircle className={dashboardStyles.errorIcon} />
                      {validationErrors.technology}
                    </p>
                  )}
                </div>

                <div>
                  <label className={dashboardStyles.label}>
                    Difficulty Level*
                  </label>
                  <div className={dashboardStyles.label}>
                    {levels.map((lvl) => (
                      <button
                        key={lvl.value}
                        type="button"
                        onClick={() => {
                          setLevel(lvl.value);
                          setValidationErrors((prev) => ({
                            ...prev,
                            level: "",
                          }));
                        }}
                        className={`${dashboardStyles.levelButtonBase} ${
                          level === lvl.value
                            ? `${lvl.bg} border-2 ${lvl.color.replace("text", "border")}`
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span
                          className={`${dashboardStyles.levelButtonTextBase} ${
                            level === lvl.value ? lvl.color : "text-gray-600"
                          }`}
                        >
                          {lvl.value}
                        </span>
                      </button>
                    ))}
                  </div>
                  {validationErrors.level && (
                    <p className={dashboardStyles.errorMessage}>
                      <AlertCircle className={dashboardStyles.errorIcon} />
                      {validationErrors.level}
                    </p>
                  )}
                </div>

                <div>
                  <label className={dashboardStyles.label}>
                    Time Limit (Minutes) *
                  </label>
                  <div className={dashboardStyles.timeContainer}>
                    <div className={dashboardStyles.timeInputWrapper}>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={timeLimit}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || /^\d+$/.test(value)) {
                            setTimeLimit(value);
                          }
                          setValidationErrors((prev) => ({
                            ...prev,
                            timeLimit: "",
                          }));
                        }}
                        onBlur={(e) => {
                          if (e.target.value === "") setTimeLimit(30);
                        }}
                        className={`${dashboardStyles.timeInputBase} ${
                          validationErrors.timeLimit
                            ? dashboardStyles.inputErrorBorder
                            : dashboardStyles.inputNormalBorder
                        }`}
                        placeholder="Enter time in minutes"
                      />
                    </div>

                    <div className={dashboardStyles.timeDisplay}>
                      {timeLimit} min
                    </div>
                  </div>

                  <div className={dashboardStyles.timeHint}>
                    <AlertCircle className={dashboardStyles.timeHintIcon} />
                    <span>
                      Time allocated per participant to complete the quiz
                    </span>
                  </div>

                  {validationErrors.timeLimit && (
                    <p className={dashboardStyles.errorMessage}>
                      <AlertCircle className={dashboardStyles.errorIcon} />
                      {validationErrors.timeLimit}
                    </p>
                  )}
                </div>

                <div>
                  <label className={dashboardStyles.label}>
                    Upload Questions CSV *
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`${dashboardStyles.dropzoneBase} ${
                      isDragging
                        ? dashboardStyles.dropzoneDragging
                        : validationErrors.questions
                          ? dashboardStyles.dropzoneError
                          : dashboardStyles.dropzoneNormal
                    }`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        fileInputRef.current?.click();
                      }
                    }}
                    aria-label="Upload questions CSV"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className={dashboardStyles.hiddenInput}
                    />

                    <Upload
                      className={`${dashboardStyles.uploadIconBase} ${
                        isDragging
                          ? dashboardStyles.uploadIconDragging
                          : dashboardStyles.uploadIconNormal
                      }`}
                    />

                    <p className={dashboardStyles.dropzoneTextPrimary}>
                      {isDragging
                        ? "Drop your CSV file here"
                        : "Drag & drop or click to upload"}
                    </p>

                    <p className={dashboardStyles.dropzoneTextSecondary}>
                      Supports CSV files with Question, 4 Options, and Correct
                      Answer (A/B/C/D or exact text)
                    </p>
                  </div>

                  {validationErrors.questions && (
                    <p className={dashboardStyles.errorMessage}>
                      <AlertCircle className={dashboardStyles.errorIcon} />
                      {validationErrors.questions}
                    </p>
                  )}

                  {questions.length > 0 && (
                    <div className={dashboardStyles.successContainer}>
                      <div className={dashboardStyles.successInner}>
                        <div className={dashboardStyles.successLeft}>
                          <CheckCircle
                            className={dashboardStyles.successIcon}
                          />
                          <div>
                            <p className={dashboardStyles.successText}>
                              {questions.length} questions loaded
                            </p>
                          </div>
                        </div>

                        <button
                          onClick={() => setShowPreview(!showPreview)}
                          className={dashboardStyles.previewToggleButton}
                        >
                          {showPreview ? (
                            <EyeOff className={dashboardStyles.previewIcon} />
                          ) : (
                            <Eye className={dashboardStyles.previewIcon} />
                          )}
                          {showPreview ? "Hide Preview" : "Show Preview"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <button
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className={`${dashboardStyles.submitBase} ${
                      isFormValid
                        ? dashboardStyles.submitValid
                        : dashboardStyles.submitInvalid
                    }`}
                  >
                    {isFormValid ? (
                      <div className={dashboardStyles.submitInner}>
                        Create Quiz
                        <ChevronRight className={dashboardStyles.submitIcon} />
                      </div>
                    ) : (
                      "Fill All Fields to Continue"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {showPreview && questions.length > 0 && (
              <div className={dashboardStyles.previewCard}>
                <div className={dashboardStyles.previewHeader}>
                  <div>
                    <h3 className={dashboardStyles.previewTitle}>
                      Questions Preview
                    </h3>
                    <p className={dashboardStyles.previewSubtitle}>
                      REview all questions before creating quiz
                    </p>
                  </div>

                  <div className={dashboardStyles.previewRight}>
                    <div className={dashboardStyles.timeBadge}>
                      <Clock className={dashboardStyles.timeBadgeIcon} />
                      <span className={dashboardStyles.timeBadgeText}>
                        {timeLimit} min total
                      </span>
                    </div>

                    <span className={dashboardStyles.countBadge}>
                      {questions.length} questions
                    </span>
                  </div>
                </div>

                <div className={dashboardStyles.previewList}>
                  {questions.map((q, idx) => (
                    <div key={idx} className={dashboardStyles.previewItem}>
                      <div className="flex items-start gap-3">
                        <div className={dashboardStyles.previewNumber}>
                          {idx + 1}
                        </div>

                        <div className={dashboardStyles.previewContent}>
                          <div className="mb-3">
                            <h4 className={dashboardStyles.previewQuestion}>
                              {q.question}
                            </h4>
                          </div>

                          <div className={dashboardStyles.optionsGrid}>
                            {q.options.map((opt, oi) => {
                              const letter = letterForIndex(oi);
                              const isCorrect = q.answerKey === letter;

                              return (
                                <div
                                  key={oi}
                                  className={`${dashboardStyles.optionItemBase} ${
                                    isCorrect
                                      ? dashboardStyles.optionItemCorrect
                                      : dashboardStyles.optionItemIncorrect
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={`${dashboardStyles.optionLetterBase} ${
                                        isCorrect
                                          ? dashboardStyles.optionLetterCorrect
                                          : dashboardStyles.optionLetterIncorrect
                                      }`}
                                    >
                                      {letter}
                                    </div>

                                    <span
                                      className={
                                        isCorrect
                                          ? dashboardStyles.optionTextCorrect
                                          : dashboardStyles.optionTextIncorrect
                                      }
                                    >
                                      {opt || (
                                        <span
                                          className={
                                            dashboardStyles.optionEmptyText
                                          }
                                        >
                                          Empty option
                                        </span>
                                      )}
                                    </span>

                                    {isCorrect && (
                                      <div
                                        className={dashboardStyles.correctIcon}
                                      >
                                        <CheckCircle
                                          className={
                                            dashboardStyles.correctIconSvg
                                          }
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <div className={dashboardStyles.optionFooter}>
                            <div className={dashboardStyles.answerBadge}>
                              <CheckCircle
                                className={dashboardStyles.answerBadgeIcon}
                              />
                              <span className={dashboardStyles.answerBadgeText}>
                                Correct Answer: {q.answerKey}
                              </span>
                            </div>

                            <div className={dashboardStyles.positionText}>
                              Question {idx + 1} of {questions.length}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={dashboardStyles.rightColumn}>
            <div className={dashboardStyles.summaryCard}>
              <h3 className={dashboardStyles.summaryTitle}>
                👥 Platform Stats
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={dashboardStyles.summaryLabel}>
                    Total Registered Users
                  </span>

                  <div className="flex items-center gap-2">
                    <Users className={dashboardStyles.summaryIcon} />
                    <span className={dashboardStyles.summaryValue}>
                      {adminStats.totalUsers}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={dashboardStyles.summaryLabel}>
                    Total Logged In Users
                  </span>

                  <div className="flex items-center gap-2">
                    <CheckCircle className={dashboardStyles.summaryIcon} />
                    <span className={dashboardStyles.summaryValue}>
                      {adminStats.totalLoggedIn}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className={dashboardStyles.summaryLabel}>
                    Login Rate
                  </span>

                  <div className="flex items-center gap-2">
                    <BarChart className={dashboardStyles.summaryIcon} />
                    <span className="text-green-600 font-semibold">
                      {adminStats.loggedInPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={dashboardStyles.tipsCard}>
              <h3 className={dashboardStyles.tipsTitle}>🚀 Quick Tips</h3>
              <ul className={dashboardStyles.tipsList}>
                <li className={dashboardStyles.tipsItem}>
                  <div className={dashboardStyles.tipsNumber}>1</div>
                  <span className={dashboardStyles.tipsText}>
                    All fields marked with * are required
                  </span>
                </li>
                <li className={dashboardStyles.tipsItem}>
                  <div className={dashboardStyles.tipsNumber}>2</div>
                  <span className={dashboardStyles.tipsText}>
                    Preview questions before creating quiz
                  </span>
                </li>
                <li className={dashboardStyles.tipsItem}>
                  <div className={dashboardStyles.tipsNumber}>3</div>
                  <span className={dashboardStyles.tipsText}>
                    Set appropriate time limit based on difficulty level
                  </span>
                </li>
              </ul>
            </div>

            <div className={dashboardStyles.summaryCard}>
              <h3 className={dashboardStyles.summaryTitle}>📊 Quiz Summary</h3>
              <div className={dashboardStyles.summaryRows}>
                <div className={dashboardStyles.summaryRow}>
                  <span className={dashboardStyles.summaryLabel}>
                    Technology:
                  </span>
                  <span className={dashboardStyles.summaryValue}>
                    {technology || "—"}
                  </span>
                </div>

                <div className={dashboardStyles.summaryRow}>
                  <span className={dashboardStyles.summaryLabel}>Level:</span>
                  <span
                    className={`${dashboardStyles.summaryValue} ${
                      level === "Basic"
                        ? "text-green-600"
                        : level === "Intermediate"
                          ? "text-yellow-600"
                          : "text-red-600"
                    }`}
                  >
                    {level}
                  </span>
                </div>

                <div className={dashboardStyles.summaryRow}>
                  <span className={dashboardStyles.summaryLabel}>
                    Time Limit:
                  </span>
                  <div className="flex items-center gap-2">
                    <Clock className={dashboardStyles.summaryIcon} />
                    <span className={dashboardStyles.summaryValue}>
                      {timeLimit} minutes
                    </span>
                  </div>
                </div>

                <div className={dashboardStyles.summaryRow}>
                  <span className={dashboardStyles.summaryLabel}>
                    Total Questions:
                  </span>
                  <span className={dashboardStyles.summaryValue}>
                    {questions.length}
                  </span>
                </div>

                <div className={dashboardStyles.summaryStatusRow}>
                  <span className={dashboardStyles.summaryLabel}>Status:</span>
                  <span
                    className={`${dashboardStyles.statusBadgeBase} ${
                      isFormValid
                        ? dashboardStyles.statusBadgeReady
                        : dashboardStyles.statusBadgeIncomplete
                    }`}
                  >
                    {isFormValid ? "Ready" : "Incomplete"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast.show && (
        <div
          className={`${dashboardStyles.toastOuter} ${
            toast.show
              ? dashboardStyles.toastVisible
              : dashboardStyles.toastHidden
          }`}
        >
          <div
            className={`${dashboardStyles.toastInner} ${
              toast.type === "success"
                ? dashboardStyles.toastSuccess
                : toast.type === "error"
                  ? dashboardStyles.toastError
                  : dashboardStyles.toastInfo
            }`}
          >
            <div className="flex items-start gap-3">
              {toast.type === "success" ? (
                <CheckCircle className={dashboardStyles.toastIconSuccess} />
              ) : toast.type === "error" ? (
                <XCircle className={dashboardStyles.toastIconError} />
              ) : (
                <AlertCircle className={dashboardStyles.toastIconInfo} />
              )}

              <div className="flex-1">
                <p
                  className={`${dashboardStyles.toastTextBase} ${
                    toast.type === "success"
                      ? dashboardStyles.toastTextSuccess
                      : toast.type === "error"
                        ? dashboardStyles.toastTextError
                        : dashboardStyles.toastTextInfo
                  }`}
                >
                  {toast.message}
                </p>
              </div>

              <button
                onClick={() => setToast((prev) => ({ ...prev, show: false }))}
                className={dashboardStyles.toastCloseButton}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
