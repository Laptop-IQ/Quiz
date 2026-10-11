import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";
import Quiz, { EXAM_CATEGORY_IDS } from "../models/Quiz.js";
import Result from "../models/Result.js";
import User from "../models/userModel.js";

const LETTERS = ["A", "B", "C", "D"];
const LEVELS = ["Basic", "Intermediate", "Advanced"];
const MAX_QUESTIONS = 500;

const round2 = (n) => Math.round(n * 100) / 100;
const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);
const isId = (id) => mongoose.isValidObjectId(id);
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// A validation problem the client can show as-is
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

const fail = (res, error, label) => {
  if (error instanceof HttpError) {
    return res.status(error.status).json({ success: false, message: error.message });
  }
  console.error(`${label} error:`, error);
  return res.status(500).json({ success: false, message: "Server error" });
};

// ---------- validation helpers ----------

// Returns clean questions or throws a message that names the failing question.
// Supports three types: mcq (one correct), msq (several correct), nat (numerical range).
const sanitizeQuestions = (questions) => {
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new HttpError(400, "A quiz needs at least one question");
  }
  if (questions.length > MAX_QUESTIONS) {
    throw new HttpError(400, `A quiz can have at most ${MAX_QUESTIONS} questions`);
  }
  return questions.map((q, i) => {
    const n = i + 1;
    const type = String(q?.type ?? "mcq").toLowerCase();
    if (!["mcq", "msq", "nat"].includes(type)) {
      throw new HttpError(400, `Question ${n}: unknown question type "${q?.type}"`);
    }

    const question = String(q?.question ?? "").trim();
    if (!question) throw new HttpError(400, `Question ${n}: the question text is empty`);
    if (question.length > 6000) throw new HttpError(400, `Question ${n}: the question text is too long`);

    const clean = { type, question };

    if (type === "nat") {
      const min = Number(q?.natMin);
      const max = q?.natMax === undefined || q?.natMax === null || q?.natMax === "" ? min : Number(q.natMax);
      if (!Number.isFinite(min) || !Number.isFinite(max)) {
        throw new HttpError(400, `Question ${n}: enter the numerical answer (or a valid range)`);
      }
      clean.options = [];
      clean.natMin = Math.min(min, max);
      clean.natMax = Math.max(min, max);
    } else {
      const options = Array.isArray(q?.options) ? q.options.map((o) => String(o ?? "").trim()) : [];
      if (options.length !== 4 || options.some((o) => !o)) {
        throw new HttpError(400, `Question ${n}: it needs exactly 4 non-empty options`);
      }
      if (options.some((o) => o.length > 2000)) {
        throw new HttpError(400, `Question ${n}: an option is too long`);
      }
      if (new Set(options.map((o) => o.toLowerCase())).size !== 4) {
        throw new HttpError(400, `Question ${n}: two options are identical`);
      }
      clean.options = options;

      if (type === "mcq") {
        const answerKey = String(q?.answerKey ?? "").trim().toUpperCase();
        if (!LETTERS.includes(answerKey)) {
          throw new HttpError(400, `Question ${n}: choose the correct answer (A, B, C or D)`);
        }
        clean.answerKey = answerKey;
      } else {
        const keys = [...new Set((Array.isArray(q?.answerKeys) ? q.answerKeys : []).map((k) => String(k).trim().toUpperCase()))]
          .filter((k) => LETTERS.includes(k))
          .sort();
        if (keys.length === 0) {
          throw new HttpError(400, `Question ${n}: choose at least one correct option`);
        }
        clean.answerKeys = keys;
      }
    }

    // optional per-question marks (otherwise the quiz defaults apply)
    if (q?.marks !== undefined && q.marks !== null && q.marks !== "") {
      const marks = Number(q.marks);
      if (!Number.isFinite(marks) || marks <= 0 || marks > 100) {
        throw new HttpError(400, `Question ${n}: marks must be above 0`);
      }
      clean.marks = round2(marks);
    }
    if (q?.negativeMarks !== undefined && q.negativeMarks !== null && q.negativeMarks !== "") {
      const neg = Number(q.negativeMarks);
      if (!Number.isFinite(neg) || neg < 0 || neg > 100) {
        throw new HttpError(400, `Question ${n}: negative marks cannot be below 0`);
      }
      clean.negativeMarks = round2(neg);
    }

    clean.topic = String(q?.topic ?? "").trim().slice(0, 80) || "General";
    const explanation = String(q?.explanation ?? "").trim().slice(0, 4000);
    if (explanation) clean.explanation = explanation;
    return clean;
  });
};

// Quiz-level settings shared by create and update (only the fields that were sent)
const readSettings = (body, { partial = false } = {}) => {
  const out = {};

  if (!partial || body.category !== undefined) {
    const category = String(body.category ?? "tech").toLowerCase();
    out.category = EXAM_CATEGORY_IDS.includes(category) ? category : "tech";
  }
  if (body.showSections !== undefined) {
    out.showSections = body.showSections === true || body.showSections === "true";
  }
  if (!partial || body.examName !== undefined) {
    out.examName = String(body.examName ?? "").trim().slice(0, 60) || undefined;
  }
  if (!partial || body.timeLimit !== undefined) {
    const timeLimit = Number(body.timeLimit);
    if (!Number.isFinite(timeLimit) || timeLimit < 1 || timeLimit > 600) {
      throw new HttpError(400, "Time limit must be between 1 and 600 minutes");
    }
    out.timeLimit = Math.round(timeLimit);
  }
  if (!partial || body.marksPerQuestion !== undefined) {
    const marks = body.marksPerQuestion === undefined ? 1 : Number(body.marksPerQuestion);
    if (!Number.isFinite(marks) || marks <= 0 || marks > 100) {
      throw new HttpError(400, "Marks per question must be greater than 0");
    }
    out.marksPerQuestion = round2(marks);
  }
  if (!partial || body.negativeMarking !== undefined) {
    const neg = body.negativeMarking === undefined ? 0 : Number(body.negativeMarking);
    if (!Number.isFinite(neg) || neg < 0 || neg > 100) {
      throw new HttpError(400, "Negative marking cannot be below 0");
    }
    out.negativeMarking = round2(neg);
  }
  return out;
};

// ---------- quizzes ----------

// Create a quiz, or replace the questions/settings of an existing one (same technology + level)
export const uploadQuiz = async (req, res) => {
  try {
    const technology = String(req.body.technology ?? "").trim().toLowerCase();
    const level = req.body.level;
    if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(technology)) {
      throw new HttpError(400, "Series ID may only contain letters, numbers and hyphens");
    }
    if (!LEVELS.includes(level)) throw new HttpError(400, "Choose a valid level");

    const settings = readSettings(req.body);
    const questions = sanitizeQuestions(req.body.questions);

    const existed = await Quiz.exists({ technology, level });
    const quiz = await Quiz.findOneAndUpdate(
      { technology, level },
      {
        technology,
        level,
        ...settings,
        questions,
        totalQuestions: questions.length,
        createdBy: String(req.admin?._id ?? req.auth?.userId ?? "admin"),
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );

    res.status(existed ? 200 : 201).json({
      success: true,
      replaced: !!existed,
      quiz: { _id: quiz._id, technology: quiz.technology, level: quiz.level },
    });
  } catch (error) {
    fail(res, error, "uploadQuiz");
  }
};

// All quizzes for the ADMIN table: metadata + attempt statistics (no question bodies)
export const getAdminQuizzes = async (req, res) => {
  try {
    const [quizzes, stats] = await Promise.all([
      Quiz.aggregate([
        {
          $project: {
            technology: 1,
            level: 1,
            timeLimit: 1,
            category: { $ifNull: ["$category", "tech"] },
            examName: 1,
            marksPerQuestion: { $ifNull: ["$marksPerQuestion", 1] },
            negativeMarking: { $ifNull: ["$negativeMarking", 0] },
            createdAt: 1,
            updatedAt: 1,
            questionCount: { $size: { $ifNull: ["$questions", []] } },
          },
        },
        { $sort: { updatedAt: -1 } },
      ]),
      Result.aggregate([
        {
          $group: {
            _id: { technology: "$technology", level: "$level" },
            attempts: { $sum: 1 },
            marks: { $sum: { $ifNull: ["$marksObtained", "$correct"] } },
            total: { $sum: { $ifNull: ["$totalMarks", "$totalQuestions"] } },
            avgTime: { $avg: "$timeTaken" },
          },
        },
      ]),
    ]);

    const statMap = new Map(stats.map((s) => [`${s._id.technology}|${s._id.level}`, s]));
    res.json(
      quizzes.map((q) => {
        const s = statMap.get(`${q.technology}|${q.level}`);
        return {
          ...q,
          attempts: s?.attempts ?? 0,
          avgScore: s && s.total > 0 ? Math.max(0, Math.round((s.marks / s.total) * 100)) : null,
          avgTime: s?.avgTime ? Math.round(s.avgTime) : null,
        };
      }),
    );
  } catch (error) {
    fail(res, error, "getAdminQuizzes");
  }
};

// One full quiz (with questions) for the editor
export const getQuizById = async (req, res) => {
  try {
    if (!isId(req.params.id)) throw new HttpError(404, "Quiz not found");
    const quiz = await Quiz.findById(req.params.id).lean();
    if (!quiz) throw new HttpError(404, "Quiz not found");
    res.json({
      ...quiz,
      category: quiz.category || "tech",
      marksPerQuestion: quiz.marksPerQuestion ?? 1,
      negativeMarking: quiz.negativeMarking ?? 0,
    });
  } catch (error) {
    fail(res, error, "getQuizById");
  }
};

// Edit settings and/or questions. Series ID + level are the quiz's identity and stay fixed.
export const updateQuiz = async (req, res) => {
  try {
    if (!isId(req.params.id)) throw new HttpError(404, "Quiz not found");

    const update = readSettings(req.body, { partial: true });
    if (req.body.questions !== undefined) {
      const questions = sanitizeQuestions(req.body.questions);
      update.questions = questions;
      update.totalQuestions = questions.length;
    }
    if (Object.keys(update).length === 0) throw new HttpError(400, "Nothing to update");

    const quiz = await Quiz.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).lean();
    if (!quiz) throw new HttpError(404, "Quiz not found");

    res.json({ success: true, quiz: { _id: quiz._id, technology: quiz.technology, level: quiz.level } });
  } catch (error) {
    fail(res, error, "updateQuiz");
  }
};

// Delete a quiz (users' saved results are kept)
export const deleteQuiz = async (req, res) => {
  try {
    if (!isId(req.params.id)) throw new HttpError(404, "Quiz not found");
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) throw new HttpError(404, "Quiz not found");
    res.json({ success: true, message: "Quiz deleted successfully!" });
  } catch (error) {
    fail(res, error, "deleteQuiz");
  }
};

// ---------- user-facing quiz endpoints ----------
// routes/userRoute.js imports these from here, so keep the names and behaviour stable.

// Full list including questions (what the exam flow and older clients expect)
export const getAllQuizzes = async (req, res) => {
  const quizzes = await Quiz.find().sort({ createdAt: -1 });
  res.json(quizzes);
};

// Light list for the Test Series pages: counts only, no questions or answer keys
export const getQuizSummaries = async (req, res) => {
  try {
    const rows = await Quiz.aggregate([
      {
        $project: {
          _id: 0,
          technology: 1,
          level: 1,
          timeLimit: 1,
          category: 1,
          examName: 1,
          marksPerQuestion: 1,
          negativeMarking: 1,
          questionCount: { $size: { $ifNull: ["$questions", []] } },
        },
      },
    ]);
    res.json(rows);
  } catch (error) {
    console.error("getQuizSummaries error:", error);
    res.status(500).json({ message: "Failed to fetch test series" });
  }
};

// One quiz (with questions) for the exam screen - avoids sending every quiz
export const getQuizByTechLevel = async (req, res) => {
  try {
    const technology = String(req.params.technology || "").toLowerCase().trim();
    const level = LEVELS.find((l) => l.toLowerCase() === String(req.params.level || "").toLowerCase().trim());
    if (!technology || !level) return res.status(404).json({ message: "Quiz not found" });

    const quiz = await Quiz.findOne({ technology, level }).lean();
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });
    res.json(quiz);
  } catch (error) {
    console.error("getQuizByTechLevel error:", error);
    res.status(500).json({ message: "Failed to fetch quiz" });
  }
};

// ---------- question images ----------

// Uploads a figure/diagram for use inside a question (Markdown image). Returns its URL.
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) throw new HttpError(400, "Choose an image to upload");
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      throw new HttpError(503, "Image upload is not configured on the server (Cloudinary credentials are missing)");
    }
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "quiz-questions", resource_type: "image" }, (err, r) => (err ? reject(err) : resolve(r)))
        .end(req.file.buffer);
    });
    res.json({ success: true, url: result.secure_url });
  } catch (error) {
    fail(res, error, "uploadImage");
  }
};

// ---------- overview ----------

export const getOverview = async (req, res) => {
  try {
    const d7 = daysAgo(7);
    const d30 = daysAgo(30);
    const start14 = new Date();
    start14.setUTCHours(0, 0, 0, 0);
    start14.setUTCDate(start14.getUTCDate() - 13);

    const scoreFields = {
      marks: { $sum: { $ifNull: ["$marksObtained", "$correct"] } },
      total: { $sum: { $ifNull: ["$totalMarks", "$totalQuestions"] } },
    };

    const [
      totalUsers,
      newUsers7d,
      verifiedUsers,
      seriesIds,
      quizCount,
      questionAgg,
      attempts,
      scoreAgg,
      activeIds,
      perDayRaw,
      topRaw,
      byCategory,
      recentAttemptsRaw,
      recentUsers,
      quizNames,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: d7 } }),
      User.countDocuments({ isVerified: true }),
      Quiz.distinct("technology"),
      Quiz.countDocuments(),
      Quiz.aggregate([
        { $group: { _id: null, n: { $sum: { $size: { $ifNull: ["$questions", []] } } } } },
      ]),
      Result.countDocuments(),
      Result.aggregate([{ $group: { _id: null, ...scoreFields, avgTime: { $avg: "$timeTaken" } } }]),
      Result.distinct("userId", { createdAt: { $gte: d30 } }),
      Result.aggregate([
        { $match: { createdAt: { $gte: start14 } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            attempts: { $sum: 1 },
          },
        },
      ]),
      Result.aggregate([
        {
          $group: {
            _id: { technology: "$technology", level: "$level" },
            attempts: { $sum: 1 },
            ...scoreFields,
          },
        },
        { $sort: { attempts: -1 } },
        { $limit: 5 },
      ]),
      Quiz.aggregate([
        { $group: { _id: { $ifNull: ["$category", "tech"] }, quizzes: { $sum: 1 } } },
        { $sort: { quizzes: -1 } },
      ]),
      Result.find()
        .sort({ createdAt: -1 })
        .limit(8)
        .select("userId technology level correct wrong totalQuestions marksObtained totalMarks timeTaken createdAt")
        .lean(),
      User.find()
        .sort({ createdAt: -1 })
        .limit(6)
        .select("name email isVerified createdAt")
        .lean(),
      Quiz.find().select("technology examName").lean(),
    ]);

    // last 14 days, zero-filled
    const perDayMap = new Map(perDayRaw.map((d) => [d._id, d.attempts]));
    const attemptsPerDay = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(start14);
      d.setUTCDate(d.getUTCDate() + i);
      const key = d.toISOString().slice(0, 10);
      return { date: key, attempts: perDayMap.get(key) || 0 };
    });

    // attach names to the recent attempts
    const ids = [...new Set(recentAttemptsRaw.map((r) => r.userId).filter(isId))];
    const people = ids.length ? await User.find({ _id: { $in: ids } }).select("name email").lean() : [];
    const personMap = new Map(people.map((u) => [String(u._id), u]));

    // exam display names ("SSC CGL") keyed by series id
    const nameOf = new Map(quizNames.map((q) => [q.technology, q.examName]));

    const pct = (marks, total) => (total > 0 ? Math.max(0, Math.round((marks / total) * 100)) : 0);
    const score = scoreAgg[0];

    res.json({
      success: true,
      users: { total: totalUsers, newThisWeek: newUsers7d, verified: verifiedUsers, active30d: activeIds.length },
      content: { series: seriesIds.length, quizzes: quizCount, questions: questionAgg[0]?.n ?? 0 },
      attempts: {
        total: attempts,
        avgScore: score ? pct(score.marks, score.total) : 0,
        avgTime: score?.avgTime ? Math.round(score.avgTime) : 0,
      },
      attemptsPerDay,
      topQuizzes: topRaw.map((t) => ({
        technology: t._id.technology,
        name: nameOf.get(t._id.technology) || null,
        level: t._id.level,
        attempts: t.attempts,
        avgScore: pct(t.marks, t.total),
      })),
      byCategory: byCategory.map((c) => ({ category: c._id, quizzes: c.quizzes })),
      recentAttempts: recentAttemptsRaw.map((r) => ({
        _id: r._id,
        user: personMap.get(String(r.userId))?.name || personMap.get(String(r.userId))?.email || "Deleted user",
        technology: r.technology,
        name: nameOf.get(r.technology) || null,
        level: r.level,
        score: pct(r.marksObtained ?? r.correct ?? 0, r.totalMarks ?? r.totalQuestions ?? 0),
        timeTaken: r.timeTaken || 0,
        createdAt: r.createdAt,
      })),
      recentUsers,
    });
  } catch (error) {
    fail(res, error, "getOverview");
  }
};

// ---------- users ----------

export const getUsers = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(5, parseInt(req.query.limit, 10) || 15));
    const search = String(req.query.search ?? "").trim().slice(0, 60);

    const filter = search
      ? {
          $or: [
            { name: { $regex: escapeRegex(search), $options: "i" } },
            { email: { $regex: escapeRegex(search), $options: "i" } },
          ],
        }
      : {};

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("name email isVerified createdAt profilePic")
        .lean(),
    ]);

    const ids = users.map((u) => String(u._id));
    const activity = ids.length
      ? await Result.aggregate([
          { $match: { userId: { $in: ids } } },
          { $group: { _id: "$userId", attempts: { $sum: 1 }, lastActive: { $max: "$createdAt" } } },
        ])
      : [];
    const activityMap = new Map(activity.map((a) => [a._id, a]));

    res.json({
      success: true,
      total,
      page,
      pages: Math.max(1, Math.ceil(total / limit)),
      users: users.map((u) => ({
        ...u,
        attempts: activityMap.get(String(u._id))?.attempts ?? 0,
        lastActive: activityMap.get(String(u._id))?.lastActive ?? null,
      })),
    });
  } catch (error) {
    fail(res, error, "getUsers");
  }
};

// Remove a user together with their saved results
export const deleteUser = async (req, res) => {
  try {
    if (!isId(req.params.id)) throw new HttpError(404, "User not found");
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new HttpError(404, "User not found");
    const { deletedCount } = await Result.deleteMany({ userId: String(user._id) });
    res.json({ success: true, message: "User deleted", resultsDeleted: deletedCount });
  } catch (error) {
    fail(res, error, "deleteUser");
  }
};
