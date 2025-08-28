import React, { useContext, useState } from 'react';
import { Link } from 'react-router';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

const Dashboard = () => {
  const { user, loading } = useContext(AuthContext);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Sample data
  const classData = [
    { time: "9:00 AM", name: "Mathematics 101", location: "Room 302" },
    { time: "11:30 AM", name: "Computer Science", location: "Lab B" },
    { time: "2:00 PM", name: "Literature", location: "Room 105" }
  ];

  const budgetData = { income: 2450, expenses: 1820, remaining: 630 };

  const tasksData = [
    { task: "Complete math assignment", due: "Today", priority: "high" },
    { task: "Read chapter 5 of CS textbook", due: "Tomorrow", priority: "medium" },
    { task: "Prepare for literature presentation", due: "In 3 days", priority: "low" }
  ];

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Sidebar isMobileOpen={isMobileSidebarOpen} toggleMobileSidebar={toggleMobileSidebar} />

      <div className="flex flex-col flex-1">
      <Navbar toggleMobileSidebar={toggleMobileSidebar} />
        {/* -------- MAIN CONTENT -------- */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Greeting */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 transition-all duration-300 hover:shadow-md">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.displayName || 'StudyMate User'}!
            </h1>
            <p className="text-gray-500">
              Here's your overview for today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* ------------ Class Schedule Widget ------------ */}
            <div className="card bg-white rounded-2xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Today's Classes</h2>
                <Link to="/classes" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">View all</Link>
              </div>
              {classData.length > 0 ? (
                <div className="space-y-4">
                  {classData.map((classItem, index) => (
                    <div key={index} className="flex items-start p-3 rounded-lg bg-blue-50/50 border border-blue-100 transition-all duration-200 hover:bg-blue-100/30">
                      <div className="bg-indigo-100 text-indigo-800 rounded-lg p-2 mr-3 flex items-center justify-center">
                        <span className="text-lg">📅</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{classItem.name}</h3>
                        <p className="text-sm text-gray-500">{classItem.time} • {classItem.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">📚</div>
                  No classes scheduled for today
                </div>
              )}
            </div>

            {/* ------------ Budget Widget ------------ */}
            <div className="card bg-white rounded-2xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Monthly Budget</h2>
                <Link to="/budget" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">Details</Link>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-lg bg-green-50/50 border border-green-100 transition-all duration-200 hover:bg-green-100/30">
                  <h3 className="font-medium text-gray-800">Income</h3>
                  <span className="font-semibold text-green-600">${budgetData.income.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-red-50/50 border border-red-100 transition-all duration-200 hover:bg-red-100/30">
                  <h3 className="font-medium text-gray-800">Expenses</h3>
                  <span className="font-semibold text-red-600">${budgetData.expenses.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50/50 border border-blue-100 transition-all duration-200 hover:bg-blue-100/30">
                  <h3 className="font-medium text-gray-800">Remaining</h3>
                  <span className="font-semibold text-blue-600">${budgetData.remaining.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* ------------ Tasks Widget ------------ */}
            <div className="card bg-white rounded-2xl shadow-sm p-6 transition-all duration-300 hover:shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Study Tasks</h2>
                <Link to="/planner" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors">View all</Link>
              </div>
              {tasksData.length > 0 ? (
                <div className="space-y-4">
                  {tasksData.map((task, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${
                        task.priority === 'high' ? 'bg-red-50/50 border-red-100' : 
                        task.priority === 'medium' ? 'bg-yellow-50/50 border-yellow-100' : 
                        'bg-green-50/50 border-green-100'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-gray-800">{task.task}</h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          task.priority === 'high' ? 'bg-red-100 text-red-800' : 
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Due: {task.due}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">✅</div>
                  No tasks planned
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;