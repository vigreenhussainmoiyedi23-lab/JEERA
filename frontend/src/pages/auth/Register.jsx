import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Register = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const res = await axiosInstance.post(
        "/auth/google",
        { token },
        { withCredentials: true }
      );

      console.log("Registered user:", res.data);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/projects";
    } catch (err) {
      const data = err?.response?.data;
      console.error("Backend verification failed:", data || err.message);

      if (data?.message) setErrorMessage(data.message);
      else if (data?.error?.[0]?.message) setErrorMessage(data.error[0].message);
      else setErrorMessage("Something went wrong. Please try again.");
    }
  };

  const handleGoogleFailure = () => {
    console.error("Google Sign-In failed");
    setErrorMessage("Google registration failed. Please try again.");
  };

  return (
    <div className="h-screen bg-linear-to-br overflow-hidden from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-16">
      <div className="w-full max-w-md sm:max-w-lg">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8 md:space-y-10">
          
          {/* Header */}
          <div className="text-center space-y-1 sm:space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Create your account
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
              Join us today — it only takes a moment
            </p>
          </div>

          {/* Google Register */}
          <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
            <div className="w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap={false}
                theme="outline"
                size="large"
                text="signup_with"
                shape="rectangular"
                width="100%"
              />
            </div>
          </GoogleOAuthProvider>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600" />
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className="bg-white dark:bg-gray-800 px-3 sm:px-4 text-gray-500">
                or
              </span>
            </div>
          </div>

          {/* Registration Form */}
          <form className="space-y-4 sm:space-y-5 md:space-y-6">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                minLength={3}
                autoComplete="username"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="Choose a username"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2 sm:p-3">
                <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 font-medium">
                  ⚠️ {errorMessage}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 sm:py-3.5 px-4 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Create account
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <Link
              to="/login"
              className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
