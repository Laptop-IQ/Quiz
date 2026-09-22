import React, { useState } from "react";
import { signupStyles } from "../assets/dummyStyles2";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API_BASE}/user/register`,
        { name, email, password },
        { headers: { "Content-Type": "application/json" } },
      );

      // signup success → redirect to OTP page
      navigate("/verify-otp", { state: { email } });
      setPassword("");
    } catch (err) {
      console.error("Signup error:", err?.response || err);
      if (err.response?.data?.errors) setErrors(err.response.data.errors);
      else if (err.response?.data?.message)
        setErrors({ api: err.response.data.message });
      else setErrors({ api: err.message || "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={signupStyles.pageContainer}>
      <div className={signupStyles.cardContainer}>
        <div className={signupStyles.header}>
          <button
            onClick={() => navigate(-1)}
            className={signupStyles.backButton}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className={signupStyles.avatar}>
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className={signupStyles.headerTitle}>Create Account</h1>
          <p className={signupStyles.headerSubtitle}>
            Join ExpenseTracker to manage your finances
          </p>
        </div>
        <div className={signupStyles.formContainer}>
          {errors.api && <p className={signupStyles.apiError}>{errors.api}</p>}
          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="mb-6">
              <label htmlFor="name" className={signupStyles.label}>
                Full Name
              </label>
              <div className={signupStyles.inputContainer}>
                <div className={signupStyles.inputIcon}>
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${signupStyles.input} ${errors.name ? "border-red-300" : "border-gray-200"}`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className={signupStyles.fieldError}>{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-6">
              <label htmlFor="email" className={signupStyles.label}>
                Email Address
              </label>
              <div className={signupStyles.inputContainer}>
                <div className={signupStyles.inputIcon}>
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${signupStyles.input} ${errors.email ? "border-red-300" : "border-gray-200"}`}
                  placeholder="your@example.com"
                />
              </div>
              {errors.email && (
                <p className={signupStyles.fieldError}>{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label htmlFor="password" className={signupStyles.label}>
                Password
              </label>
              <div className={signupStyles.inputContainer}>
                <div className={signupStyles.inputIcon}>
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${signupStyles.passwordInput} ${errors.password ? "border-red-300" : "border-gray-200"}`}
                  placeholder="💠💠💠💠💠💠"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={signupStyles.passwordToggle}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className={signupStyles.fieldError}>{errors.password}</p>
              )}
            </div>

            {/* Remember Me */}
            <div className={signupStyles.checkboxContainer}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={signupStyles.checkbox}
              />
              <label htmlFor="remember" className={signupStyles.checkboxLabel}>
                Remember Me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`${signupStyles.button} ${isLoading ? signupStyles.buttonDisabled : ""}`}
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Sign In Link */}
          <div className={signupStyles.signInContainer}>
            <p className={signupStyles.signInText}>
              Already have an account?{" "}
              <Link to="/login" className={signupStyles.signInLink}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
