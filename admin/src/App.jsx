import React, { useEffect, useState } from 'react'
import { Link, BrowserRouter, Route, Routes, useLocation,} from "react-router-dom";
import Home from "./pages/Home";
import DashboardPage from './pages/DashboardPage';
import Listpage from './pages/Listpage';
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminForgotPassword from "./pages/admin/AdminForgotPassword";
import AdminVerifyOtp from "./pages/admin/AdminVerifyOtp";
import AdminResetPassword from "./pages/admin/AdminResetPassword";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";


// to protect the route
function RequireAuth({ children }) {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("clerkToken");

    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setIsChecking(false);
  }, []);

  // 🔄 Loading State
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-sm text-gray-600">Loading...</div>
      </div>
    );
  }

  // ❌ Not Logged In
  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen font-mono flex items-center justify-center bg-linear-to-b
        from-purple-50 via-white to-purple-100 px-4"
      >
        <div className="text-center">
          <p className="text-emerald-800 font-semibold text-lg sm:text-2xl mb-4">
            Please login to continue
          </p>

          <Link
            to="/"
            state={{ from: location }}
            className="px-4 py-2 text-sm rounded-full bg-purple-600 text-white shadow-sm hover:bg-purple-700 hover:shadow-md transition-all duration-300 ease-in-out animate-pulse"
          >
            Home
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Authorized
  return children;
}



const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/list" element={<Listpage />} />
      <Route path="/admin/signup" element={<AdminSignup />} />
      <Route path="/admin/verify-otp" element={<AdminVerifyOtp />} />
      <Route path="/login" element={<AdminLogin />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPassword />} />
      <Route path="/admin/reset-password" element={<AdminResetPassword />} />
    </Routes>
  );
}

export default App