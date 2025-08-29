// src/features/ClassTracker.jsx

import React from 'react';

const ClassTracker = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-700">Class Schedule Tracker</h2>
      <p className="mt-2 text-gray-500">Add, edit, and view your class schedule here.</p>
      <div className="mt-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
          Add New Class
        </button>
      </div>
    </div>
  );
};

export default ClassTracker;
