import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center px-6">
      <h1 className="text-6xl sm:text-8xl font-extrabold text-blue-600 mb-4">
        404
      </h1>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Page Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow transition"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
