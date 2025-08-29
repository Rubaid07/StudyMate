import React from 'react';
import { useNavigate } from 'react-router'; 

const DashboardWidgets = () => {
  const navigate = useNavigate();
  const handleNavigateToFeature = (path) => {
    navigate(path);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Class Schedule Tracker Widget */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-between text-center h-56">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Class Schedule Tracker</h3>
        <p className="text-gray-500 flex-grow">Add, edit, and view your class schedule here.</p>
        <button 
          onClick={() => handleNavigateToFeature('/dashboard/classes')} 
          className="mt-4 px-6 py-2 bg-cyan-700 text-white font-semibold rounded-lg hover:bg-cyan-800 transition-colors duration-200"
        >
          Go to Classes
        </button>
      </div>

      {/* Budget Tracker Widget */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-between text-center h-56">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Budget Tracker</h3>
        <p className="text-gray-500 flex-grow">Track your income and expenses for better financial management.</p>
        <button 
          onClick={() => handleNavigateToFeature('/dashboard/budget')} 
          className="mt-4 px-6 py-2 bg-cyan-700 text-white font-semibold rounded-lg hover:bg-cyan-800 transition-colors duration-200"
        >
          Manage Budget
        </button>
      </div>

      {/* Study Planner Widget */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-between text-center h-56">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Study Planner</h3>
        <p className="text-gray-500 flex-grow">Plan your study goals, set tasks, and track your progress.</p>
        <button 
          onClick={() => handleNavigateToFeature('/dashboard/planner')} 
          className="mt-4 px-6 py-2 bg-cyan-700 text-white font-semibold rounded-lg hover:bg-cyan-800 transition-colors duration-200"
        >
          Start Planning
        </button>
      </div>

      {/* Exam Q&A Generator Widget */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-between text-center h-56">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Exam Q&A Generator</h3>
        <p className="text-gray-500 flex-grow">Generate practice questions and answers for any topic.</p>
        <button 
          onClick={() => handleNavigateToFeature('/dashboard/exam-qa')} 
          className="mt-4 px-6 py-2 bg-cyan-700 text-white font-semibold rounded-lg hover:bg-cyan-800 transition-colors duration-200"
        >
          Generate Q&A
        </button>
      </div>

      {/* Unique Feature Idea Widget */}
      <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center justify-between text-center h-56">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Unique Feature Idea</h3>
        <p className="text-gray-500 flex-grow">Explore your creative feature here!</p>
        <button 
          onClick={() => handleNavigateToFeature('/dashboard/unique-feature')} 
          className="mt-4 px-6 py-2 bg-cyan-700 text-white font-semibold rounded-lg hover:bg-cyan-800 transition-colors duration-200"
        >
          Discover More
        </button>
      </div>
    </div>
  );
};

export default DashboardWidgets;
