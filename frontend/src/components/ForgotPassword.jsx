import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleSendOTP = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/user/forgot-password`, {
        email,
      });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/user/verify-forgot-otp`, {
        email,
        otp,
        newPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-teal-50 to-emerald-50 px-4">
      <div className="bg-white/30 backdrop-blur-lg border border-teal-200 max-w-md w-full p-8 rounded-3xl shadow-xl">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Forgot Password
        </h2>

        {message && (
          <p className="text-green-600 mb-4 text-center font-medium">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 mb-4 text-center font-medium">{error}</p>
        )}

        {step === 1 && (
          <>
            <button
              onClick={() => navigate("/login")}
              className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
            >
              ← Back
            </button>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 mb-6 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition shadow-sm"
            />

            <button
              onClick={handleSendOTP}
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-linear-to-r from-teal-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg transition-all flex justify-center items-center"
            >
              {isLoading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <button
              onClick={() => setStep(1)}
              className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
            >
              ← Back
            </button>

            {/* OTP Boxes */}
            <div className="flex justify-center space-x-3 mb-6">
              {[...Array(6)].map((_, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  value={otp[idx] || ""}
                  onChange={(e) => {
                    const val = e.target.value.replace(/[^0-9]/g, "");
                    if (!val) return;
                    const newOtp = otp.split("");
                    newOtp[idx] = val;
                    setOtp(newOtp.join(""));
                    if (idx < 5) {
                      const next = document.getElementById(`otp-${idx + 1}`);
                      next && next.focus();
                    }
                  }}
                  id={`otp-${idx}`}
                  className="w-13 h-13 text-center text-lg font-medium border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 shadow-sm transition"
                />
              ))}
            </div>

            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-4 mb-6 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-400 transition shadow-sm"
            />

            <button
              onClick={handleVerifyOTP}
              disabled={isLoading}
              className="w-full p-4 rounded-lg bg-linear-to-r from-teal-500 to-emerald-600 text-white font-semibold shadow-md hover:shadow-lg transition-all flex justify-center items-center"
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
