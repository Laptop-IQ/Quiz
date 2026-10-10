import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, //for a particular user can see
    technology: String,
    level: String,

    category: { type: String, default: "tech" },

    totalQuestions: Number,
    correct: Number,
    wrong: Number,

    // marks as per the exam's marking scheme (computed on the server)
    marksPerQuestion: Number,
    negativeMarking: Number,
    marksObtained: Number,
    totalMarks: Number,

    timeTaken: Number,
    startDate: Date,
    questionAnalysis: [
      {
        questionNumber: Number,
        text: String,
        options: [String],
        topic: String,
        correctIndex: Number,
        yourIndex: { type: Number, default: null },
        status: { type: String, enum: ["correct", "wrong", "skipped"] },
        timeTaken: Number,
      },
    ],
  },
  { timestamps: true },
);

// Every results query filters by user and sorts by newest
resultSchema.index({ userId: 1, createdAt: -1 });

const Result = mongoose.model("Result", resultSchema);
export default Result;