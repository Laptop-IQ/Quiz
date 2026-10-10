
import QuizApp from "../components/Sidebar";

// Practice, browsed from inside the dashboard shell (sidebar stays visible).
// QuizApp is the same quiz-taking widget used at /quiz, minus its own Navbar.
const DashboardPractice = () => (
  <div className="-m-4 sm:-m-6">
    <QuizApp />
  </div>
);

export default DashboardPractice;
