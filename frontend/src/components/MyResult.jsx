import React, { useState, useEffect, useMemo } from "react";
import {
  resultPageStyles,
  getColorClass,
  colorClasses,
  getBadgeClasses,
  getBadgeText,
} from "../assets/dummyStyles";
import { useApi } from "../services/api/api.js";

// Badge component
const Badge = ({ percent }) => {
  const classes = getBadgeClasses(percent);
  const text = getBadgeText(percent);
  return <span className={classes}>{text}</span>;
};

// StripCard component
function StripCard({ item, open, onToggle }) {
  const percent = item.totalQuestions
    ? Math.round((item.correct / item.totalQuestions) * 100)
    : 0;

  const colorKey = getColorClass(percent);
  const colors = colorClasses[colorKey];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTimeTaken = (seconds) => {
    if (!seconds || seconds <= 0) return "0s";
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs === 0 ? `${mins}m` : `${mins}m ${secs}s`;
    }
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${mins}m ${secs}s`;
  };

  return (
    <article onClick={onToggle} className={resultPageStyles.stripCard(colors)}>
      <div className={resultPageStyles.stripCardAccent(colors)} />

      <div className={resultPageStyles.stripCardContent}>
        <div className={resultPageStyles.stripCardTopRow}>
          <div className="flex items-center gap-3 min-w-0">
            <div className={resultPageStyles.stripCardIconContainer(colors)}>
              <span className={resultPageStyles.stripCardIconText}>
                {item.title.split(" ")[1]?.[0] || item.title[0]}
              </span>
            </div>
          </div>

          <div className={resultPageStyles.stripCardTitleContainer}>
            <h3 className={resultPageStyles.stripCardTitle}>{item.title}</h3>
            <div className={resultPageStyles.stripCardSubtitle}>
              {item.totalQuestions} Questions
            </div>
          </div>
        </div>
      </div>

      <div className={resultPageStyles.stripCardPercentContainer}>
        <div className={resultPageStyles.stripCardPercent(colors)}>
          {percent}%
        </div>
        <div className={resultPageStyles.stripCardBadgeContainer}>
          <Badge percent={percent} />
        </div>
      </div>
    </article>
  );
}

// Main ResultPage component
export default function ResultPage() {
  const { request } = useApi();
  const [results, setResults] = useState([]);
  const [openStates, setOpenStates] = useState({});
  const [showAll, setShowAll] = useState(false);

  const makeKey = (r) => `${r.id}||${r.title}`;

  useEffect(() => {
    const loadResults = async () => {
      const data = await request("/result/my-result");
      const formatted = data.map((r) => ({
        ...r,
        title: `${r.technology.toUpperCase()} ${
          r.level.charAt(0).toUpperCase() + r.level.slice(1)
        }`,
      }));
      setResults(formatted);
      setOpenStates(
        formatted.reduce((acc, r) => ({ ...acc, [makeKey(r)]: false }), {}),
      );
    };
    loadResults();
  }, [request]);

  const summary = useMemo(() => {
    const totalQs = results.reduce((s, r) => s + (r.totalQuestions || 0), 0);
    const totalCorrect = results.reduce((s, r) => s + (r.correct || 0), 0);
    const totalWrong = results.reduce((s, r) => s + (r.wrong || 0), 0);
    const totalTimeTaken = results.reduce((s, r) => s + (r.timeTaken || 0), 0);
    const pct = totalQs ? Math.round((totalCorrect / totalQs) * 100) : 0;
    return { totalQs, totalCorrect, totalWrong, totalTimeTaken, pct };
  }, [results]);

  const { headingTitle } = useMemo(() => {
    const tracks = Array.from(
      new Set(
        results.map((r) => (r.title || "").split(" ")[0]).filter(Boolean),
      ),
    );
    let headingTitle = "Quiz Results";
    if (tracks.length === 1) {
      headingTitle = `Quiz Results — ${tracks[0]} Track`;
    } else if (tracks.length === 2) {
      headingTitle = `Quiz Results — ${tracks.join(" & ")} Tracks`;
    } else if (tracks.length > 2) {
      headingTitle = `Quiz Results — Multiple Tracks`;
    }
    return { headingTitle };
  }, [results]);

  const grouped = useMemo(() => {
    const map = {};
    results.forEach((r) => {
      const track = (r.title || "").split(" ")[0] || "General";
      if (!map[track]) map[track] = [];
      map[track].push(r);
    });
    return map;
  }, [results]);

  const toggle = (k) => setOpenStates((s) => ({ ...s, [k]: !s[k] }));
  const toggleAll = () => {
    const to = !showAll;
    setShowAll(to);
    setOpenStates(
      results.reduce((acc, r) => ({ ...acc, [makeKey(r)]: to }), {}),
    );
  };

  return (
    <section>
      <h2>{headingTitle}</h2>
      <button onClick={toggleAll}>
        {showAll ? "Collapse All" : "Expand All"}
      </button>
      {Object.entries(grouped).map(([track, items]) => (
        <div key={track}>
          <h3>{track}</h3>
          {items.map((item) => (
            <StripCard
              key={makeKey(item)}
              item={item}
              open={openStates[makeKey(item)]}
              onToggle={() => toggle(makeKey(item))}
            />
          ))}
        </div>
      ))}
      <footer>
        <p>
          Total: {summary.totalQs} | Correct: {summary.totalCorrect} | Wrong:{" "}
          {summary.totalWrong} | Time: {summary.totalTimeTaken}s | Accuracy:{" "}
          {summary.pct}%
        </p>
      </footer>
    </section>
  );
}
