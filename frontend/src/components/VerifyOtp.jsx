import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE;

const VerifyOtp = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef([]);
  const [error, setError] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [isLoading, setIsLoading] = useState(false);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (resendTimer > 0) {
      interval = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      const newOtp = [...otp];
      newOtp[index] = val.slice(-1);
      setOtp(newOtp);
      if (val && index < OTP_LENGTH - 1) inputRefs.current[index + 1].focus();
      if (!val && index > 0) inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpStr = otp.join("");
    if (otpStr.length !== OTP_LENGTH) {
      setError("Please enter complete OTP");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_BASE}/user/verify-signup-otp`, {
        email,
        otp: otpStr,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await axios.post(`${API_BASE}/user/resend-signup-otp`, { email });
      setResendTimer(60);
      alert("OTP resent successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-linear-to-br from-teal-50 to-emerald-50 p-4">
      <div className="bg-white/20 backdrop-blur-md border border-blue-300 max-w-md w-full p-8 rounded-lg shadow-xl shadow-blue-300 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Verify Your Account
        </h2>
        <p className="text-green-600 mb-6 text-center">
          Enter the 6-digit OTP sent to <strong>{email}</strong>
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center space-x-2 mb-6 w-full max-w-xs">
          {otp.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={digit}
              ref={(el) => (inputRefs.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              className="w-12 h-12 border border-gray-300 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-teal-400 transition"
            />
          ))}
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isLoading}
          className="w-full bg-linear-to-r from-teal-500 to-emerald-600 text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* Resend OTP */}
        <div className="flex justify-center items-center space-x-2 mt-2">
          <span className="text-gray-600 text-sm">Didn't receive OTP?</span>
          <button
            onClick={handleResend}
            disabled={resendTimer > 0}
            className={`text-blue-500 text-sm font-medium cursor-pointer ${
              resendTimer > 0 ? "opacity-50 cursor-not-allowed" : ""
            } transition`}
          >
            Resend {resendTimer > 0 ? `(${resendTimer}s)` : ""}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
