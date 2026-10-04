import {
  Home,
  ClipboardList,
  Clock,
  CheckCircle,
  Book,
  MonitorPlay,
  FileText,
  Bookmark,
  AlertTriangle,
  Trophy,
} from "lucide-react";

// `to` items are real, working pages. `soon: true` items open a
// "Coming Soon" placeholder, because this app doesn't have that
// feature yet (same idea as testbook.com gating premium tools).
export const MENU = [
  {
    section: "Main",
    items: [{ label: "Home", to: "/dashboard", icon: Home, end: true }],
  },
  {
    section: "Tests",
    items: [
      { label: "Test Series", to: "/dashboard/test-series", icon: ClipboardList },
      { label: "Practice", to: "/dashboard/practice", icon: Clock },
      { label: "Attempted Tests", to: "/dashboard/attempted-tests", icon: CheckCircle },
    ],
  },
  {
    section: "Learn",
    items: [
      { label: "Books", soon: true, icon: Book },
      { label: "Live Tests & Quizzes", soon: true, icon: MonitorPlay },
      { label: "Previous Year Papers", soon: true, icon: FileText },
    ],
  },
  {
    section: "Miscellaneous",
    items: [
      { label: "Saved Questions", soon: true, icon: Bookmark },
      { label: "Reported Questions", soon: true, icon: AlertTriangle },
      { label: "Rank Predictor", soon: true, icon: Trophy, badge: "NEW" },
    ],
  },
];
