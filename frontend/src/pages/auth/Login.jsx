import React, { useState } from "react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState(null);

  const handleGoogleSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
      const res = await axiosInstance.post(
        "/user/auth/google",
        { token },
        { withCredentials: true }
      );

      console.log("Logged in user:", res.data);

      localStorage.setItem("token", res.data.token);
      window.location.href = "/projects";
    } catch (err) {
      console.error("Backend verification failed:", err.response?.data || err.message);
      setErrorMessage(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleFailure = () => {
    console.error("Google Sign-In failed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black flex items-center justify-center px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-1 sm:space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Welcome back
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-600 dark:text-gray-400">
              Sign in to your account
            </p>
          </div>

          {/* Google Login */}
          <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
            <div className="w-full">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                useOneTap={false}
                theme="outline"
                size="large"
                text="signin_with"
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

          {/* Email & Password Form */}
          <form className="space-y-4 sm:space-y-5">
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
                minLength={8}
                required
                autoComplete="email"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="you@example.com"
              />
            </div>

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
                minLength={8}
                required
                autoComplete="current-password"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm sm:text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="••••••••"
              />
            </div>

            {errorMessage && (
              <p className="text-red-500 text-xs sm:text-sm font-semibold">
                ⚠️ {errorMessage}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 sm:py-3 px-4 sm:px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              Sign in
            </button>
          </form>

          {/* Register Link */}
          <div className="text-center">
            <Link
              to="/register"
              className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
            >
              Don’t have an account? Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
