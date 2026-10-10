import { Navigate, Outlet, Route, createBrowserRouter, createRoutesFromElements } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import AdminLayout from "./components/AdminLayout";
import Home from "./pages/Home";
import Overview from "./pages/Overview";
import Quizzes from "./pages/Quizzes";
import QuizEditor from "./pages/QuizEditor";
import Users from "./pages/Users";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import AdminVerifyOtp from "./pages/admin/AdminVerifyOtp";
import AdminResetPassword from "./pages/admin/AdminResetPassword";

const Root = () => (
  <ToastProvider>
    <Outlet />
  </ToastProvider>
);

// A data router (not <BrowserRouter>) so the quiz editor can warn about unsaved changes
export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Root />}>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/verify-otp" element={<AdminVerifyOtp />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
      <Route path="/admin/reset-password" element={<AdminResetPassword />} />

      {/* everything below needs an admin session */}
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Overview />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/quizzes/new" element={<QuizEditor />} />
        <Route path="/quizzes/:id" element={<QuizEditor />} />
        <Route path="/users" element={<Users />} />
        <Route path="/list" element={<Navigate to="/quizzes" replace />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>,
  ),
);
