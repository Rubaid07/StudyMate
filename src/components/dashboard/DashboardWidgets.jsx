import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  Calendar,
  DollarSign,
  BookOpen,
  Clock,
  AlertCircle,
  Smile,
  Brain,
  Target,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Bookmark
} from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const DashboardWidgets = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchDashboardData = async () => {
    try {
      setError(null);
      setRefreshing(true);
      const response = await axiosSecure.get('/summary/dashboard');

      if (response.status === 200 && response.data) {
        setDashboardData(response.data);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.response?.data?.message || error.message || 'Failed to load dashboard data');

      setDashboardData({
        classes: { total: 0, todayClasses: [], nextClass: null },
        budget: { totalIncome: 0, totalExpenses: 0, balance: 0, recentTransactions: [] },
        expensesByCategory: {},
        planner: { totalTasks: 0, completedTasks: 0, pendingTasks: 0, highPriorityTasks: 0, overdueTasks: 0, upcomingTasks: [] },
        wellness: { totalEntries: 0, averageMood: 0, sleepHours: 0, studyHours: 0, lastEntry: null },
        weeklyData: { studySessions: [], expenses: {} },
        quickStats: { totalClasses: 0, balance: 0, pendingTasks: 0, studyHoursThisWeek: 0 }
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavigateToFeature = (path) => {
    navigate(path);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const handleRecordStudySession = async (duration, subject = 'General') => {
    try {
      await axiosSecure.post('/summary/study-session', {
        subject,
        duration,
        efficiency: 85
      });
      fetchDashboardData();
    } catch (error) {
      console.error('Error recording study session:', error);
    }
  };

  //  progress percentages
  const taskCompletionRate = dashboardData ?
    (dashboardData.planner.completedTasks / dashboardData.planner.totalTasks) * 100 || 0 : 0;

  const budgetUtilization = dashboardData && dashboardData.budget.totalIncome > 0 ?
    (dashboardData.budget.totalExpenses / dashboardData.budget.totalIncome) * 100 : 0;

  const colorClasses = {
    blue: {
      bg: "bg-blue-600 hover:bg-blue-700",
      text: "text-blue-600",
      badge: "bg-blue-50 text-blue-600"
    },
    green: {
      bg: "bg-green-600 hover:bg-green-700",
      text: "text-green-600",
      badge: "bg-green-50 text-green-600"
    },
    orange: {
      bg: "bg-orange-600 hover:bg-orange-700",
      text: "text-orange-600",
      badge: "bg-orange-50 text-orange-600"
    },
    purple: {
      bg: "bg-purple-600 hover:bg-purple-700",
      text: "text-purple-600",
      badge: "bg-purple-50 text-purple-600"
    },
    pink: {
      bg: "bg-pink-600 hover:bg-pink-700",
      text: "text-pink-600",
      badge: "bg-pink-50 text-pink-600"
    },
    cyan: {
      bg: "bg-cyan-600 hover:bg-cyan-700",
      text: "text-cyan-600",
      badge: "bg-cyan-50 text-cyan-600"
    },
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <button
            onClick={handleRefresh}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's your study summary</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors disabled:opacity-50 font-medium"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <div className="flex space-x-4 overflow-x-auto">
          {['overview', 'analytics', 'performance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-medium capitalize whitespace-nowrap transition-colors ${activeTab === tab
                ? 'bg-cyan-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Classes Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-blue-600">{dashboardData.quickStats.totalClasses}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Classes</h3>
              {dashboardData.classes.nextClass && (
                <div className="bg-blue-50 p-3 rounded-lg mt-3">
                  <p className="text-sm font-medium text-blue-800">Next Class</p>
                  <p className="text-xs text-blue-600 truncate">
                    {dashboardData.classes.nextClass.subject} • {dashboardData.classes.nextClass.startTime}
                  </p>
                </div>
              )}
            </div>

            {/* budget Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-green-100 p-3 rounded-xl">
                  <DollarSign className="h-8 w-8 text-green-600" />
                </div>
                <span className={`text-2xl font-bold ${dashboardData.budget.balance >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                  ${dashboardData.budget.balance.toFixed(2)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Current Balance</h3>
              <div className="space-y-1 mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Income</span>
                  <span className="text-green-600 font-medium">${dashboardData.budget.totalIncome.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Expenses</span>
                  <span className="text-red-600 font-medium">${dashboardData.budget.totalExpenses.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* tasks Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <Target className="h-8 w-8 text-orange-600" />
                </div>
                <span className="text-2xl font-bold text-orange-600">{dashboardData.planner.pendingTasks}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Pending Tasks</h3>
              <div className="space-y-1 mt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed</span>
                  <span className="text-green-600 font-medium">{dashboardData.planner.completedTasks}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">High Priority</span>
                  <span className="text-red-600 font-medium">{dashboardData.planner.highPriorityTasks}</span>
                </div>
              </div>
            </div>

            {/* study Time */}
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-purple-100 p-3 rounded-xl">
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
                <span className="text-2xl font-bold text-purple-600">{dashboardData.quickStats.studyHoursThisWeek}h</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Weekly Study</h3>
              <p className="text-sm text-gray-600 mt-3">
                {dashboardData.weeklyData.studySessions.length} sessions this week
              </p>
            </div>
          </div>

          {/* progress Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Task Progress */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Task Progress</h3>
                <Bookmark className="h-6 w-6 text-cyan-600" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-semibold">{taskCompletionRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-cyan-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${taskCompletionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-green-50 p-3 rounded-lg">
                    <span className="block text-2xl font-bold text-green-600">{dashboardData.planner.completedTasks}</span>
                    <span className="text-xs text-green-800">Done</span>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <span className="block text-2xl font-bold text-orange-600">{dashboardData.planner.pendingTasks}</span>
                    <span className="text-xs text-orange-800">Pending</span>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <span className="block text-2xl font-bold text-red-600">{dashboardData.planner.overdueTasks}</span>
                    <span className="text-xs text-red-800">Overdue</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Progress */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Budget Overview</h3>
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Budget Utilization</span>
                    <span className="font-semibold">{budgetUtilization.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <span className="block text-2xl font-bold text-blue-600">${dashboardData.budget.totalIncome.toFixed(2)}</span>
                    <span className="text-xs text-blue-800">Total Income</span>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg">
                    <span className="block text-2xl font-bold text-red-600">${dashboardData.budget.totalExpenses.toFixed(2)}</span>
                    <span className="text-xs text-red-800">Total Expenses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Class Schedule',
                description: 'Manage your class schedule and never miss a lecture',
                icon: Calendar,
                color: 'blue',
                path: '/dashboard/classes',
                stats: `${dashboardData.classes.todayClasses.length} classes today`
              },
              {
                title: 'Budget Tracker',
                description: 'Track your expenses and manage your budget',
                icon: DollarSign,
                color: 'green',
                path: '/dashboard/budget',
                stats: `${dashboardData.budget.recentTransactions.length} recent transactions`
              },
              {
                title: 'Study Planner',
                description: 'Plan your study sessions and track progress',
                icon: BookOpen,
                color: 'orange',
                path: '/dashboard/planner',
                stats: `${dashboardData.planner.upcomingTasks.length} upcoming tasks`
              },
              {
                title: 'Exam Generator',
                description: 'Create practice tests and quizzes',
                icon: Brain,
                color: 'purple',
                path: '/dashboard/exam-qa',
                stats: 'AI-powered questions'
              },
              {
                title: 'Wellness Tracker',
                description: 'Monitor your health and wellness',
                icon: Smile,
                color: 'pink',
                path: '/dashboard/wellness',
                stats: `${dashboardData.wellness.totalEntries} wellness entries`
              },
              {
                title: 'Study Session',
                description: 'Record your study sessions and track progress',
                icon: Clock,
                color: 'cyan',
                action: () => handleRecordStudySession(2, 'Mathematics'),
                stats: 'Track your learning'
              }
            ].map((feature, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`bg-${feature.color}-100 p-3 rounded-xl`}>
                    <feature.icon className={`h-6 w-6 text-${feature.color}-600`} />
                  </div>
                  {feature.stats && (
                    <span className={`text-xs font-medium text-${feature.color}-600 bg-${feature.color}-50 px-2 py-1 rounded-full`}>
                      {feature.stats}
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                <button
                  onClick={feature.action || (() => handleNavigateToFeature(feature.path))}
                  className={`w-full py-2 text-white rounded-lg transition-colors cursor-pointer font-medium ${colorClasses[feature.color].bg}`}
                >
                  {feature.action ? 'Start Session' : 'Explore'}
                </button>

              </div>
            ))}
          </div>
        </>
      )}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* স্টাডি অ্যানালিটিক্স */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Study Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weekly Study Hours Chart */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-4">Weekly Study Hours</h4>
                <div className="space-y-3">
                  {dashboardData.weeklyData.studySessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{new Date(session.date).toLocaleDateString()}</span>
                      <span className="font-medium">{session.duration}h</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject-wise Distribution */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-4">Subject Focus</h4>
                <div className="space-y-2">
                  {Object.entries(
                    dashboardData.weeklyData.studySessions.reduce((acc, session) => {
                      acc[session.subject] = (acc[session.subject] || 0) + session.duration;
                      return acc;
                    }, {})
                  ).map(([subject, hours]) => (
                    <div key={subject} className="flex justify-between text-sm">
                      <span>{subject}</span>
                      <span className="font-medium">{hours}h</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Analytics */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Financial Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expense Categories */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-4">Expense Categories</h4>
                <div className="space-y-2">
                  {Object.entries(dashboardData.expensesByCategory).map(([category, amount]) => (
                    <div key={category} className="flex justify-between text-sm">
                      <span>{category}</span>
                      <span className="text-red-600 font-medium">${amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Trend */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-4">Monthly Spending</h4>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-2" />
                  <p className="text-gray-600">Coming soon: Monthly charts</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          {/* Academic Performance */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Academic Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">{dashboardData.planner.completedTasks}</div>
                <div className="text-sm text-blue-800">Tasks Completed</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">{dashboardData.quickStats.studyHoursThisWeek}</div>
                <div className="text-sm text-green-800">Study Hours This Week</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">{dashboardData.classes.total}</div>
                <div className="text-sm text-purple-800">Total Classes</div>
              </div>
            </div>
          </div>

          {/* Productivity Metrics */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Productivity Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Task Completion Rate</span>
                  <span className="font-semibold">{taskCompletionRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${taskCompletionRate}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Study Consistency</span>
                  <span className="font-semibold">85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: '85%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Wellness Tracking */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Wellness & Balance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 mb-2">{dashboardData.wellness.averageMood.toFixed(1)}/5</div>
                <div className="text-sm text-yellow-800">Average Mood</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg">
                <div className="text-2xl font-bold text-indigo-600 mb-2">{dashboardData.wellness.sleepHours.toFixed(1)}</div>
                <div className="text-sm text-indigo-800">Avg Sleep Hours</div>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <div className="text-2xl font-bold text-pink-600 mb-2">{dashboardData.wellness.studyHours.toFixed(1)}</div>
                <div className="text-sm text-pink-800">Avg Study Hours</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="fixed bottom-6 right-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 shadow-lg max-w-sm">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div>
              <p className="text-yellow-800 font-medium">Notice</p>
              <p className="text-yellow-700 text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardWidgets;