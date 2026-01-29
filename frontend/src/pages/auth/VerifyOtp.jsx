import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fromPath = location.state?.from || null;

  useEffect(() => {
    // If user refreshes and still has temp token cookie, they can verify.
    // Otherwise interceptor will redirect to /login.
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    const value = otp.trim();
    if (!value || value.length < 4) {
      setErrorMessage("Please enter the OTP sent to your email.");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axiosInstance.post("/user/auth/verifyOTP", {
        otp: value,
      });

      const redirectTo = data?.redirectTo ?? "/";
      navigate(redirectTo);
    } catch (err) {
      const msg = err?.response?.data?.message || "OTP verification failed.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 md:p-10 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Verify OTP
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Enter the OTP sent to your email to finish signing in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="otp"
                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                OTP
              </label>
              <input
                id="otp"
                inputMode="numeric"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="123456"
              />
              {fromPath ? (
                <p className="mt-2 text-xs text-gray-500">
                  After verification you will continue to: <span className="font-medium">{fromPath}</span>
                </p>
              ) : null}
            </div>

            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">
                  {errorMessage}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm sm:text-base font-semibold rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
