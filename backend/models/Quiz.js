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

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  options: {
    type: [String],
    required: true,
    validate: {
      validator: (v) => v.length === 4 && v.every((opt) => opt && opt.trim()),
      message: "Each question must contain 4 valid options",
    },
  },
  answerKey: {
    type: String,
    enum: ["A", "B", "C", "D"],
    required: true,
  },
});


questionSchema.virtual("answerText").get(function () {
  const map = { A: 0, B: 1, C: 2, D: 3 };
  return this.options[map[this.answerKey]];
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