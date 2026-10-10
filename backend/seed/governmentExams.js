/**
 * Sample government-exam test series (SSC CGL, IBPS PO, RRB NTPC, GATE CSE).
 *
 *   node seed/governmentExams.js          -> validate + upsert into MongoDB
 *   node seed/governmentExams.js --check  -> validate only (no database needed)
 *
 * These are SMALL DEMO sets (10 questions each) so the new exam categories,
 * negative marking and marks-based results can be seen working straight away.
 * Replace / extend them with your own question bank (admin upload accepts the
 * same fields: category, examName, marksPerQuestion, negativeMarking).
 */
import "dotenv/config";
import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";

const LETTERS = ["A", "B", "C", "D"];
const q = (topic, question, options, answer) => ({
  topic,
  question,
  options,
  answerKey: LETTERS[answer],
});

const QUANT = "Quantitative Aptitude";
const REASON = "Reasoning";
const ENGLISH = "English";
const GA = "General Awareness";

export const QUIZZES = [
  {
    technology: "ssc-cgl",
    examName: "SSC CGL",
    category: "ssc",
    level: "Basic",
    timeLimit: 15,
    marksPerQuestion: 2,
    negativeMarking: 0.5,
    questions: [
      q(QUANT, "What is 15% of 240?", ["32", "36", "38", "40"], 1),
      q(QUANT, "A train 120 m long passes a pole in 6 seconds. What is its speed in km/h?", ["54", "60", "72", "80"], 2),
      q(QUANT, "The simple interest on ₹5,000 at 8% per annum for 3 years is:", ["₹1,000", "₹1,200", "₹1,400", "₹1,500"], 1),
      q(QUANT, "If x + 1/x = 3, then x² + 1/x² equals:", ["7", "5", "9", "11"], 0),
      q(REASON, "Find the next number: 2, 6, 12, 20, 30, ?", ["40", "42", "44", "46"], 1),
      q(REASON, "Choose the odd one out: Apple, Mango, Potato, Banana", ["Apple", "Mango", "Potato", "Banana"], 2),
      q(REASON, "If A=1, B=2, C=3 and so on, what is the sum of the letters in 'BAD'?", ["5", "6", "8", "7"], 3),
      q(ENGLISH, "Choose the synonym of 'ABUNDANT':", ["Plentiful", "Scarce", "Rare", "Limited"], 0),
      q(ENGLISH, "Fill in the blank: She ___ to school every day.", ["go", "goes", "going", "gone"], 1),
      q(GA, "Who is known as the Father of the Indian Constitution?", ["Mahatma Gandhi", "Jawaharlal Nehru", "Dr. B. R. Ambedkar", "Sardar Vallabhbhai Patel"], 2),
    ],
  },
  {
    technology: "ibps-po",
    examName: "IBPS PO",
    category: "banking",
    level: "Basic",
    timeLimit: 12,
    marksPerQuestion: 1,
    negativeMarking: 0.25,
    questions: [
      q(QUANT, "What is 25% of 480?", ["120", "100", "110", "125"], 0),
      q(QUANT, "The average of 12, 18, 24 and 30 is:", ["20", "21", "22", "24"], 1),
      q(QUANT, "A sum of money doubles itself in 5 years at simple interest. The rate of interest per annum is:", ["20%", "10%", "15%", "25%"], 0),
      q(QUANT, "Two numbers are in the ratio 3 : 5 and their sum is 160. The larger number is:", ["60", "80", "120", "100"], 3),
      q(REASON, "Rahul walks 5 km north, then turns right and walks 3 km. In which direction is he from his starting point?", ["North-east", "North-west", "South-east", "South-west"], 0),
      q(REASON, "Find the next number: 3, 9, 27, 81, ?", ["162", "243", "324", "729"], 1),
      q(REASON, "Which letter comes next? A, C, E, G, ?", ["H", "J", "I", "K"], 2),
      q(ENGLISH, "Choose the antonym of 'BRAVE':", ["Cowardly", "Bold", "Fearless", "Heroic"], 0),
      q(ENGLISH, "Choose the correctly spelt word:", ["Accomodation", "Acommodation", "Acomodation", "Accommodation"], 3),
      q(QUANT, "12 men can complete a piece of work in 8 days. How many days will 16 men take to complete it?", ["4", "6", "5", "8"], 1),
    ],
  },
  {
    technology: "rrb-ntpc",
    examName: "RRB NTPC",
    category: "railways",
    level: "Basic",
    timeLimit: 12,
    marksPerQuestion: 1,
    negativeMarking: 0.33,
    questions: [
      q("Mathematics", "The LCM of 12 and 18 is:", ["24", "36", "48", "72"], 1),
      q("Mathematics", "The HCF of 36 and 48 is:", ["6", "8", "24", "12"], 3),
      q("Mathematics", "The square root of 1764 is:", ["44", "48", "42", "36"], 2),
      q("Mathematics", "An article bought for ₹800 is sold for ₹1,000. The profit percentage is:", ["25%", "20%", "30%", "32%"], 0),
      q("General Intelligence & Reasoning", "Find the next number: 1, 4, 9, 16, 25, ?", ["30", "35", "49", "36"], 3),
      q("General Intelligence & Reasoning", "Doctor : Hospital :: Teacher : ?", ["Court", "School", "Farm", "Bank"], 1),
      q("General Intelligence & Reasoning", "Choose the odd one out:", ["Square", "Triangle", "Cube", "Circle"], 2),
      q(GA, "Who was the first Prime Minister of independent India?", ["Sardar Vallabhbhai Patel", "Jawaharlal Nehru", "Lal Bahadur Shastri", "Dr. Rajendra Prasad"], 1),
      q(GA, "Which planet is known as the Red Planet?", ["Venus", "Jupiter", "Saturn", "Mars"], 3),
      q("General Science", "The SI unit of force is:", ["Joule", "Watt", "Newton", "Pascal"], 2),
    ],
  },
  {
    technology: "gate-cse",
    examName: "GATE CSE",
    category: "gate",
    level: "Basic",
    timeLimit: 15,
    marksPerQuestion: 1,
    negativeMarking: 0.33,
    questions: [
      q("Algorithms", "The worst-case time complexity of binary search on a sorted array of n elements is:", ["O(n)", "O(log n)", "O(n log n)", "O(1)"], 1),
      q("Data Structures", "Which data structure follows the Last-In-First-Out (LIFO) principle?", ["Queue", "Linked list", "Stack", "Heap"], 2),
      q("Discrete Mathematics", "The number of edges in a complete undirected graph with n vertices is:", ["n²", "n(n + 1)/2", "n − 1", "n(n − 1)/2"], 3),
      q("Digital Logic", "The binary representation of the decimal number 13 is:", ["1011", "1101", "1110", "1001"], 1),
      q("DBMS", "Which normal form removes partial functional dependencies?", ["1NF", "3NF", "BCNF", "2NF"], 3),
      q("Algorithms", "The worst-case time complexity of Quick Sort is:", ["O(n log n)", "O(n²)", "O(n)", "O(log n)"], 1),
      q("Operating Systems", "Which CPU scheduling algorithm, used without aging, can cause starvation of low-priority processes?", ["First Come First Serve", "Round Robin", "Priority Scheduling", "None of these"], 2),
      q("Engineering Mathematics", "A fair coin is tossed three times. The probability of getting exactly two heads is:", ["1/8", "1/2", "3/4", "3/8"], 3),
      q("Digital Logic", "How many 2-input NAND gates are needed to implement a NOT gate?", ["1", "2", "3", "4"], 0),
      q("Data Structures", "The maximum number of nodes in a binary tree of height h (root at height 0) is:", ["2^h", "2^h − 1", "2^(h+1)", "2^(h+1) − 1"], 3),
    ],
  },
];

// Fail loudly on malformed content before anything touches the database
const validate = () => {
  QUIZZES.forEach((quiz) => {
    if (quiz.questions.length === 0) throw new Error(`${quiz.examName}: no questions`);
    quiz.questions.forEach((item, i) => {
      const where = `${quiz.examName} Q${i + 1}`;
      if (item.options.length !== 4) throw new Error(`${where}: needs exactly 4 options`);
      if (new Set(item.options).size !== 4) throw new Error(`${where}: duplicate options`);
      if (!LETTERS.includes(item.answerKey)) throw new Error(`${where}: bad answer key`);
    });
  });
};

const run = async () => {
  validate();
  const total = QUIZZES.reduce((n, quiz) => n + quiz.questions.length, 0);
  console.log(`Validated ${QUIZZES.length} quizzes / ${total} questions`);
  if (process.argv.includes("--check")) return;

  await mongoose.connect(process.env.MONGODB_URI);
  for (const quiz of QUIZZES) {
    await Quiz.findOneAndUpdate(
      { technology: quiz.technology, level: quiz.level },
      { ...quiz, totalQuestions: quiz.questions.length, createdBy: "seed" },
      { upsert: true, new: true, runValidators: true },
    );
    console.log(`Upserted ${quiz.examName} (${quiz.level})`);
  }
  await mongoose.disconnect();
};

run().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
