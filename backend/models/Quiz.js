import mongoose from "mongoose";

// Exam families a test series can belong to ("tech" = the original tech-skills series)
export const EXAM_CATEGORY_IDS = [
  "tech",
  "ssc",
  "gate",
  "banking",
  "railways",
  "upsc",
  "defence",
  "teaching",
  "state-psc",
];

const LETTERS = ["A", "B", "C", "D"];

// One question. `type` decides which answer fields apply:
//   mcq -> options + answerKey           (single correct, the original format)
//   msq -> options + answerKeys          (one or more correct)
//   nat -> natMin / natMax               (numerical answer range, no options)
// Text fields accept Markdown and LaTeX ($...$) so papers with maths / tables / figures work.
const questionSchema = new mongoose.Schema({
  type: { type: String, enum: ["mcq", "msq", "nat"], default: "mcq" },
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: { type: [String], default: [] },
  answerKey: { type: String, enum: LETTERS },
  answerKeys: { type: [String], default: undefined },
  natMin: Number,
  natMax: Number,
  marks: { type: Number, min: 0 }, // per-question marks (falls back to the quiz default)
  negativeMarks: { type: Number, min: 0 }, // per-question penalty (falls back to the quiz rule)
  topic: { type: String, trim: true, default: "General" }, // section / subject
  explanation: { type: String, trim: true },
});

// Throwing (instead of calling next) works on every Mongoose version
questionSchema.pre("validate", function () {
  const type = this.type || "mcq";
  if (type === "nat") {
    if (!Number.isFinite(this.natMin) || (this.natMax != null && !Number.isFinite(this.natMax))) {
      throw new Error("Numerical questions need a valid answer");
    }
    return;
  }
  if (!Array.isArray(this.options) || this.options.length !== 4 || !this.options.every((o) => o && o.trim())) {
    throw new Error("Each question must contain 4 valid options");
  }
  if (type === "mcq" && !LETTERS.includes(this.answerKey)) {
    throw new Error("Choose the correct answer");
  }
  if (type === "msq" && !(this.answerKeys?.length && this.answerKeys.every((k) => LETTERS.includes(k)))) {
    throw new Error("Choose at least one correct option");
  }
});


questionSchema.virtual("answerText").get(function () {
  const map = { A: 0, B: 1, C: 2, D: 3 };
  return this.options?.[map[this.answerKey]];
});


const quizSchema = new mongoose.Schema(
  {
    technology: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    level: {
      type: String,
      enum: ["Basic", "Intermediate", "Advanced"],
      required: true,
    },
    timeLimit: {
      type: Number,
      required: true,
      min: 1,
    },
    questions: {
      type: [questionSchema],
      required: true,
    },
    totalQuestions: Number,

    // ---- exam-prep fields (optional, safe defaults keep old quizzes working) ----
    category: {
      type: String,
      enum: EXAM_CATEGORY_IDS,
      lowercase: true,
      trim: true,
      default: "tech",
    },
    examName: { type: String, trim: true }, // display name, e.g. "SSC CGL"
    showSections: { type: Boolean, default: false }, // group questions into sections by topic
    marksPerQuestion: { type: Number, default: 1, min: 0 },
    negativeMarking: { type: Number, default: 0, min: 0 }, // marks deducted per wrong answer

    createdBy: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);


quizSchema.index({ technology: 1, level: 1 }, { unique: true });

export default mongoose.model("Quiz", quizSchema);