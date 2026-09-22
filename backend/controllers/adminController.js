import Quiz from "../models/Quiz.js";

const LETTERS = ["A", "B", "C", "D"];

// to create a quiz from CSV file
export const uploadQuiz = async (req, res) => {
  const { technology, level, timeLimit, questions } = req.body;
  const createdBy = req.auth?.userId;
  const quiz = await Quiz.findOneAndUpdate(
  {
    technology: technology.toLowerCase(),
    level
   },
   {
     technology,
     level,
     timeLimit,
     questions,
     totalQuestions: questions.length,
     createdBy
   },
   {
     new: true,
     upsert: true
   }

  );
res.json({success: true, quiz});
};

// to get all quiz stats
export const getAllQuizzes = async (req, res) => {
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    res.json(quizzes);
}


// to delete a quiz
export const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findByIdAndDelete(id);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }
    res.json({ success: true, message: "Quiz deleted successfully!" });
  } catch (error) {
    console.error("DELETE QUIZ ERROR:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }

}

