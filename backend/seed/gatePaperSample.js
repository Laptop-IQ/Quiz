/**
 * Sample GATE-pattern paper (original practice questions, 13 questions / 20 marks).
 * Shows every feature of the paper engine: MCQ, MSQ and NAT questions, 1- and 2-mark
 * questions, LaTeX maths, a table, an inline figure, sections and negative marking.
 *
 *   node seed/gatePaperSample.js          -> validate + upsert into MongoDB
 *   node seed/gatePaperSample.js --check  -> validate only (no database needed)
 *   node seed/gatePaperSample.js --json   -> write seed/gate-sample-paper.json (importable in the admin panel)
 */
import "dotenv/config";
import fs from "fs";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";
import { gradeAttempt, correctIndices } from "../utils/grading.js";

const GA = "General Aptitude";
const MATH = "Engineering Mathematics";
const CS = "Computer Science";

const svg = (w, h, inner) =>
  `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" font-family="serif" font-size="14">${inner}</svg>`,
  ).toString("base64")}`;
const square = svg(
  230, 150,
  `<rect x="30" y="25" width="110" height="110" fill="none" stroke="black" stroke-width="2"/>` +
    `<line x1="30" y1="25" x2="140" y2="135" stroke="black" stroke-dasharray="4 3"/>` +
    `<text x="14" y="22">P</text><text x="146" y="22">Q</text><text x="146" y="150">R</text><text x="14" y="150">S</text>` +
    `<text x="70" y="85" font-size="12">2 cm</text>`,
);

const mcq = (topic, question, options, answerKey, extra = {}) => ({ type: "mcq", topic, question, options, answerKey, ...extra });
const msq = (topic, question, options, answerKeys, extra = {}) => ({ type: "msq", topic, question, options, answerKeys, ...extra });
const nat = (topic, question, natMin, natMax, extra = {}) => ({ type: "nat", topic, question, natMin, ...(natMax !== undefined ? { natMax } : {}), ...extra });

export const QUIZ = {
  technology: "gate-sample",
  examName: "GATE Sample Paper",
  category: "gate",
  level: "Advanced",
  timeLimit: 30,
  marksPerQuestion: 1,
  negativeMarking: 0.33, // 1/3 for a 1-mark MCQ, 2/3 (0.66) for a 2-mark MCQ - applied automatically
  showSections: true,
  questions: [
    // ---------- General Aptitude ----------
    mcq(GA, "If $3x - 5 = 16$, then $x$ equals", ["$5$", "$6$", "$7$", "$8$"], "C", { explanation: "$3x = 21 \\Rightarrow x = 7$." }),
    mcq(GA, "Choose the word closest in meaning to **CANDID**.", ["Frank", "Secretive", "Rude", "Shy"], "A"),
    nat(GA, "A train travels 150 km in 2.5 hours. Its average speed (in km/h) is ____", 60),
    mcq(GA, "The ages of A and B are in the ratio $3:5$. After 6 years the ratio becomes $2:3$. A's present age (in years) is", ["$12$", "$15$", "$18$", "$21$"], "C", { marks: 2, explanation: "Let the ages be $3k$ and $5k$. $\\frac{3k+6}{5k+6}=\\frac{2}{3} \\Rightarrow k = 6$, so A is $18$." }),
    msq(GA, "Which of the following numbers are perfect squares?", ["$144$", "$200$", "$225$", "$250$"], ["A", "C"], { marks: 2 }),
    mcq(GA, `In the figure, PQRS is a square of side 2 cm. The length of the diagonal PR (in cm) is\n\n![square PQRS](${square})`, ["$2$", "$2\\sqrt{2}$", "$4$", "$\\sqrt{2}$"], "B", { marks: 2, explanation: "$PR = \\sqrt{2^2 + 2^2} = 2\\sqrt{2}$." }),
    // ---------- Subject ----------
    mcq(MATH, "The determinant of the matrix $\\begin{pmatrix} 2 & 1 \\\\ 3 & 4 \\end{pmatrix}$ is", ["$5$", "$11$", "$-5$", "$8$"], "A", { explanation: "$2\\cdot 4 - 1\\cdot 3 = 5$." }),
    mcq(MATH, "$\\displaystyle \\lim_{x \\to 0} \\frac{\\sin x}{x}$ equals", ["$0$", "$1$", "$\\infty$", "$-1$"], "B"),
    mcq(MATH, "The solution of $\\dfrac{dy}{dx} = 2x$ with $y(0) = 3$ is", ["$y = x^2 + 3$", "$y = 2x^2 + 3$", "$y = x^2 - 3$", "$y = 2x + 3$"], "A", { marks: 2 }),
    nat(CS, "The number of edges in a complete graph on 7 vertices is ____", 21),
    nat(MATH, "The sum of the first 20 natural numbers is ____", 210, undefined, { marks: 2 }),
    msq(CS, "Which of the following are linear data structures?", ["Array", "Binary tree", "Linked list", "Graph"], ["A", "C"], { marks: 2 }),
    mcq(MATH, "The table gives the values of a function $f$.\n\n| $x$ | 1 | 2 | 3 |\n|---|---|---|---|\n| $f(x)$ | 2 | 5 | 10 |\n\nWhich of the following is $f(x)$?", ["$x^2 + 1$", "$2x$", "$x + 1$", "$3x - 1$"], "A", { marks: 2, explanation: "$1^2+1=2,\\ 2^2+1=5,\\ 3^2+1=10$." }),
  ],
};

// Fail loudly before anything touches the database
const validate = async () => {
  await new Quiz({ ...QUIZ, createdBy: "seed" }).validate();

  // A candidate who answers everything correctly must score the full marks
  const responses = {};
  QUIZ.questions.forEach((q, i) => {
    if (q.type === "nat") responses[i] = String(q.natMin);
    else if (q.type === "msq") responses[i] = correctIndices(q);
    else responses[i] = correctIndices(q)[0];
  });
  const g = gradeAttempt(QUIZ, responses);
  if (g.correct !== QUIZ.questions.length || g.marksObtained !== g.totalMarks) {
    throw new Error(`Answer keys do not grade as fully correct (${g.correct}/${QUIZ.questions.length})`);
  }
  QUIZ.questions.forEach((q, i) => {
    const texts = [q.question, q.explanation, ...(q.options || [])].filter(Boolean);
    texts.forEach((t) => {
      if ((t.replace(/\\\$/g, "").match(/\$/g) || []).length % 2) throw new Error(`Q${i + 1}: unbalanced $ in "${t.slice(0, 40)}"`);
    });
  });
  return g;
};

const run = async () => {
  const g = await validate();
  console.log(`Validated ${QUIZ.questions.length} questions / ${g.totalMarks} marks (full-marks check passed)`);

  if (process.argv.includes("--json")) {
    const out = fileURLToPath(new URL("./gate-sample-paper.json", import.meta.url));
    fs.writeFileSync(out, JSON.stringify({ questions: QUIZ.questions }, null, 2));
    console.log("Wrote", out);
    return;
  }
  if (process.argv.includes("--check")) return;

  await mongoose.connect(process.env.MONGODB_URI);
  await Quiz.findOneAndUpdate(
    { technology: QUIZ.technology, level: QUIZ.level },
    { ...QUIZ, totalQuestions: QUIZ.questions.length, createdBy: "seed" },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );
  console.log(`Upserted ${QUIZ.examName} (${QUIZ.level})`);
  await mongoose.disconnect();
};

// run only when executed directly (importing QUIZ elsewhere must not touch the database)
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  run().catch((err) => {
    console.error("Seed failed:", err.message);
    process.exit(1);
  });
}
