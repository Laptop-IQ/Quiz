import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Code,
  Database,
  Coffee,
  Cpu,
  Globe,
  Layout,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  XCircle,
  Award,
  Terminal,
  Star,
  Trophy,
  Sparkles,
  Zap,
  Target,
  Menu,
  X,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Clock,
  AlertCircle,
  Eye,
  BarChart3,
  HelpCircle,
  PlayCircle,
  Brain,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../services/api/api";
import {
  sidebarStyles,
  cssStyles,
  colorSchemes,
  getTimeColor,
  getQuestionStatusColor,
  getOptionButtonStyle,
} from "../assets/dummyStyles";

const STORAGE_KEY = "techQuizMasterProgress";

const techIconMap = {
  html: Code,
  css: Layout,
  javascript: Zap,
  react: Cpu,
  node: Terminal,
  mongodb: Database,
  java: Coffee,
  python: Globe,
};

const levelIconMap = {
  basic: Target,
  intermediate: Zap,
  advanced: Trophy,
};

const levelColorMap = {
  basic: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
  intermediate: "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200",
  advanced: "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200",
};

const DEFAULT_PROGRESS = {
  currentQuestion: 0,
  userAnswers: {},
  showResults: false,
  completedQuestions: [],
  isSubmitted: false,
  reviewMode: false,
  timeLeft: 0,
  timerStartedAt: null,
  elapsedTime: 0,
  isQuizStarted: false,
};

const Sidebar = () => {
  const { request } = useApi();
  const navigate = useNavigate();

  const timerRef = useRef(null);
  const asideRef = useRef(null);
  const hasAutoSubmittedRef = useRef(false);

  const [questionsData, setQuestionsData] = useState({});
  const [technologies, setTechnologies] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showRestartModal, setShowRestartModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const getStoredToken = () =>
    localStorage.getItem("token") ||
    sessionStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken");

  const getStoredUser = () => {
    try {
      const raw =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  const isAuthenticated = !!getStoredToken();
  const [user, setUser] = useState(getStoredUser());

  const loadSavedState = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return null;

      const parsed = JSON.parse(saved);

      if (parsed && !parsed.progressByTech) {
        if (parsed.selectedTech && parsed.selectedLevel) {
          return {
            progressByTech: {
              [parsed.selectedTech]: {
                [parsed.selectedLevel]: {
                  currentQuestion: parsed.currentQuestion || 0,
                  userAnswers: parsed.userAnswers || {},
                  showResults: parsed.showResults || false,
                  completedQuestions: parsed.completedQuestions || [],
                  isSubmitted: parsed.isSubmitted || false,
                  reviewMode: parsed.reviewMode || false,
                  timeLeft: parsed.timeLeft || 0,
                  timerStartedAt: parsed.timerStartedAt || null,
                  elapsedTime: parsed.elapsedTime || 0,
                  isQuizStarted: parsed.isQuizStarted || false,
                },
              },
            },
            currentTech: parsed.selectedTech,
            currentLevel: parsed.selectedLevel,
            timestamp: new Date().toISOString(),
          };
        }
      }

      return parsed;
    } catch (error) {
      console.error("Error loading saved state:", error);
      return null;
    }
  };

  const savedState = loadSavedState();

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  const [selectedTech, setSelectedTech] = useState(
    savedState?.currentTech || null,
  );
  const [selectedLevel, setSelectedLevel] = useState(
    savedState?.currentLevel || null,
  );

  const initialProgress =
    savedState?.progressByTech?.[savedState?.currentTech]?.[
      savedState?.currentLevel
    ] || DEFAULT_PROGRESS;

  const [currentQuestion, setCurrentQuestion] = useState(
    initialProgress.currentQuestion || 0,
  );
  const [userAnswers, setUserAnswers] = useState(
    initialProgress.userAnswers || {},
  );
  const [showResults, setShowResults] = useState(
    initialProgress.showResults || false,
  );
  const [completedQuestions, setCompletedQuestions] = useState(
    new Set(initialProgress.completedQuestions || []),
  );
  const [progressByTech, setProgressByTech] = useState(
    savedState?.progressByTech || {},
  );
  const [isSubmitted, setIsSubmitted] = useState(
    initialProgress.isSubmitted || false,
  );
  const [reviewMode, setReviewMode] = useState(
    initialProgress.reviewMode || false,
  );
  const [timeLeft, setTimeLeft] = useState(initialProgress.timeLeft || 0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerStartedAt, setTimerStartedAt] = useState(
    initialProgress.timerStartedAt || null,
  );
  const [elapsedTime, setElapsedTime] = useState(
    initialProgress.elapsedTime || 0,
  );
  const [isQuizStarted, setIsQuizStarted] = useState(
    initialProgress.isQuizStarted || false,
  );

  const [isSidebarOpen, setIsSidebarOpen] = useState(windowWidth >= 1024);

  const selectedTechObj = useMemo(() => {
    return technologies.find((t) => t.id === selectedTech) || {};
  }, [technologies, selectedTech]);

  const getLevelsForTech = (tech) => {
    if (!questionsData[tech]) return [];

    return Object.keys(questionsData[tech])
      .map((level) => {
        const levelData = questionsData[tech][level];
        const LevelIcon = levelIconMap[level?.toLowerCase()] || HelpCircle;

        return {
          id: level,
          name: level.charAt(0).toUpperCase() + level.slice(1),
          questions: levelData.questions?.length || 0,
          time: levelData.timeLimit ? `${levelData.timeLimit}m` : "",
          icon: (
            <LevelIcon
              size={16}
              className={`${
                level === selectedLevel ? "text-indigo-600" : "text-gray-600"
              }`}
            />
          ),
          color: colorSchemes[tech?.toUpperCase()] || "",
        };
      })
      .reverse();
  };

  const getTimeLimit = (tech, level) => {
    if (!tech || !level) return 0;
    const time = questionsData?.[tech]?.[level]?.timeLimit;
    return time ? time * 60 : 0;
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatElapsedTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }

    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getQuestions = (tech = selectedTech, level = selectedLevel) => {
    if (!tech || !level) return [];
    return questionsData[tech]?.[level]?.questions || [];
  };

  const findFirstUnansweredIndex = (answersObj = {}, total = 0) => {
    for (let i = 0; i < total; i++) {
      if (answersObj[i] === undefined) return i;
    }
    return -1;
  };

  const findLastCompletedQuestionLocal = () => {
    const questions = getQuestions();
    for (let i = questions.length - 1; i >= 0; i--) {
      if (userAnswers[i] !== undefined) return i;
    }
    return -1;
  };

  const calculateElapsedTime = () => {
    if (!timerStartedAt) return elapsedTime;
    const now = Date.now();
    const elapsedSeconds = Math.floor((now - timerStartedAt) / 1000);
    return elapsedTime + elapsedSeconds;
  };

  const persistProgressForLevel = (tech, level, levelProgress) => {
    if (!tech || !level) return;

    setProgressByTech((prev) => {
      const updatedProgress = {
        ...prev,
        [tech]: {
          ...(prev[tech] || {}),
          [level]: {
            ...(prev[tech]?.[level] || {}),
            ...levelProgress,
          },
        },
      };

      try {
        const stateToSave = {
          currentTech: tech,
          currentLevel: level,
          progressByTech: updatedProgress,
          timestamp: new Date().toISOString(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
      } catch (err) {
        console.error("Failed saving state:", err);
      }

      return updatedProgress;
    });
  };

  const saveTimerState = () => {
    if (!selectedTech || !selectedLevel) return;

    const currentElapsed = calculateElapsedTime();

    persistProgressForLevel(selectedTech, selectedLevel, {
      currentQuestion,
      userAnswers,
      showResults,
      completedQuestions: Array.from(completedQuestions),
      isSubmitted,
      reviewMode,
      timeLeft,
      timerStartedAt: isTimerRunning ? Date.now() : null,
      elapsedTime: currentElapsed,
      isQuizStarted,
    });
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (isSubmitted || reviewMode) return;

    setIsTimerRunning(true);

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    stopTimer();

    if (selectedLevel && !isSubmitted && !reviewMode && !showResults) {
      const fullTime = getTimeLimit(selectedTech, selectedLevel);
      setTimeLeft(fullTime);
      setTimerStartedAt(null);
      setElapsedTime(0);

      persistProgressForLevel(selectedTech, selectedLevel, {
        timeLeft: fullTime,
        timerStartedAt: null,
        elapsedTime: 0,
      });
    }
  };

  const handleHomeClick = () => {
    if (isTimerRunning) {
      saveTimerState();
      stopTimer();
    }

    setSelectedTech(null);
    setSelectedLevel(null);
    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    setIsQuizStarted(false);
    setReviewMode(false);
    setIsSubmitted(false);
    setCompletedQuestions(new Set());
    setTimeLeft(0);
    setTimerStartedAt(null);
    setElapsedTime(0);
  };

  const handleTimeUp = async () => {
    if (hasAutoSubmittedRef.current) return;
    hasAutoSubmittedRef.current = true;

    stopTimer();

    try {
      const questions = getQuestions();
      if (!questions.length) return;

      const newAnswers = { ...userAnswers };
      questions.forEach((_, index) => {
        if (newAnswers[index] === undefined || newAnswers[index] === null) {
          newAnswers[index] = -1;
        }
      });

      setUserAnswers(newAnswers);

      const finalElapsedTime = getTimeLimit(selectedTech, selectedLevel);

      let correct = 0;
      let wrong = 0;

      questions.forEach((q, index) => {
        const userAns = newAnswers[index];
        if (userAns !== -1) {
          if (userAns === q.correctAnswer) correct++;
          else wrong++;
        }
      });

      if (isAuthenticated) {
        await request("/result/save-result", "POST", {
          technology: selectedTech,
          level: selectedLevel,
          totalQuestions: questions.length,
          correct,
          wrong,
          timeTaken: finalElapsedTime,
          startDate: new Date(),
        });
      }

      setIsSubmitted(true);
      setIsQuizStarted(false);
      setShowResults(true);
      setTimeLeft(0);
      setTimerStartedAt(null);
      setElapsedTime(finalElapsedTime);

      persistProgressForLevel(selectedTech, selectedLevel, {
        currentQuestion,
        userAnswers: newAnswers,
        showResults: true,
        completedQuestions: Array.from(completedQuestions),
        isSubmitted: true,
        reviewMode: false,
        timeLeft: 0,
        timerStartedAt: null,
        elapsedTime: finalElapsedTime,
        isQuizStarted: false,
      });
    } catch (err) {
      console.error("AUTO SUBMIT BACKEND ERROR:", err);

      setShowResults(true);
      setIsSubmitted(true);
      setIsQuizStarted(false);

      persistProgressForLevel(selectedTech, selectedLevel, {
        currentQuestion,
        userAnswers,
        showResults: true,
        completedQuestions: Array.from(completedQuestions),
        isSubmitted: true,
        reviewMode: false,
        timeLeft: 0,
        timerStartedAt: null,
        elapsedTime: getTimeLimit(selectedTech, selectedLevel),
        isQuizStarted: false,
      });
    }
  };

  const handleStartQuiz = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    hasAutoSubmittedRef.current = false;

    if (!selectedTech || !selectedLevel) return;

    const now = Date.now();
    const fullTime = getTimeLimit(selectedTech, selectedLevel);

    setIsQuizStarted(true);
    setTimeLeft(fullTime);
    setTimerStartedAt(now);
    setElapsedTime(0);
    setCurrentQuestion(0);
    setUserAnswers({});
    setCompletedQuestions(new Set());
    setShowResults(false);
    setIsSubmitted(false);
    setReviewMode(false);

    persistProgressForLevel(selectedTech, selectedLevel, {
      currentQuestion: 0,
      userAnswers: {},
      showResults: false,
      completedQuestions: [],
      isSubmitted: false,
      reviewMode: false,
      timeLeft: fullTime,
      timerStartedAt: now,
      elapsedTime: 0,
      isQuizStarted: true,
    });

    startTimer();
  };

  const handleTechSelect = (techId) => {
    if (isTimerRunning) {
      saveTimerState();
      stopTimer();
    }

    if (selectedTech === techId) {
      setSelectedTech(null);
      setSelectedLevel(null);
    } else {
      setSelectedTech(techId);
      setSelectedLevel(null);
    }

    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    setCompletedQuestions(new Set());
    setIsSubmitted(false);
    setReviewMode(false);
    setIsQuizStarted(false);
    setTimeLeft(0);
    setTimerStartedAt(null);
    setElapsedTime(0);

    setTimeout(() => {
      const el = asideRef.current?.querySelector(`[data-tech="${techId}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  };

  const handleLevelSelect = (levelId) => {
    if (isTimerRunning) {
      saveTimerState();
      stopTimer();
    }

    setSelectedLevel(levelId);

    const progress = progressByTech?.[selectedTech]?.[levelId];

    if (progress) {
      const questions = getQuestions(selectedTech, levelId);
      const firstUnanswered = findFirstUnansweredIndex(
        progress.userAnswers || {},
        questions.length,
      );

      setCurrentQuestion(
        firstUnanswered >= 0 ? firstUnanswered : progress.currentQuestion || 0,
      );
      setUserAnswers(progress.userAnswers || {});
      setShowResults(progress.showResults || false);
      setCompletedQuestions(new Set(progress.completedQuestions || []));
      setIsSubmitted(progress.isSubmitted || false);
      setReviewMode(progress.reviewMode || false);
      setIsQuizStarted(progress.isQuizStarted || false);
      setElapsedTime(progress.elapsedTime || 0);

      if (
        progress.isQuizStarted &&
        !progress.isSubmitted &&
        !progress.reviewMode &&
        progress.timeLeft > 0
      ) {
        const totalTime = getTimeLimit(selectedTech, levelId);
        const remainingTime = Math.max(
          totalTime - (progress.elapsedTime || 0),
          0,
        );

        setTimeLeft(remainingTime);
        setTimerStartedAt(Date.now() - (progress.elapsedTime || 0) * 1000);

        if (remainingTime > 0) startTimer();
      } else {
        setTimeLeft(progress.timeLeft || getTimeLimit(selectedTech, levelId));
        setTimerStartedAt(progress.timerStartedAt || null);
      }
    } else {
      const fullTime = getTimeLimit(selectedTech, levelId);
      setCurrentQuestion(0);
      setUserAnswers({});
      setShowResults(false);
      setCompletedQuestions(new Set());
      setIsSubmitted(false);
      setReviewMode(false);
      setIsQuizStarted(false);
      setTimeLeft(fullTime);
      setTimerStartedAt(null);
      setElapsedTime(0);
    }

    if (windowWidth < 1024) setIsSidebarOpen(false);
  };

  const handleAnswerSelect = (answerIndex) => {
    if (!isQuizStarted || isSubmitted || reviewMode) return;

    const newAnswers = {
      ...userAnswers,
      [currentQuestion]: answerIndex,
    };

    const newCompleted = new Set(completedQuestions);
    newCompleted.add(currentQuestion);

    setUserAnswers(newAnswers);
    setCompletedQuestions(newCompleted);

    persistProgressForLevel(selectedTech, selectedLevel, {
      currentQuestion,
      userAnswers: newAnswers,
      completedQuestions: Array.from(newCompleted),
      showResults,
      isSubmitted,
      reviewMode,
      timeLeft,
      timerStartedAt,
      elapsedTime,
      isQuizStarted,
    });
  };

  const handleQuestionNavigation = (direction) => {
    const questions = getQuestions();

    if (!isQuizStarted && !reviewMode) return;

    if (direction === "prev" && currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else if (direction === "next" && currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleDirectQuestionClick = (questionIndex) => {
    if (!isQuizStarted && !reviewMode) return;
    setCurrentQuestion(questionIndex);
  };

  const calculateScore = () => {
    const questions = getQuestions();
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];

      if (userAnswer === undefined || userAnswer === -1) {
        unattempted++;
      } else if (userAnswer === question.correctAnswer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    const total = questions.length;
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

    return { correct, incorrect, unattempted, total, percentage };
  };

  const handleSubmitQuiz = () => {
    if (!isQuizStarted && !reviewMode) return;

    if (isSubmitted) {
      setShowResults(true);
      setReviewMode(false);
      return;
    }

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    setShowSubmitModal(true);
  };

  const confirmSubmit = async () => {
    if (!isAuthenticated) {
      setShowSubmitModal(false);
      setShowLoginModal(true);
      return;
    }

    try {
      const questions = getQuestions();
      if (!questions.length) return;

      const newAnswers = { ...userAnswers };
      questions.forEach((_, index) => {
        if (newAnswers[index] === undefined || newAnswers[index] === null) {
          newAnswers[index] = -1;
        }
      });

      stopTimer();
      const finalElapsedTime = calculateElapsedTime();

      let correct = 0;
      let wrong = 0;

      questions.forEach((q, index) => {
        const userAns = newAnswers[index];
        if (userAns !== -1) {
          if (userAns === q.correctAnswer) correct++;
          else wrong++;
        }
      });

      await request("/result/save-result", "POST", {
        technology: selectedTech,
        level: selectedLevel,
        totalQuestions: questions.length,
        correct,
        wrong,
        timeTaken: finalElapsedTime,
        startDate: new Date(),
      });

      setUserAnswers(newAnswers);
      setShowResults(true);
      setIsSubmitted(true);
      setIsQuizStarted(false);
      setTimeLeft(0);
      setElapsedTime(finalElapsedTime);
      setShowSubmitModal(false);

      persistProgressForLevel(selectedTech, selectedLevel, {
        currentQuestion,
        userAnswers: newAnswers,
        showResults: true,
        completedQuestions: Array.from(completedQuestions),
        isSubmitted: true,
        reviewMode: false,
        timeLeft: 0,
        timerStartedAt: null,
        elapsedTime: finalElapsedTime,
        isQuizStarted: false,
      });
    } catch (err) {
      console.error("MANUAL SUBMIT ERROR:", err);
      alert(err?.message || "Failed to submit quiz. Please try again.");
    }
  };

  const handleReviewMode = () => {
    const questions = getQuestions();
    if (!questions.length) return;

    setCurrentQuestion(0);
    setReviewMode(true);
    setShowResults(false);
    stopTimer();
  };

  const restartQuiz = () => {
    if (!selectedTech || !selectedLevel) return;
    setShowRestartModal(true);
  };

  const confirmRestart = () => {
    stopTimer();

    const fullTime = getTimeLimit(selectedTech, selectedLevel);

    setCurrentQuestion(0);
    setUserAnswers({});
    setShowResults(false);
    setCompletedQuestions(new Set());
    setIsSubmitted(false);
    setReviewMode(false);
    setIsQuizStarted(false);
    setTimeLeft(fullTime);
    setTimerStartedAt(null);
    setElapsedTime(0);
    setShowRestartModal(false);

    persistProgressForLevel(selectedTech, selectedLevel, {
      currentQuestion: 0,
      userAnswers: {},
      showResults: false,
      completedQuestions: [],
      isSubmitted: false,
      reviewMode: false,
      timeLeft: fullTime,
      timerStartedAt: null,
      elapsedTime: 0,
      isQuizStarted: false,
    });
  };

  const getProgressForTechLevel = (techId, levelId) => {
    const progress = progressByTech?.[techId]?.[levelId];
    if (!progress || !progress.userAnswers) return { answered: 0, total: 0 };

    const questions = questionsData[techId]?.[levelId]?.questions || [];

    const answered = Object.keys(progress.userAnswers).filter(
      (key) =>
        progress.userAnswers[key] !== undefined &&
        progress.userAnswers[key] !== -1,
    ).length;

    return {
      answered,
      total: questions.length,
    };
  };

  const isTechLevelCompleted = (techId, levelId) => {
    const progress = progressByTech?.[techId]?.[levelId];
    if (!progress || !progress.userAnswers) return false;

    const questions = questionsData[techId]?.[levelId]?.questions || [];

    return (
      questions.length > 0 &&
      questions.every(
        (_, index) =>
          progress.userAnswers[index] !== undefined &&
          progress.userAnswers[index] !== -1,
      )
    );
  };

  const questions = getQuestions();
  const currentQ = questions[currentQuestion];
  const score = calculateScore();

  const getPerformanceStatus = () => {
    if (score.percentage >= 90) {
      return {
        text: "Outstanding!",
        color: "bg-gradient-to-r from-amber-100 to-amber-50",
        icon: <Sparkles className="text-amber-600" />,
        textColor: "text-amber-800",
      };
    }
    if (score.percentage >= 75) {
      return {
        text: "Excellent!",
        color: "bg-gradient-to-r from-indigo-100 to-violet-50",
        icon: <Trophy className="text-indigo-600" />,
        textColor: "text-indigo-800",
      };
    }
    if (score.percentage >= 60) {
      return {
        text: "Good Job!",
        color: "bg-gradient-to-r from-emerald-100 to-teal-50",
        icon: <Award className="text-emerald-600" />,
        textColor: "text-emerald-800",
      };
    }
    return {
      text: "Keep Practicing",
      color: "bg-gradient-to-r from-gray-100 to-gray-50",
      icon: <BookOpen className="text-gray-600" />,
      textColor: "text-gray-800",
    };
  };

  const performance = getPerformanceStatus();

  const timeColor = getTimeColor(
    timeLeft,
    getTimeLimit(selectedTech, selectedLevel),
    isSubmitted,
    reviewMode,
  );

  const getQuestionStatus = (index) => {
    const question = questions[index];
    if (!question) return "unattempted";

    const answer = userAnswers[index];
    if (answer === undefined || answer === -1) return "unattempted";
    if (answer === question.correctAnswer) return "correct";
    return "incorrect";
  };

  const getAnswerFeedback = () => {
    if (!currentQ) return null;

    const userAnswer = userAnswers[currentQuestion];
    const isCorrect = userAnswer === currentQ.correctAnswer;
    const isUnattempted = userAnswer === undefined || userAnswer === -1;

    return {
      userAnswer,
      isCorrect,
      isUnattempted,
      correctAnswer: currentQ.correctAnswer,
      explanation:
        currentQ.explanation ||
        `The correct answer is option ${currentQ.correctAnswer + 1}`,
    };
  };

  const answerFeedback = getAnswerFeedback();
  const isMobile = windowWidth < 1024;

  const isCurrentAnswered =
    userAnswers[currentQuestion] !== undefined &&
    userAnswers[currentQuestion] !== -1;

  const extraCss = `
    .filled-question {
      transition: box-shadow 220ms ease, border-color 220ms ease, transform 220ms ease;
      box-shadow: 0 10px 30px rgba(59,130,246,0.10), 0 0 0 6px rgba(96,165,250,0.03);
      border: 1px solid rgba(59,130,246,0.12) !important;
      transform: translateY(-2px);
    }

    .filled-indicator {
      transition: box-shadow 220ms ease, background 220ms ease, transform 220ms ease;
      box-shadow: 0 0 0 6px rgba(59,130,246,0.06);
      background: linear-gradient(90deg, rgba(96,165,250,0.08), rgba(59,130,246,0.06));
      border-radius: 8px;
      transform: translateY(-1px);
    }

    .question-indicator.filled-indicator:focus {
      outline: none;
      box-shadow: 0 0 0 10px rgba(59,130,246,0.06);
    }

    @media (max-width: 1024px) {
      .filled-question { box-shadow: 0 6px 18px rgba(59,130,246,0.08); }
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
  `;

  useEffect(() => {
    const syncAuth = () => {
      setUser(getStoredUser());
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const data = await request("/user/quizzes");
        const formatted = {};
        const techList = [];

        data.forEach((q) => {
          const tech = q.technology?.toLowerCase();
          const level = q.level;

          if (!formatted[tech]) {
            formatted[tech] = {};

            const IconComponent = techIconMap[tech?.toLowerCase()] || Cpu;
            const formatTechName = (name) =>
              name.charAt(0).toUpperCase() + name.slice(1);

            techList.push({
              id: tech,
              name: formatTechName(q.technology),
              color: colorSchemes[tech?.toUpperCase()] || "",
              icon: IconComponent,
            });
          }

          formatted[tech][level] = {
            questions: q.questions.map((question) => {
              let correctIndex = question.answerKey;

              if (typeof correctIndex === "string") {
                correctIndex = ["A", "B", "C", "D"].indexOf(
                  correctIndex.toUpperCase(),
                );
              }

              return {
                ...question,
                correctAnswer: correctIndex,
              };
            }),
            timeLimit: q.timeLimit,
          };
        });

        setQuestionsData(formatted);
        setTechnologies(techList.reverse());
      } catch (err) {
        console.error("FETCH ERROR:", err);
      }
    };

    loadQuizzes();
  }, [request]);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentTech: selectedTech,
          currentLevel: selectedLevel,
          progressByTech,
          timestamp: new Date().toISOString(),
        }),
      );
    } catch (err) {
      console.error("Failed saving state:", err);
    }
  }, [selectedTech, selectedLevel, progressByTech]);

  useEffect(() => {
    if (timeLeft === 0 && isQuizStarted && !isSubmitted && !reviewMode) {
      handleTimeUp();
    }
  }, [timeLeft, isQuizStarted, isSubmitted, reviewMode]);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsSidebarOpen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isSidebarOpen && windowWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen, windowWidth]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        asideRef.current &&
        !asideRef.current.contains(e.target) &&
        isSidebarOpen &&
        windowWidth < 1024
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("touchstart", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [isSidebarOpen, windowWidth]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isTimerRunning) {
        saveTimerState();
      }
    };

    const handleBeforeUnload = () => {
      if (isTimerRunning) {
        saveTimerState();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [
    isTimerRunning,
    selectedTech,
    selectedLevel,
    timeLeft,
    timerStartedAt,
    elapsedTime,
  ]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (isTimerRunning) saveTimerState();
    };
  }, [isTimerRunning]);

  const toggleSidebar = () => setIsSidebarOpen((p) => !p);

  return (
    <div className={sidebarStyles.container}>
      {isSidebarOpen && windowWidth < 1024 && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className={sidebarStyles.overlay}
          aria-hidden
        />
      )}

      <div className={sidebarStyles.flexContainer}>
        <aside
          ref={asideRef}
          className={`${sidebarStyles.sidebar} ${
            isSidebarOpen
              ? sidebarStyles.sidebarOpen
              : sidebarStyles.sidebarClosed
          }`}
          aria-hidden={!isSidebarOpen && isMobile}
        >
          <div className={sidebarStyles.sidebarHeader}>
            <div className={sidebarStyles.headerContent}>
              <div
                className={`${sidebarStyles.logoContainer} cursor-pointer hover:opacity-80 transition-opacity`}
                onClick={handleHomeClick}
              >
                <div className={sidebarStyles.logoIcon}>
                  <BookOpen size={28} className="text-indigo-600" />
                </div>
                <div>
                  <h1 className={sidebarStyles.title}>Tech Quiz Master</h1>
                  <p className={sidebarStyles.subtitle}>Test • Learn • Grow</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className={sidebarStyles.closeButton}
                  aria-label="Close sidebar"
                >
                  <X size={18} className="text-slate-600" />
                </button>
              </div>
            </div>
          </div>

          <div className={sidebarStyles.sidebarContent}>
            <div className={sidebarStyles.techSectionHeader}>
              <h2 className={sidebarStyles.techTitle}>
                <span className={sidebarStyles.techTitleAccent}></span>
                Technologies
              </h2>
              <span className={sidebarStyles.techCountBadge}>
                {technologies.length} Techs
              </span>
            </div>

            {technologies.map((tech) => {
              const Icon = tech.icon;

              return (
                <div key={tech.id} className="mb-3" data-tech={tech.id}>
                  <button
                    onClick={() => handleTechSelect(tech.id)}
                    className={`${sidebarStyles.techButton} ${
                      selectedTech === tech.id
                        ? `${tech.color || ""} ${sidebarStyles.techButtonSelected}`
                        : sidebarStyles.techButtonUnselected
                    }`}
                  >
                    <div className={sidebarStyles.techIconContainer}>
                      <span
                        className={`${sidebarStyles.techIcon} ${tech.color || ""}`}
                      >
                        {Icon && <Icon size={20} />}
                      </span>
                      <span className={sidebarStyles.techName}>
                        {tech.name}
                      </span>
                    </div>

                    {selectedTech === tech.id ? (
                      <ChevronDown size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                  </button>

                  {selectedTech === tech.id && (
                    <div className={sidebarStyles.levelContainer}>
                      {getLevelsForTech(tech.id).map((level) => {
                        const progress = getProgressForTechLevel(
                          tech.id,
                          level.id,
                        );
                        const isCompleted = isTechLevelCompleted(
                          tech.id,
                          level.id,
                        );

                        return (
                          <button
                            key={level.id}
                            onClick={() => handleLevelSelect(level.id)}
                            className={`${sidebarStyles.levelButton}
${
  selectedLevel === level.id
    ? levelColorMap[level.id.toLowerCase()] || "bg-white"
    : "bg-white"
}`}
                            style={{
                              color:
                                colorSchemes[selectedTech?.toUpperCase()] || "",
                              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
                              border: "1px solid rgba(0,0,0,0.08)",
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`w-9 h-9 rounded-lg shadow-sm flex items-center justify-center ${
                                    selectedLevel === level.id
                                      ? "bg-white text-indigo-600"
                                      : "bg-gray-100 text-gray-600"
                                  }`}
                                >
                                  {level.icon}
                                </div>

                                <span className="font-medium text-gray-800">
                                  {level.name}
                                </span>
                              </div>

                              <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                                {level.questions} Qs
                              </span>
                            </div>

                            <div className="flex justify-end mt-2">
                              <span className="text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-medium flex items-center gap-1">
                                <Clock size={12} />
                                {level.time}
                              </span>
                            </div>

                            <div className="flex items-center justify-between mt-2">
                              {progress.answered > 0 ? (
                                <span className="text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                                  {progress.answered}/{progress.total} answered
                                </span>
                              ) : (
                                <span></span>
                              )}

                              {isCompleted && (
                                <span className="text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-600 font-medium">
                                  Completed
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div className={sidebarStyles.sidebarFooter}>
              <div className="flex flex-col space-y-3">
                <div className={sidebarStyles.footerTextContainer}>
                  <p className={sidebarStyles.footerText1}>
                    Master your skills one quiz at a time
                  </p>
                  <p className={sidebarStyles.footerText2}>
                    Keep Learning, Keep Growing!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <main className={sidebarStyles.mainContent}>
          <div className={sidebarStyles.mobileHeader}>
            <button
              onClick={toggleSidebar}
              className={sidebarStyles.hamburgerButton}
              aria-label="Toggle sidebar"
            >
              <Menu size={20} className="text-slate-700" />
            </button>
          </div>

          {selectedTech && !selectedLevel && (
            <div className={sidebarStyles.mobileLevelContainer}>
              <div className={sidebarStyles.mobileLevelScroll}>
                {getLevelsForTech(selectedTech).map((l) => {
                  const progress = getProgressForTechLevel(selectedTech, l.id);
                  const isCompleted = isTechLevelCompleted(selectedTech, l.id);

                  return (
                    <button
                      key={l.id}
                      onClick={() => handleLevelSelect(l.id)}
                      className={sidebarStyles.mobileLevelButton}
                    >
                      <div className={sidebarStyles.mobileLevelContent}>
                        <span className={sidebarStyles.mobileLevelName}>
                          {l.name}
                        </span>

                        <div className={sidebarStyles.mobileLevelStats}>
                          <span className={sidebarStyles.questionCountBadge}>
                            {l.questions} Qs
                          </span>
                        </div>

                        <div className="flex items-center space-x-1 mt-1">
                          {progress.answered > 0 && (
                            <span className={sidebarStyles.answeredBadge}>
                              {progress.answered}
                            </span>
                          )}
                          {isCompleted && (
                            <span className={sidebarStyles.completedBadge}>
                              ✓
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {!selectedTech ? (
            <div className={sidebarStyles.emptyState}>
              <div className={sidebarStyles.emptyStateCard}>
                <div className={sidebarStyles.emptyStateHeader}>
                  <div className={sidebarStyles.emptyStateIconContainer}>
                    <Brain className="w-6 h-6 text-rose-600" />
                  </div>
                  <h2 className={sidebarStyles.emptyStateTitle}>
                    Tech Quiz Master
                  </h2>
                  <p className={sidebarStyles.emptyStateSubtitle}>
                    Select a technology from the sidebar to begin your quiz
                    journey
                  </p>
                </div>

                <div className={sidebarStyles.featureCardsGrid}>
                  <div className={sidebarStyles.featureCard}>
                    <div
                      className={`${sidebarStyles.featureCardGlow} bg-linear-to-r from-rose-300 to-orange-300`}
                    ></div>
                    <div
                      className={`${sidebarStyles.featureCardBody} border-rose-100/60`}
                    >
                      <div
                        className={`${sidebarStyles.featureCardIconContainer} bg-linear-to-br from-rose-50 to-orange-50 ring-rose-100`}
                      >
                        <Star className="w-5 h-5 text-rose-600" />
                      </div>
                      <h3 className={sidebarStyles.featureCardTitle}>
                        Multiple Technologies
                      </h3>
                      <div className={sidebarStyles.featureCardList}>
                        <div className={sidebarStyles.featureListItem}>
                          <div
                            className={`${sidebarStyles.listDot} bg-rose-400`}
                          ></div>
                          <span>HTML & CSS Fundamentals</span>
                        </div>
                        <div className={sidebarStyles.featureListItem}>
                          <div
                            className={`${sidebarStyles.listDot} bg-orange-400`}
                          ></div>
                          <span>JavaScript & React</span>
                        </div>
                        <div className={sidebarStyles.featureListItem}>
                          <div
                            className={`${sidebarStyles.listDot} bg-amber-400`}
                          ></div>
                          <span>And many more technologies</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={sidebarStyles.featureCard}>
                    <div
                      className={`${sidebarStyles.featureCardGlow} bg-linear-to-r from-amber-300 to-yellow-300`}
                    ></div>
                    <div
                      className={`${sidebarStyles.featureCardBody} border-amber-100/60`}
                    >
                      <div
                        className={`${sidebarStyles.featureCardIconContainer} bg-linear-to-br from-amber-50 to-yellow-50 ring-amber-100`}
                      >
                        <Zap className="w-5 h-5 text-amber-600" />
                      </div>
                      <h3 className={sidebarStyles.featureCardTitle}>
                        Timed Challenges
                      </h3>

                      <div className="space-y-2 grow">
                        <div className={sidebarStyles.levelStatRow}>
                          <span
                            className={`${sidebarStyles.levelStatBadge} text-amber-700 bg-amber-50`}
                          >
                            Basic
                          </span>
                          <span className={sidebarStyles.levelStatTime}>
                            5 minutes
                          </span>
                        </div>
                        <div className={sidebarStyles.levelStatRow}>
                          <span
                            className={`${sidebarStyles.levelStatBadge} text-orange-700 bg-orange-50`}
                          >
                            Intermediate
                          </span>
                          <span className={sidebarStyles.levelStatTime}>
                            10 minutes
                          </span>
                        </div>
                        <div className={sidebarStyles.levelStatRow}>
                          <span
                            className={`${sidebarStyles.levelStatBadge} text-rose-700 bg-rose-50`}
                          >
                            Advanced
                          </span>
                          <span className={sidebarStyles.levelStatTime}>
                            15 minutes
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={sidebarStyles.featureCard}>
                    <div
                      className={`${sidebarStyles.featureCardGlow} bg-linear-to-r from-teal-300 to-emerald-300`}
                    ></div>
                    <div
                      className={`${sidebarStyles.featureCardBody} border-teal-100/60`}
                    >
                      <div
                        className={`${sidebarStyles.featureCardIconContainer} bg-linear-to-br from-teal-50 to-emerald-50 ring-teal-100`}
                      >
                        <Target className="w-5 h-5 text-teal-600" />
                      </div>
                      <h3 className={sidebarStyles.featureCardTitle}>
                        Progress Tracking
                      </h3>
                      <div className="space-y-2 grow">
                        <div className={sidebarStyles.featureCheckItem}>
                          <CheckCircle
                            className={`${sidebarStyles.checkIcon} text-teal-500`}
                          />
                          <span>Auto-save per technology</span>
                        </div>
                        <div className={sidebarStyles.featureCheckItem}>
                          <CheckCircle
                            className={`${sidebarStyles.checkIcon} text-teal-500`}
                          />
                          <span>Track level completion</span>
                        </div>
                        <div className={sidebarStyles.featureCheckItem}>
                          <CheckCircle
                            className={`${sidebarStyles.checkIcon} text-teal-500`}
                          />
                          <span>Detailed performance stats</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={sidebarStyles.ctaContainer}>
                  <div className={sidebarStyles.ctaAccent}></div>
                  <div className={sidebarStyles.ctaText}>
                    <div className={sidebarStyles.ctaTextInner}>
                      <Sparkles className={sidebarStyles.ctaSparkle} />
                      Select any technology to begin!
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : !selectedLevel ? (
            <div className={sidebarStyles.techSelectedState}>
              <div className={sidebarStyles.techSelectedCard}>
                <div
                  className={`${sidebarStyles.techSelectedIcon} ${selectedTechObj?.color || ""}`}
                >
                  {(() => {
                    const Icon = selectedTechObj.icon;
                    return Icon ? <Icon size={28} /> : null;
                  })()}
                </div>
                <h2 className={sidebarStyles.techSelectedTitle}>
                  {selectedTechObj?.name?.charAt(0).toUpperCase() +
                    selectedTechObj?.name?.slice(1)}{" "}
                  Quiz
                </h2>
                <p className={sidebarStyles.techSelectedSubtitle}>
                  Select a difficulty level to begin your challenge
                </p>

                {isAuthenticated && selectedLevel && (
                  <div className={sidebarStyles.progressList}>
                    {(() => {
                      const progress = getProgressForTechLevel(
                        selectedTech,
                        selectedLevel,
                      );
                      if (progress.answered > 0) {
                        return (
                          <div className={sidebarStyles.progressItem}>
                            <p className={sidebarStyles.progressText}>
                              {selectedLevel.charAt(0).toUpperCase() +
                                selectedLevel.slice(1)}
                              : {progress.answered}/{progress.total} answered
                            </p>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                )}

                <div className={sidebarStyles.readyMessage}>
                  <p className={sidebarStyles.readyText}>
                    Get ready to test your{" "}
                    {selectedTechObj?.name?.charAt(0).toUpperCase() +
                      selectedTechObj?.name?.slice(1)}{" "}
                    knowledge!
                  </p>
                </div>
              </div>
            </div>
          ) : showResults ? (
            <div className={sidebarStyles.resultsScreen}>
              <div className={sidebarStyles.resultsCard}>
                <div className={sidebarStyles.resultsHeader}>
                  <div
                    className={`${sidebarStyles.resultsIconContainer} ${performance.color}`}
                  >
                    {performance.icon}
                  </div>
                  <h2 className={sidebarStyles.resultsTitle}>
                    Quiz Completed!
                  </h2>
                  <p className={sidebarStyles.resultsSubtitle}>
                    You've completed the {selectedLevel} level of{" "}
                    {selectedTechObj?.name?.charAt(0).toUpperCase() +
                      selectedTechObj?.name?.slice(1)}
                  </p>
                  <div
                    className={`${sidebarStyles.performanceBadge} ${performance.color} ${performance.textColor}`}
                  >
                    {performance.text}
                  </div>

                  <div className={sidebarStyles.timeTakenContainer}>
                    <div className={sidebarStyles.timeTakenHeader}>
                      <Clock
                        size={20}
                        className={sidebarStyles.timeTakenIcon}
                      />
                      <span className={sidebarStyles.timeTakenText}>
                        Time Taken: {formatElapsedTime(elapsedTime)}
                      </span>
                    </div>
                    <div className={sidebarStyles.timeTakenSubtext}>
                      You completed the quiz in {formatElapsedTime(elapsedTime)}
                    </div>
                  </div>

                  <div className={sidebarStyles.scoreCardsGrid}>
                    <div
                      className={`${sidebarStyles.scoreCard} bg-linear-to-br from-emerald-50/80 to-teal-50/80 border-emerald-200/50`}
                    >
                      <div
                        className={`${sidebarStyles.scoreCardIconContainer} bg-linear-to-br from-emerald-100 to-teal-100 text-emerald-600`}
                      >
                        <CheckCircle size={24} />
                      </div>
                      <p
                        className={`${sidebarStyles.scoreCardNumber} text-emerald-600`}
                      >
                        {score.correct}
                      </p>
                      <p
                        className={`${sidebarStyles.scoreCardLabel} text-emerald-700`}
                      >
                        Correct Answers
                      </p>
                    </div>

                    <div
                      className={`${sidebarStyles.scoreCard} bg-linear-to-br from-rose-50/80 to-pink-50/80 border-rose-200/50`}
                    >
                      <div
                        className={`${sidebarStyles.scoreCardIconContainer} bg-linear-to-br from-rose-100 to-pink-100 text-rose-600`}
                      >
                        <XCircle size={24} />
                      </div>
                      <p
                        className={`${sidebarStyles.scoreCardNumber} text-rose-600`}
                      >
                        {score.incorrect}
                      </p>
                      <p
                        className={`${sidebarStyles.scoreCardLabel} text-rose-700`}
                      >
                        Incorrect Answers
                      </p>
                    </div>

                    <div
                      className={`${sidebarStyles.scoreCard} bg-orange-100 border-gray-200/50`}
                    >
                      <div
                        className={`${sidebarStyles.scoreCardIconContainer} bg-orange-50 text-gray-600`}
                      >
                        <AlertCircle size={24} />
                      </div>
                      <p
                        className={`${sidebarStyles.scoreCardNumber} text-gray-600`}
                      >
                        {score.unattempted}
                      </p>
                      <p className={sidebarStyles.scoreCardLabel}>
                        Unattempted
                      </p>
                    </div>
                  </div>

                  <div className={sidebarStyles.overallScoreContainer}>
                    <div className={sidebarStyles.overallScoreHeader}>
                      <span className={sidebarStyles.overallScoreLabel}>
                        Overall Score
                      </span>
                      <span className={sidebarStyles.overallScoreValue}>
                        {score.percentage}%
                      </span>
                    </div>
                    <div className={sidebarStyles.progressBarContainer}>
                      <div
                        className={`${sidebarStyles.progressBar} ${
                          score.percentage >= 80
                            ? "bg-linear-to-r from-emerald-400 to-teal-400"
                            : score.percentage >= 60
                              ? "bg-linear-to-r from-amber-400 to-orange-400"
                              : "bg-linear-to-r from-rose-400 to-pink-400"
                        }`}
                        style={{ width: `${score.percentage}%` }}
                      />
                    </div>
                    <div className={sidebarStyles.scoreDescription}>
                      Score based on {score.correct} correct out of{" "}
                      {score.total} questions
                    </div>
                  </div>

                  <div className={sidebarStyles.resultsButtonsContainer}>
                    <button
                      onClick={handleReviewMode}
                      className={sidebarStyles.reviewButton}
                    >
                      <Eye size={18} />
                      <span>Review Questions</span>
                    </button>

                    <button
                      onClick={restartQuiz}
                      className={sidebarStyles.restartButton}
                    >
                      <RotateCcw size={18} />
                      <span>Restart Quiz</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : !isQuizStarted && !reviewMode && selectedTech && selectedLevel ? (
            <div className={sidebarStyles.startQuizScreen}>
              <div className={sidebarStyles.startQuizCard}>
                <div className={sidebarStyles.startQuizHeader}>
                  <div className={sidebarStyles.startQuizIconContainer}>
                    <PlayCircle size={48} className="text-blue-600" />
                  </div>
                  <h2 className={sidebarStyles.startQuizTitle}>
                    Ready to Start?
                  </h2>
                  <p className={sidebarStyles.startQuizSubtitle}>
                    Get ready for the {selectedLevel} level of{" "}
                    {selectedTechObj?.name?.charAt(0).toUpperCase() +
                      selectedTechObj?.name?.slice(1)}{" "}
                    quiz
                  </p>

                  <div className={sidebarStyles.quizInfoCard}>
                    <div className={sidebarStyles.quizInfoHeader}>
                      <div className={sidebarStyles.techDisplay}>
                        <div
                          className={`${sidebarStyles.techDisplayIcon} ${selectedTechObj?.color || ""}`}
                        >
                          {(() => {
                            const Icon = selectedTechObj.icon;
                            return Icon ? <Icon size={28} /> : null;
                          })()}
                        </div>
                        <div className={sidebarStyles.techDisplayText}>
                          <p className={sidebarStyles.techDisplayName}>
                            {selectedTechObj.name}
                          </p>
                          <p className={sidebarStyles.techDisplayLevel}>
                            {selectedLevel.charAt(0).toUpperCase() +
                              selectedLevel.slice(1)}{" "}
                            Level
                          </p>
                        </div>
                      </div>

                      <div className={sidebarStyles.quizStats}>
                        <div className={sidebarStyles.statItem}>
                          <div className={sidebarStyles.statNumber}>
                            {questions.length}
                          </div>
                          <div className={sidebarStyles.statLabel}>
                            Questions
                          </div>
                        </div>

                        <div className={sidebarStyles.statItem}>
                          <div className={sidebarStyles.statNumber}>
                            <Clock size={16} className="mr-1" />
                            {getTimeLimit(selectedTech, selectedLevel) / 60} min
                          </div>
                          <div className={sidebarStyles.statLabel}>
                            Time Limit
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={sidebarStyles.instructionsContainer}>
                      <h4 className={sidebarStyles.instructionsTitle}>
                        Quiz Instructions:
                      </h4>
                      <ul className={sidebarStyles.instructionsList}>
                        <li className={sidebarStyles.instructionItem}>
                          <CheckCircle
                            size={14}
                            className={sidebarStyles.instructionCheck}
                          />
                          Answer all questions within the time limit
                        </li>

                        <li className={sidebarStyles.instructionItem}>
                          <CheckCircle
                            size={14}
                            className={sidebarStyles.instructionCheck}
                          />
                          Timer starts immediately when you click "Start Quiz"
                        </li>
                        <li className={sidebarStyles.instructionItem}>
                          <CheckCircle
                            size={14}
                            className={sidebarStyles.instructionCheck}
                          />
                          Your progress is saved automatically
                        </li>
                      </ul>
                    </div>
                  </div>

                  {getProgressForTechLevel(selectedTech, selectedLevel)
                    .answered > 0 && (
                    <div className={sidebarStyles.progressWarning}>
                      <p className={sidebarStyles.warningText}>
                        You have previously answered{" "}
                        {
                          getProgressForTechLevel(selectedTech, selectedLevel)
                            .answered
                        }{" "}
                        questions. Starting fresh will reset your progress.
                      </p>
                    </div>
                  )}

                  <div className={sidebarStyles.startButtonsContainer}>
                    <button
                      onClick={handleStartQuiz}
                      className={sidebarStyles.startButton}
                    >
                      <PlayCircle size={20} />
                      <span className="font-bold">
                        {isAuthenticated ? "Start Quiz" : "Login to Start"}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setSelectedLevel(null);
                        setIsQuizStarted(false);
                      }}
                      className={sidebarStyles.changeLevelButton}
                    >
                      Change Level
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : currentQ && (isQuizStarted || reviewMode) ? (
            <div className={sidebarStyles.quizContainer}>
              <div className={sidebarStyles.quizHeaderCard}>
                <div className={sidebarStyles.quizHeader}>
                  <h1 className={sidebarStyles.quizTitle}>
                    {selectedTechObj?.name?.charAt(0).toUpperCase() +
                      selectedTechObj?.name?.slice(1)}{" "}
                    -{" "}
                    {selectedLevel.charAt(0).toUpperCase() +
                      selectedLevel.slice(1)}{" "}
                    {reviewMode && (
                      <span className={sidebarStyles.reviewModeBadge}>
                        Review Mode
                      </span>
                    )}
                  </h1>
                  <div className={sidebarStyles.statsGrid}>
                    <div
                      className={`${sidebarStyles.timerDisplay} ${timeColor}`}
                    >
                      <Clock size={16} />
                      <span className={sidebarStyles.timerText}>
                        {isSubmitted || reviewMode
                          ? "00:00"
                          : formatTime(timeLeft)}
                      </span>
                    </div>
                    <span className={sidebarStyles.questionBadge}>
                      Question {currentQuestion + 1} of {questions.length}
                    </span>
                  </div>
                </div>

                <div className={sidebarStyles.mainProgressBarContainer}>
                  <div
                    className={sidebarStyles.mainProgressBar}
                    style={{
                      width: `${((currentQuestion + 1) / (questions.length || 1)) * 100}%`,
                    }}
                  />
                </div>

                <div className={sidebarStyles.questionIndicators}>
                  {questions.map((_, index) => {
                    const isCurrent = index === currentQuestion;
                    const status = getQuestionStatus(index);

                    let statusColors;

                    if (reviewMode) {
                      if (status === "correct") {
                        statusColors = {
                          bgColor: "bg-green-100",
                          textColor: "text-green-700",
                        };
                      } else if (status === "incorrect") {
                        statusColors = {
                          bgColor: "bg-red-100",
                          textColor: "text-red-700",
                        };
                      } else {
                        statusColors = {
                          bgColor: "bg-amber-100",
                          textColor: "text-amber-700",
                        };
                      }
                    } else {
                      statusColors = getQuestionStatusColor(status, false);
                    }

                    const isAnswered =
                      userAnswers[index] !== undefined &&
                      userAnswers[index] !== -1;

                    const borderColor = isCurrent
                      ? sidebarStyles.currentQuestion
                      : "";

                    const indicatorExtraClass = isAnswered
                      ? "filled-indicator"
                      : "";

                    return (
                      <button
                        key={index}
                        onClick={() => handleDirectQuestionClick(index)}
                        className={`${sidebarStyles.questionIndicator} ${statusColors.bgColor} ${statusColors.textColor} ${borderColor} ${indicatorExtraClass}`}
                        title={`Question ${index + 1}`}
                        disabled={!isQuizStarted && !reviewMode}
                      >
                        {index + 1}
                      </button>
                    );
                  })}
                </div>

                {!isSubmitted && !reviewMode && timeLeft < 60 && (
                  <div className={sidebarStyles.timeWarning}>
                    <AlertCircle
                      size={16}
                      className={sidebarStyles.warningIcon}
                    />
                    Less than 1 minute remaining!
                  </div>
                )}
              </div>

              <div
                className={`${sidebarStyles.questionCard} ${
                  isCurrentAnswered ? "filled-question" : ""
                }`}
              >
                <div className={sidebarStyles.questionHeader}>
                  <div className={sidebarStyles.questionIconContainer}>
                    <div className={sidebarStyles.questionIcon}>
                      <Target size={24} />
                    </div>
                    <div>
                      <h2 className={sidebarStyles.questionTextContainer}>
                        {currentQ.question}
                      </h2>
                    </div>
                  </div>

                  {reviewMode ? (
                    <div
                      className={`${sidebarStyles.statusBadge} ${
                        answerFeedback.isCorrect
                          ? "bg-linear-to-r from-emerald-100 to-teal-100 text-emerald-700"
                          : answerFeedback.userAnswer !== undefined &&
                              answerFeedback.userAnswer !== -1
                            ? "bg-linear-to-r from-rose-100 to-pink-100 text-rose-700"
                            : "bg-linear-to-r from-amber-100 to-orange-100 text-amber-700"
                      }`}
                    >
                      {answerFeedback.isCorrect
                        ? "Correct"
                        : answerFeedback.userAnswer !== undefined &&
                            answerFeedback.userAnswer !== -1
                          ? "Incorrect"
                          : "Unattempted"}
                    </div>
                  ) : null}
                </div>

                <div className={sidebarStyles.optionsContainer}>
                  {currentQ?.options?.map((option, index) => {
                    const isSelected = userAnswers[currentQuestion] === index;
                    const isCorrect = index === currentQ.correctAnswer;
                    const showFeedback = reviewMode || isSubmitted;

                    const optionStyle = getOptionButtonStyle(
                      isSelected,
                      isCorrect,
                      showFeedback,
                      index,
                      currentQ.correctAnswer,
                    );

                    return (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={!isQuizStarted || isSubmitted || reviewMode}
                        className={`${sidebarStyles.optionButton} ${
                          optionStyle.buttonClass
                        } ${
                          isQuizStarted && !isSubmitted && !reviewMode
                            ? `${sidebarStyles.optionButtonHover}`
                            : sidebarStyles.optionButtonDisabled
                        }`}
                      >
                        <div className={sidebarStyles.optionContent}>
                          <div
                            className={`${sidebarStyles.optionRadio} ${optionStyle.radioClass}`}
                          >
                            {!showFeedback && isSelected && (
                              <div className="w-2 h-2 rounded-full bg-white" />
                            )}
                            {showFeedback &&
                              (isCorrect ? (
                                <CheckCircle size={16} className="text-white" />
                              ) : isSelected ? (
                                <XCircle size={16} className="text-white" />
                              ) : null)}
                          </div>
                          <span
                            className={`${sidebarStyles.optionText} ${optionStyle.textClass}`}
                          >
                            {option}
                          </span>

                          {showFeedback && isCorrect && (
                            <span className={sidebarStyles.correctAnswerBadge}>
                              Correct Answer
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {reviewMode && (
                  <div className={sidebarStyles.explanationContainer}>
                    <div className={sidebarStyles.explanationHeader}>
                      <BarChart3
                        size={20}
                        className={sidebarStyles.explanationIcon}
                      />
                      <span className={sidebarStyles.explanationTitle}>
                        Explanation
                      </span>
                    </div>
                    <div className={sidebarStyles.explanationContent}>
                      <p className={sidebarStyles.explanationText}>
                        {answerFeedback.isCorrect
                          ? "Your answer is correct!"
                          : answerFeedback.userAnswer !== undefined &&
                              answerFeedback.userAnswer !== -1
                            ? `Your answer was incorrect. The correct answer is option ${
                                answerFeedback.correctAnswer + 1
                              }.`
                            : `This question was unattempted. The correct answer is option ${
                                answerFeedback.correctAnswer + 1
                              }.`}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className={sidebarStyles.navButtonsContainer}>
                <button
                  onClick={() => handleQuestionNavigation("prev")}
                  disabled={
                    currentQuestion === 0 || (!isQuizStarted && !reviewMode)
                  }
                  className={`${sidebarStyles.prevButton} ${
                    currentQuestion === 0 || (!isQuizStarted && !reviewMode)
                      ? sidebarStyles.prevButtonDisabled
                      : sidebarStyles.prevButtonEnabled
                  }`}
                >
                  <ArrowLeft size={18} />
                  <span>Previous Question</span>
                </button>

                <div className={sidebarStyles.navRightContainer}>
                  {!isSubmitted &&
                    !reviewMode &&
                    isQuizStarted &&
                    currentQuestion < questions.length - 1 && (
                      <button
                        onClick={() => setCurrentQuestion(currentQuestion + 1)}
                        className={sidebarStyles.nextButton}
                      >
                        <span>Next Question</span>
                        <ArrowRight size={18} />
                      </button>
                    )}

                  {questions.length > 0 && isQuizStarted && !reviewMode && (
                    <button
                      onClick={handleSubmitQuiz}
                      className={`${sidebarStyles.submitButton} ${
                        isSubmitted
                          ? sidebarStyles.submitButtonResults
                          : sidebarStyles.submitButtonQuiz
                      } ${!isAuthenticated ? "bg-amber-500" : ""}`}
                    >
                      {!isAuthenticated
                        ? "Login to Submit"
                        : isSubmitted
                          ? "See Results"
                          : "Submit Quiz"}
                    </button>
                  )}

                  {reviewMode && (
                    <button
                      onClick={() => {
                        setReviewMode(false);
                        setShowResults(true);
                      }}
                      className={sidebarStyles.backToResultsButton}
                    >
                      Back to Results
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className={sidebarStyles.loadingState}>
              <div className={sidebarStyles.loadingCard}>
                <div className={sidebarStyles.loadingSpinner} />
                <h3 className={sidebarStyles.loadingText}>
                  Preparing Your Quiz
                </h3>
                <p className={sidebarStyles.loadingSubtext}>
                  Loading questions and setting up timer...
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {showSubmitModal && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowSubmitModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-105 max-w-[92vw] animate-[scaleIn_0.25s_ease]">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-orange-500" size={26} />
              <h3 className="text-xl font-semibold text-slate-800">
                Submit Quiz?
              </h3>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              Once submitted, you cannot change your answers. Unattempted
              questions will be marked as incomplete.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmSubmit}
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold shadow-md"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {showRestartModal && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowRestartModal(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-105 max-w-[92vw] animate-[scaleIn_0.25s_ease]">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-500" size={26} />
              <h3 className="text-xl font-semibold text-slate-800">
                Restart Quiz?
              </h3>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              All your progress for this technology/level will be lost. Timer
              will start fresh from the beginning.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowRestartModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={confirmRestart}
                className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition font-semibold shadow-md"
              >
                Restart Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowLoginModal(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl p-8 w-105 max-w-[92vw] animate-[scaleIn_0.25s_ease]">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-amber-500" size={26} />
              <h3 className="text-xl font-semibold text-slate-800">
                Login Required
              </h3>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed">
              Please login to start or submit the quiz.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowLoginModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowLoginModal(false);
                  navigate("/login");
                }}
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-semibold shadow-md"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{cssStyles + extraCss}</style>
    </div>
  );
};

export default Sidebar;
