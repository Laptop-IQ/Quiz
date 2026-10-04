import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ContactUs from "./pages/ContactUs";
import VerifyOtp from "./components/VerifyOtp";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./pages/Profile";
import axios from "axios";
import NotificationBar from "./Context/NotificationBar";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import SeriesInstructions from "./pages/SeriesInstructions";
import SeriesStart from "./pages/SeriesStart";
import ExamEngine from "./pages/ExamEngine";
import TestSeries from "./pages/TestSeries";
import MyResultPage from "./pages/MyResultPage";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./components/DashboardShell/DashboardLayout";
import RequireAuth from "./components/RequireAuth";
import AttemptedTests from "./pages/AttemptedTests";
import DashboardTestSeries from "./pages/DashboardTestSeries";
import DashboardPractice from "./pages/DashboardPractice";
import ComingSoon from "./pages/ComingSoon";

const API_BASE = import.meta.env.VITE_API_BASE;

// to get transaction from localstorage
const getTransactionsFromStorage = () => {
  const saved = localStorage.getItem("transactions");
  return saved ? JSON.parse(saved) : [];
};

// to protect the routes
const ProtectedRoute = ({ user, children }) => {
  const localToken = localStorage.getItem("token");
  const sessionToken = sessionStorage.getItem("token");
  const hasToken = localToken || sessionToken;

  if (!user || !hasToken) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);
  return null;
};

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const persistAuth = (userObj, tokenStr, remember = false) => {
    try {
      if (remember) {
        if (userObj) localStorage.setItem("user", JSON.stringify(userObj));
        if (tokenStr) localStorage.setItem("token", tokenStr);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("token");
      } else {
        if (userObj) sessionStorage.setItem("user", JSON.stringify(userObj));
        if (tokenStr) sessionStorage.setItem("token", tokenStr);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
      setUser(userObj || null);
      setToken(tokenStr || null);
    } catch (err) {
      console.error("persistAuth error:", err);
    }
  };

  const clearAuth = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
    } catch (error) {
      console.error("clearAuth error:", error); // fixed variable name
    }
    setUser(null);
    setToken(null);
  };

  // to update user data both in state and storage
  const updateUserData = (updatedUser) => {
    setUser(updatedUser);

    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("token");

    if (localToken) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else if (sessionToken) {
      sessionToken.setItem("user", JSON.stringify(updatedUser));
    }
  };
  // try to load user with token when mounted

  useEffect(() => {
    (async () => {
      try {
        const localUserRaw = localStorage.getItem("user");
        const sessionUserRaw = sessionStorage.getItem("user");
        const localToken = localStorage.getItem("token");
        const sessionToken = sessionStorage.getItem("token");

        const storedUser = localUserRaw
          ? JSON.parse(localUserRaw)
          : sessionUserRaw
            ? JSON.parse(sessionUserRaw)
            : null;
        const storedToken = localToken || sessionToken || null;
        const tokenFromlocal = !!localToken;
        if (storedUser) {
          setUser(storedUser);
          setToken(storedToken);
          setIsLoading(false);
          return;
        }
        if (storedToken) {
          try {
            const res = await axios.get(`${API_BASE}/user/me`, {
              headers: { Authorization: `Bearer ${storedToken}` },
            });
            const profile = res.data;
            persistAuth(profile, storedToken, tokenFromlocal);
          } catch (fetchErr) {
            console.warn(
              "Could not fetch profile with the stored token:",
              fetchErr,
            );
            clearAuth();
          }
        }
      } catch (err) {
        console.error("error bootstrapping auth", err);
      } finally {
        setIsLoading(false);
        try {
          setTransactions(getTransactionsFromStorage());
        } catch (txErr) {
          console.error("Error loading transactions :", txErr);
        }
      }
    })();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("transactions", JSON.stringify(transactions));
    } catch (err) {
      console.error("error saving transactions:", err);
    }
  }, [transactions]);

  const handleLogin = (
    userData,
    remember = false,
    tokenFromApi = null,
    redirectTo = "/dashboard",
  ) => {
    persistAuth(userData, tokenFromApi, remember);
    navigate(redirectTo);
  };

  const handleSignup = (userData, remember = false, tokenFromApi = null) => {
    persistAuth(userData, tokenFromApi, remember);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  // transaction helpers
  const addTransaction = (newTransaction) =>
    setTransactions((p) => [newTransaction, ...p]);
  const editTransaction = (id, updatedTransaction) =>
    setTransactions((p) =>
      p.map((t) => (t.id === id ? { ...updatedTransaction, id } : t)),
    );
  const deleteTransaction = (id) =>
    setTransactions((p) => p.filter((t) => t.id !== id));
  const refreshTransactions = () =>
    setTransactions(getTransactionsFromStorage());

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <ScrollToTop />
      <NotificationBar />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/signup" element={<Signup onSignup={handleSignup} />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/" element={<Landing />} />
        <Route path="/quiz" element={<Home />} />
        <Route path="/test-series" element={<TestSeries />} />
        <Route path="/test-series/:techId" element={<SeriesInstructions />} />
        <Route path="/test-series/:techId/start" element={<SeriesStart />} />
        <Route path="/exam/:techId/:level" element={<ExamEngine />} />
        <Route path="/result" element={<MyResultPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="test-series" element={<DashboardTestSeries />} />
          <Route path="practice" element={<DashboardPractice />} />
          <Route path="attempted-tests" element={<AttemptedTests />} />
          <Route path="coming-soon" element={<ComingSoon />} />
        </Route>

        <Route>
          <Route
            path="/profile"
            element={
              <Profile
                user={user}
                onUpdateProfile={updateUserData}
                onLogout={handleLogout}
              />
            }
          />
          <Route path="/ContactUs" element={<ContactUs />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to={user ? "/" : "/login"} replace />}
        />
      </Routes>
    </>
  );
};

export default App;
