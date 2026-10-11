import Result from "../models/Result.js";
import Quiz from "../models/Quiz.js";
import { gradeAttempt } from "../utils/grading.js";

const round2 = (n) => Math.round(n * 100) / 100;

// CREATE RESULT
export const CreateMyResult = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ use JWT middleware

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    const quiz = await Quiz.findOne({
      technology: String(req.body.technology || "").toLowerCase(),
      level: req.body.level,
    })
      .select("category marksPerQuestion negativeMarking questions")
      .lean();

    // Grade on the server from the candidate's raw responses (MCQ / MSQ / NAT, per-question
    // marks) so a score can never be forged from the client.
    let correct = Number(req.body.correct) || 0;
    let wrong = Number(req.body.wrong) || 0;
    let total = Number(req.body.totalQuestions) || 0;
    const marksPerQuestion = quiz?.marksPerQuestion ?? 1;
    const negativeMarking = quiz?.negativeMarking ?? 0;
    let marksObtained = round2(correct * marksPerQuestion - wrong * negativeMarking);
    let totalMarks = round2(total * marksPerQuestion);
    let questionAnalysis = req.body.questionAnalysis;

    const responses = req.body.responses;
    if (quiz && responses && typeof responses === "object" && !Array.isArray(responses)) {
      const graded = gradeAttempt(quiz, responses);
      ({ correct, wrong, marksObtained, totalMarks } = graded);
      total = graded.total;
      if (Array.isArray(questionAnalysis)) {
        questionAnalysis = questionAnalysis.map((item, i) =>
          graded.results[i]
            ? { ...item, type: graded.results[i].type, status: graded.results[i].status, awarded: graded.results[i].awarded, marks: graded.results[i].max }
            : item,
        );
      }
    }

    const result = await Result.create({
      ...req.body,
      userId,
      category: quiz?.category || "tech",
      totalQuestions: total,
      correct,
      wrong,
      marksPerQuestion,
      negativeMarking,
      marksObtained,
      totalMarks,
      questionAnalysis,
    });

    res.json(result);
  } catch (err) {
    console.log("CREATE RESULT ERROR:", err);
    res.status(500).json({ error: err.message }); // better debugging
  }
};

// Only the sub-fields needed to derive metrics - question text and options (the
// heaviest part of every attempt) are never loaded for the list view.
const LIST_FIELDS =
  "technology level category totalQuestions correct wrong timeTaken startDate createdAt updatedAt " +
  "marksPerQuestion negativeMarking marksObtained totalMarks " +
  "questionAnalysis.topic questionAnalysis.status questionAnalysis.timeTaken";

// Turns one stored attempt into display-ready, real metrics.
const summarizeResult = (doc) => {
  const qa = Array.isArray(doc.questionAnalysis) ? doc.questionAnalysis : [];
  const { questionAnalysis, ...rest } = doc; // eslint-disable-line no-unused-vars

  const total = doc.totalQuestions || qa.length || 0;
  const correct = doc.correct ?? qa.filter((q) => q.status === "correct").length;
  const wrong = doc.wrong ?? qa.filter((q) => q.status === "wrong").length;
  const attempted = Math.min(total || correct + wrong, correct + wrong);
  const skipped = Math.max(0, total - attempted);

  // Older attempts of untimed quizzes were saved with timeTaken = 0; the
  // per-question timings recorded in the same attempt give the real value.
  const analysedTime = qa.reduce((sum, q) => sum + (q.timeTaken || 0), 0);
  const timeTaken = doc.timeTaken > 0 ? doc.timeTaken : Math.round(analysedTime);

  // Topic breakdown -> the topics that actually need work
  const topics = {};
  qa.forEach((q) => {
    const name = q.topic || "General";
    const t = (topics[name] ??= { topic: name, total: 0, correct: 0, wrong: 0, skipped: 0 });
    t.total += 1;
    if (q.status === "correct") t.correct += 1;
    else if (q.status === "wrong") t.wrong += 1;
    else t.skipped += 1;
  });
  const topicList = Object.values(topics).filter((t) => t.topic !== "General");
  const weakTopics = topicList
    .map((t) => ({ ...t, accuracy: Math.round((t.correct / t.total) * 100) }))
    .filter((t) => t.accuracy < 60)
    .sort((a, b) => a.accuracy - b.accuracy || b.total - a.total)
    .slice(0, 3);

  // Marks per the exam's scheme; attempts saved before this existed fall back to 1 mark, no penalty
  const marksPerQuestion = doc.marksPerQuestion ?? 1;
  const negativeMarking = doc.negativeMarking ?? 0;
  const marks = doc.marksObtained ?? round2(correct * marksPerQuestion - wrong * negativeMarking);
  const totalMarks = doc.totalMarks ?? round2(total * marksPerQuestion);

  return {
    ...rest,
    category: doc.category || "tech",
    totalQuestions: total,
    correct,
    wrong,
    skipped,
    attempted,
    marks,
    totalMarks,
    marksPerQuestion,
    negativeMarking,
    // score % is marks-based, so negative marking is reflected (never below 0)
    score: totalMarks ? Math.max(0, Math.round((marks / totalMarks) * 100)) : 0,
    // accuracy = how many of the questions you actually answered were right
    accuracy: attempted ? Math.round((correct / attempted) * 100) : 0,
    timeTaken,
    avgTimePerQuestion: total ? Math.round(timeTaken / total) : 0,
    topicsTracked: topicList.length > 0,
    weakTopics,
  };
};

// GET MY RESULTS
export const getMyResults = async (req, res) => {
  try {
    const userId = req.user.id; // ✅ same here

    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }

    // ?full=1 returns the untouched documents (with every question + option)
    if (req.query.full === "1") {
      const full = await Result.find({ userId }).sort({ createdAt: -1 }).lean();
      return res.json(full);
    }

    const docs = await Result.find({ userId })
      .select(LIST_FIELDS)
      .sort({ createdAt: -1 })
      .lean();

    res.json(docs.map(summarizeResult));
  } catch (err) {
    console.log("GET RESULT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};
