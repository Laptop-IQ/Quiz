import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Cpu,
  FileText,
  Filter,
  Plus,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react";
import { useApi } from "../services/api/api.js";
import { listPageStyles } from "../assets/dummyStyles";

const List = () => {
  const { request } = useApi();

  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    techId: null,
    techName: "",
  });
  const [technologies, setTechnologies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [animateBorder, setAnimateBorder] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const toastTimerRef = useRef(null);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const data = await request("/admin/quizzes");
        const formatted = data.map((q) => ({
          id: q._id,
          name: q.technology,
          level: q.level,
          timeLimit: q.timeLimit,
          questions: q.totalQuestions,
          uploadDate: q.createdAt,
          color: "bg-linear-to-r from-cyan-500 to-blue-500",
          icon: <Cpu className="w-5 h-5 md:w-6 md:h-6" />,
          status: "active",
          stars: 4.5,
        }));
        setTechnologies(formatted);
      } catch (err) {
        console.log("FETCH ERROR", err);
      }
    };

    loadQuizzes();
  }, [request]);

  useEffect(() => {
    setAnimateBorder(true);

    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const deleteTechnology = async (id) => {
    try {
      const techToDelete = technologies.find((t) => t.id === id);
      await request(`/admin/quiz/${id}`, "DELETE");
      setTechnologies((prev) => prev.filter((tech) => tech.id !== id));

      setToast({
        visible: true,
        message: `${techToDelete?.name || "Item"} deleted`,
        type: "success",
      });

      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
      toastTimerRef.current = setTimeout(() => {
        setToast((t) => ({ ...t, visible: false }));
      }, 3000);
    } catch (err) {
      console.error("DELETE ERROR:", err);
    }
  };

  const closeToast = () => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast((t) => ({
      ...t,
      visible: false,
    }));
  };

  const getLevelColor = (level) => {
    switch (level) {
      case "Basic":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Intermediate":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "Advanced":
        return "bg-rose-50 text-rose-700 border-rose-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case "Basic":
        return <CheckCircle className={listPageStyles.levelIconBase} />;
      case "Intermediate":
        return <AlertCircle className={listPageStyles.levelIconBase} />;
      case "Advanced":
        return <XCircle className={listPageStyles.levelIconBase} />;
      default:
        return null;
    }
  };

  const formatUploadDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  const filteredTechnologies = technologies.filter((tech) => {
    const matchesSearch = tech.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLevel =
      selectedLevel === "All" || tech.level === selectedLevel;

    return matchesSearch && matchesLevel;
  });

  return (
    <div className={listPageStyles.page}>
      <style>{listPageStyles.customCSS}</style>

      <div className={listPageStyles.container}>
        <div className={listPageStyles.headerWrapper}>
          <div className={listPageStyles.headerInner}>
            <h1 className={listPageStyles.title}>Tech Quiz Master</h1>
            <p className={listPageStyles.subtitle}>
              Create, manage and review technology quizzes with an intuitive
              responsive layout.
            </p>
          </div>

          <div className={listPageStyles.searchContainer}>
            <div
              className={`${listPageStyles.animatedBorderBase} ${
                animateBorder ? listPageStyles.animatedBorderActive : ""
              }`}
            />

            <div className={listPageStyles.inputWrapper}>
              <div className="relative">
                <Search className={listPageStyles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search Technologies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`${listPageStyles.inputBase} ${
                    selectedLevel !== "All"
                      ? listPageStyles.inputBorderTransparent
                      : listPageStyles.inputBorder
                  }`}
                />
              </div>
            </div>

            <div className={listPageStyles.filterWrapper}>
              <div className="flex items-center gap-2">
                <Filter className={listPageStyles.filterIcon} />
                <select
                  value={selectedLevel}
                  onChange={(e) => {
                    const v = e.target.value;
                    setSelectedLevel(v);
                    setAnimateBorder(v === "All");
                  }}
                  className={listPageStyles.select}
                  style={{
                    WebkitAppearance: "none",
                    MozAppearance: "none",
                    appearance: "none",
                  }}
                >
                  <option value="All">All Levels</option>
                  <option value="Basic">Basic</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <div aria-live="polite" className={listPageStyles.toastContainer}>
          <div
            className={`${listPageStyles.toastOuter} ${
              toast.visible
                ? listPageStyles.toastVisible
                : listPageStyles.toastHidden
            }`}
          >
            <div className={listPageStyles.toastInner}>
              <div className={listPageStyles.toastIconBox}>
                <CheckCircle className={listPageStyles.toastIcon} />
              </div>
              <div className="flex-1">
                <p className={listPageStyles.toastMessage}>{toast.message}</p>
              </div>
              <button
                onClick={closeToast}
                className={listPageStyles.toastClose}
                aria-label="Close notification"
              >
                <X className={listPageStyles.toastCloseIcon} />
              </button>
            </div>
          </div>
        </div>

        <div className={listPageStyles.grid}>
          {filteredTechnologies.map((tech, index) => (
            <div
              key={tech.id}
              className={listPageStyles.cardGroup}
              style={{
                animationDelay: `${index * 70}ms`,
              }}
            >
              <div className={listPageStyles.card}>
                <div className={`${listPageStyles.cardHeader} ${tech.color}`}>
                  <div className={listPageStyles.cardHeaderInner}>
                    <div className={listPageStyles.cardHeaderLeft}>
                      <div className={listPageStyles.iconWrapper}>
                        {tech.icon}
                      </div>

                      <div className="min-w-0">
                        <h3 className={listPageStyles.techName}>{tech.name}</h3>
                      </div>
                    </div>

                    <div className="mt-3 sm:mt-0">
                      <div
                        className={`${listPageStyles.levelBadgeBase} ${getLevelColor(
                          tech.level,
                        )}`}
                      >
                        {getLevelIcon(tech.level)}
                        <span className="font-bold lg:mt-1 lg:text-center">
                          {tech.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={listPageStyles.cardBody}>
                  <div className={listPageStyles.cardBodyContent}>
                    <div className={listPageStyles.statsGrid}>
                      <div
                        className={`${listPageStyles.statCardBase} ${listPageStyles.statCardTime}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`${listPageStyles.statIconBox} ${listPageStyles.statIconBoxBlue}`}
                          >
                            <Clock
                              className={`${listPageStyles.statIcon} ${listPageStyles.statIconBlue}`}
                            />
                          </div>
                          <div>
                            <p className={listPageStyles.statLabel}>Time</p>
                            <p className={listPageStyles.statValue}>
                              {tech.timeLimit} min
                            </p>
                          </div>
                        </div>
                      </div>

                      <div
                        className={`${listPageStyles.statCardBase} ${listPageStyles.statCardQuestions}`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`${listPageStyles.statIconBox} ${listPageStyles.statIconBoxEmerald}`}
                          >
                            <FileText
                              className={`${listPageStyles.statIcon} ${listPageStyles.statIconEmerald}`}
                            />
                          </div>
                          <div>
                            <p className={listPageStyles.statLabel}>
                              Questions
                            </p>
                            <p className={listPageStyles.statValue}>
                              {tech.questions}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`${listPageStyles.statCardBase} ${listPageStyles.statCardDate}`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`${listPageStyles.statIconBox} ${listPageStyles.statIconBoxPurple}`}
                        >
                          <Calendar
                            className={`${listPageStyles.statIcon} ${listPageStyles.statIconPurple}`}
                          />
                        </div>
                        <div>
                          <p className={listPageStyles.statLabel}>Uploaded</p>
                          <p className={listPageStyles.statValue}>
                            {formatUploadDate(tech.uploadDate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={listPageStyles.cardFooter}>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setConfirmDelete({
                            open: true,
                            techId: tech.id,
                            techName: tech.name,
                          })
                        }
                        className={listPageStyles.deleteButton}
                      >
                        <Trash2 className={listPageStyles.trashIcon} />
                        <span className={listPageStyles.deleteText}>
                          Delete
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTechnologies.length === 0 && (
          <div className={listPageStyles.emptyStateContainer}>
            <div className={listPageStyles.emptyBlurWrapper}>
              <div className={listPageStyles.emptyBlurCircle}></div>
            </div>

            <div className={listPageStyles.emptyContent}>
              <div className={listPageStyles.emptyIconBox}>
                <FileText className={listPageStyles.emptyIcon} />
              </div>

              <h3 className={listPageStyles.emptyTitle}>
                No technologies found
              </h3>

              <p className={listPageStyles.emptyText}>
                {searchTerm || selectedLevel !== "All"
                  ? "Try adjusting your search or filter to find what you're looking for."
                  : "Get Started by creating your first technology quiz."}
              </p>

              <a href="/dashboard" className={listPageStyles.emptyButton}>
                <Plus className={listPageStyles.emptyButtonIcon} />
                <span className={listPageStyles.emptyButtonText}>
                  Create First Quiz
                </span>
              </a>
            </div>
          </div>
        )}

        {confirmDelete.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl p-6 w-[90%] max-w-md shadow-xl">
              <h3 className="text-lg font-semibold mb-2">Delete Quiz?</h3>

              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{confirmDelete.techName}</span>?
                This action cannot be undone.
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    setConfirmDelete({
                      open: false,
                      techId: null,
                      techName: "",
                    })
                  }
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    deleteTechnology(confirmDelete.techId);
                    setConfirmDelete({
                      open: false,
                      techId: null,
                      techName: "",
                    });
                  }}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
