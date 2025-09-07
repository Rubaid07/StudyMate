import { Link } from "react-router";
import { FiHome, FiArrowLeft, FiAlertTriangle } from "react-icons/fi";

const NotFoundPage = () => {
  return (
    <div className="not-found-page min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="not-found-icon inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl shadow-lg border border-gray-100 mb-6">
            <FiAlertTriangle className="w-12 h-12 text-yellow-500" />
          </div>
        </div>

        {/* Content */}
        <h1 className="not-found-title text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="not-found-subtitle text-2xl font-semibold text-gray-700 mb-6">
          Page Not Found
        </h2>
        <p className="not-found-description text-gray-600 mb-8">
          Oops! The page you're looking for seems to have wandered off into the digital wilderness.
        </p>

        {/* Action Buttons */}
        <div className="not-found-actions flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="home-btn flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
          >
            <FiHome className="w-5 h-5" />
            Go Home
          </Link>
          <button
            onClick={() => window.history.back()}
            className="back-btn flex items-center justify-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
          >
            <FiArrowLeft className="w-5 h-5" />
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="not-found-help mt-8 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-2">Need help?</p>
          <Link
            to="/support"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium transition-colors"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;