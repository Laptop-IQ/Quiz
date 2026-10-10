import { lazy, Suspense, useEffect, useState } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import RequireAuth from "./components/RequireAuth";
import PageTitle from "./components/PageTitle";
import { lazyPage } from "./routes/pages";

// Route-level code splitting: each page is its own chunk, loaded on demand.
const NotificationBar = lazy(() => import("./Context/NotificationBar"));
const Login = lazyPage("Login");
const Signup = lazyPage("Signup");
const VerifyOtp = lazyPage("VerifyOtp");
const ForgotPassword = lazyPage("ForgotPassword");
const Landing = lazyPage("Landing");
const TestSeries = lazyPage("TestSeries");
const SeriesInstructions = lazyPage("SeriesInstructions");
const SeriesStart = lazyPage("SeriesStart");
const ExamEngine = lazyPage("ExamEngine");
const MyResultPage = lazyPage("MyResultPage");
const ResultAnalysis = lazyPage("ResultAnalysis");
const DashboardLayout = lazyPage("DashboardLayout");
const Dashboard = lazyPage("Dashboard");
const DashboardTestSeries = lazyPage("DashboardTestSeries");
const AttemptedTests = lazyPage("AttemptedTests");
const ComingSoon = lazyPage("ComingSoon");
const Profile = lazyPage("Profile");
const ContactUs = lazyPage("ContactUs");

const FullPageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
  </div>
);

const API_BASE = import.meta.env.VITE_API_BASE;

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location.pathname]);
  return null;
};

const readStoredAuth = () => {
  try {
    const raw = localStorage.getItem("user") || sessionStorage.getItem("user");
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return { user: raw ? JSON.parse(raw) : null, token };
  } catch {
    return { user: null, token: null };
  }
};

const App = () => {
  const [user, setUser] = useState(() => readStoredAuth().user);
  // Only wait on the network when there is a token but no cached profile
  const [isLoading, setIsLoading] = useState(() => {
    const { user: u, token } = readStoredAuth();
    return !u && !!token;
  });

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
      console.error("clearAuth error:", error);
    }
    setUser(null);
  };

  // to update user data both in state and storage
  const updateUserData = (updatedUser) => {
    setUser(updatedUser);

    const localToken = localStorage.getItem("token");
    const sessionToken = sessionStorage.getItem("token");

    if (localToken) {
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else if (sessionToken) {
      sessionStorage.setItem("user", JSON.stringify(updatedUser));
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
        const tokenFromLocal = !!localToken;
        if (storedUser) {
          // already initialised synchronously above
          setIsLoading(false);
          return;
        }
        if (storedToken) {
          try {
            const res = await axios.get(`${API_BASE}/user/me`, {
              headers: { Authorization: `Bearer ${storedToken}` },
            });
            const profile = res.data;
            persistAuth(profile, storedToken, tokenFromLocal);
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
      }
    })();
  }, []);

  const handleLogin = (
    userData,
    remember = false,
    tokenFromApi = null,
  ) => {
    persistAuth(userData, tokenFromApi, remember);
    // SaaS-style entry point: every successful login starts at Dashboard.
    navigate("/dashboard", { replace: true });
  };

  const handleSignup = (userData, remember = false, tokenFromApi = null) => {
    persistAuth(userData, tokenFromApi, remember);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

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
      <PageTitle />
      <Suspense fallback={null}>
        <NotificationBar />
      </Suspense>
      <Suspense fallback={<FullPageLoader />}>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/dashboard" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/signup"
          element={user ? <Navigate to="/dashboard" replace /> : <Signup onSignup={handleSignup} />}
        />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/" element={<Landing />} />
        <Route path="/test-series" element={<TestSeries />} />
        <Route path="/test-series/:techId" element={<SeriesInstructions />} />
        <Route path="/test-series/:techId/start" element={<SeriesStart />} />
        <Route path="/exam/:techId/:level" element={<ExamEngine />} />
        <Route path="/result" element={<MyResultPage />} />
        <Route path="/result/analysis" element={<ResultAnalysis />} />
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
          <Route path="attempted-tests" element={<AttemptedTests />} />
          <Route path="coming-soon" element={<ComingSoon />} />
        </Route>

        {/* Authenticated users stay inside the SaaS dashboard area. */}
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route
            index
            element={
              <Profile
                user={user}
                onUpdateProfile={updateUserData}
                onLogout={handleLogout}
              />
            }
          />
        </Route>

        <Route
          path="/contact"
          element={
            <RequireAuth>
              <DashboardLayout />
            </RequireAuth>
          }
        >
          <Route index element={<ContactUs />} />
        </Route>

        <Route path="/ContactUs" element={<Navigate to="/contact" replace />} />

        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
      </Suspense>
    </>
  );
};

export default App;
