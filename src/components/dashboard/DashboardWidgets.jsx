import React, { useState, useEffect, useContext } from 'react';
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
  Bookmark,
  BarChart3,
  Quote,
} from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../context/AuthContext';
import { FiAward, FiClock } from 'react-icons/fi';

const DashboardWidgets = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dailyMotivation, setDailyMotivation] = useState('');
  const [quoteLoading, setQuoteLoading] = useState(true);
  const [quizStats, setQuizStats] = useState({ totalQuizzes: 0, averageScore: 0, bestScore: 0 });
  const [recentQuizzes, setRecentQuizzes] = useState([]);

  useEffect(() => {
    fetchQuizResults();
  }, []);

  const fetchQuizResults = async () => {
    try {
      const response = await axiosSecure.get('/quiz/results/summary');
      setQuizStats(response.data.stats || {});
      setRecentQuizzes(response.data.recentResults || []);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
    }
  };

  const fallbackQuotes = [
    "Your education is a dress rehearsal for a life that is yours to lead. - Nora Ephron",
    "The beautiful thing about learning is that no one can take it away from you. - B.B. King",
    "Education is the most powerful weapon which you can use to change the world. - Nelson Mandela",
    "Don't let what you cannot do interfere with what you can do. - John Wooden",
    "The expert in anything was once a beginner. - Helen Hayes",
    "Your time is limited, don't waste it living someone else's life. - Steve Jobs",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "The harder you work for something, the greater you'll feel when you achieve it. - Unknown",
    "Education is not preparation for life; education is life itself. - John Dewey",
    "Learning is not attained by chance, it must be sought for with ardor and diligence. - Abigail Adams",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "You don't have to be great to start, but you have to start to be great. - Zig Ziglar",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "Your potential is endless. Go do what you were created to do. - Unknown",
    "Small progress is still progress. Keep going. - Unknown",
    "The journey of a thousand miles begins with a single step. - Lao Tzu",
    "You are capable of amazing things. - Unknown",
    "Every expert was once a beginner. - Unknown",
    "Knowledge is power. Information is liberating. - Kofi Annan",
    "The best way to predict your future is to create it. - Abraham Lincoln"
  ];

  // Fetch motivational quote from ZenQuotes API
  const fetchMotivationalQuote = async () => {
    try {
      setQuoteLoading(true);

      const today = new Date().toDateString();
      const lastQuoteDate = localStorage.getItem('lastQuoteDate');
      const savedQuote = localStorage.getItem('dailyQuote');
      const lastQuoteIndex = parseInt(localStorage.getItem('lastQuoteIndex') || '0');

      // If we have a saved quote from today, use it
      if (lastQuoteDate === today && savedQuote) {
        setDailyMotivation(savedQuote);
        setQuoteLoading(false);
        return;
      }

      let newQuote;

      // Try multiple quote APIs with fallback
      try {
        // Try Quotable API first (more reliable)
        const response = await fetch('https://api.quotable.io/random?tags=education|success|motivational|inspirational');
        const data = await response.json();
        newQuote = `${data.content} - ${data.author}`;
      } catch (apiError) {
        console.log('Quotable API failed, trying ZenQuotes...');

        // Fallback to ZenQuotes
        try {
          const zenResponse = await fetch('https://zenquotes.io/api/random');
          const zenData = await zenResponse.json();
          if (zenData && zenData[0] && zenData[0].q) {
            newQuote = `${zenData[0].q} - ${zenData[0].a}`;
          } else {
            throw new Error('ZenQuotes failed');
          }
        } catch (zenError) {
          // Use fallback quotes with sequential rotation
          const nextIndex = (lastQuoteIndex + 1) % fallbackQuotes.length;
          newQuote = fallbackQuotes[nextIndex];
          localStorage.setItem('lastQuoteIndex', nextIndex.toString());
        }
      }

      // Save quote for today
      setDailyMotivation(newQuote);
      localStorage.setItem('dailyQuote', newQuote);
      localStorage.setItem('lastQuoteDate', today);

    } catch (error) {
      console.error('Error fetching motivational quote:', error);
      // Final fallback - random quote from array
      const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
      setDailyMotivation(fallbackQuotes[randomIndex]);
    } finally {
      setQuoteLoading(false);
    }
  };

  // Manual refresh function for quotes
  const refreshQuoteManually = async () => {
    // Clear stored quote to force a new fetch
    localStorage.removeItem('lastQuoteDate');
    localStorage.removeItem('dailyQuote');
    await fetchMotivationalQuote();
  };

  useEffect(() => {
    fetchDashboardData();
    fetchMotivationalQuote();

    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
      if (error.response?.status === 401 || error.response?.status === 403) {
        setError('Authentication required. Please log in again.');
        return;
      }

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

  const handleNavigateToFeature = (path) => {
    navigate(path);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
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
      badge: "bg-blue-50 text-blue-600",
      lightBg: "bg-blue-50",
      border: "border-blue-100"
    },
    green: {
      bg: "bg-green-600 hover:bg-green-700",
      text: "text-green-600",
      badge: "bg-green-50 text-green-600",
      lightBg: "bg-green-50",
      border: "border-green-100"
    },
    orange: {
      bg: "bg-orange-600 hover:bg-orange-700",
      text: "text-orange-600",
      badge: "bg-orange-50 text-orange-600",
      lightBg: "bg-orange-50",
      border: "border-orange-100"
    },
    purple: {
      bg: "bg-purple-600 hover:bg-purple-700",
      text: "text-purple-600",
      badge: "bg-purple-50 text-purple-600",
      lightBg: "bg-purple-50",
      border: "border-purple-100"
    },
    pink: {
      bg: "bg-pink-600 hover:bg-pink-700",
      text: "text-pink-600",
      badge: "bg-pink-50 text-pink-600",
      lightBg: "bg-pink-50",
      border: "border-pink-100"
    },
    cyan: {
      bg: "bg-cyan-600 hover:bg-cyan-700",
      text: "text-cyan-600",
      badge: "bg-cyan-50 text-cyan-600",
      lightBg: "bg-cyan-50",
      border: "border-cyan-100"
    },
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white border border-red-200 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header with Motivational Quote */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.displayName || 'StudyMate User'}!
            </h1>
            <p className="text-gray-500 mb-3">
              Here's your overview for {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <button
            onClick={() => {
              handleRefresh();
            }}
            disabled={refreshing}
            className="cursor-pointer flex items-center px-4 py-2 mb-3 w-max bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 font-medium shadow-sm hover:shadow-md"
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Data
          </button>
        </div>
        {/* Motivational Quote Section */}
        <div className="flex items-start bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg border border-indigo-100 mb-3">
          <Quote className="h-5 w-5 text-indigo-600 mr-3 mt-0.5 flex-shrink-0" />
          {quoteLoading ? (
            <div className="animate-pulse flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            </div>
          ) : (
            <p className="text-indigo-700 text-sm italic">
              "{dailyMotivation}"
            </p>
          )}
        </div>

        {/* Quote Info */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Daily motivation • Updates every 24 hours</span>
          </div>
          <button
            onClick={refreshQuoteManually}
            className="flex items-center text-indigo-600 hover:text-indigo-800 text-xs font-medium"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            New quote
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex w-full md:w-lg gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: Bookmark },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'performance', label: 'Performance', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center flex-1 min-w-0 py-2 px-2 rounded-lg font-medium text-sm sm:text-base transition-all cursor-pointer ${activeTab === tab.id
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50'
                }`}
            >
              <tab.icon className="h-4 w-4 mr-1 shrink-0" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      {activeTab === 'overview' && (
        <>
          {/* Summary Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Classes Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-100 group">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
                <span className="text-2xl font-bold text-blue-600">{dashboardData.quickStats.totalClasses}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Classes</h3>
              {dashboardData.classes.nextClass && (
                <div className="bg-blue-50 p-3 rounded-lg mt-3 border border-blue-100">
                  <p className="text-sm font-medium text-blue-800">Next Class</p>
                  <p className="text-xs text-blue-600 truncate">
                    {dashboardData.classes.nextClass.subject} • {dashboardData.classes.nextClass.startTime}
                  </p>
                </div>
              )}
            </div>

            {/* budget Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-100 group">
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
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-100 group">
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
            <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-100 group">
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

            {/* Quiz Performance Summary */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Quiz Performance</h3>
                <FiAward className="h-6 w-6 text-purple-600" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Quizzes</span>
                  <span className="font-semibold">{quizStats.totalQuizzes || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average Score</span>
                  <span className="font-semibold">{quizStats.averageScore || 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Best Score</span>
                  <span className="font-semibold text-green-600">{quizStats.bestScore || 0}%</span>
                </div>
              </div>
            </div>

            {/* Recent Quiz Results */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 md:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Quiz Results</h3>
                <FiClock className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="space-y-3">
                {recentQuizzes.length > 0 ? (
                  recentQuizzes.map((result, index) => {
                    // Define label & style based on percentage
                    let performanceLabel = "";
                    let performanceClass = "";
                    if (result.percentage >= 80) {
                      performanceLabel = "Excellent";
                      performanceClass = "bg-green-100 text-green-800";
                    } else if (result.percentage >= 60) {
                      performanceLabel = "Good";
                      performanceClass = "bg-yellow-100 text-yellow-800";
                    } else {
                      performanceLabel = "Needs Improvement";
                      performanceClass = "bg-red-100 text-red-800";
                    }

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-800">{result.topic}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(result.date).toLocaleDateString()} • {result.type} •{" "}
                            {result.difficulty}
                          </p>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full font-semibold flex items-center gap-2 ${performanceClass}`}
                        >
                          <span>{result.percentage}%</span>
                          <span className="hidden sm:inline">({performanceLabel})</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500 text-center py-4">No quiz results yet</p>
                )}
              </div>
            </div>

          </div>

          {/* progress Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Task Progress */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
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
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${taskCompletionRate}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <span className="block text-2xl font-bold text-green-600">{dashboardData.planner.completedTasks}</span>
                    <span className="text-xs text-green-800">Done</span>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-100">
                    <span className="block text-2xl font-bold text-orange-600">{dashboardData.planner.pendingTasks}</span>
                    <span className="text-xs text-orange-800">Pending</span>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <span className="block text-2xl font-bold text-red-600">{dashboardData.planner.overdueTasks}</span>
                    <span className="text-xs text-red-800">Overdue</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Progress */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
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
                      className="bg-gradient-to-r from-green-600 to-emerald-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <span className="block text-2xl font-bold text-blue-600">${dashboardData.budget.totalIncome.toFixed(2)}</span>
                    <span className="text-xs text-blue-800">Total Income</span>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
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
              }
            ].map((feature, index) => (
              <div key={index} className={`bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-all border border-gray-100 group`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`${colorClasses[feature.color].lightBg} p-3 rounded-xl`}>
                    <feature.icon className={`h-6 w-6 ${colorClasses[feature.color].text}`} />
                  </div>
                  {feature.stats && (
                    <span className={`text-xs font-medium ${colorClasses[feature.color].badge} px-2 py-1 rounded-full`}>
                      {feature.stats}
                    </span>
                  )}
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-sm mb-4">{feature.description}</p>
                <button
                  onClick={() => handleNavigateToFeature(feature.path)}
                  className={`w-full py-2.5 text-white rounded-lg transition-all font-medium shadow-sm hover:shadow-md cursor-pointer ${colorClasses[feature.color].bg}`}
                >
                  Explore
                </button>
              </div>
            ))}

          </div>
        </>
      )}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Study Analytics */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Study Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weekly Study Hours Chart */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-4">Weekly Study Hours</h4>
                <div className="space-y-3">
                  {dashboardData.weeklyData.studySessions.map((session, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{new Date(session.date).toLocaleDateString()}</span>
                      <div className="flex items-center">
                        <div
                          className="h-2 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mr-2"
                          style={{ width: `${session.duration * 15}px` }}
                        ></div>
                        <span className="font-medium text-sm">{session.duration}h</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject-wise Distribution */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-4">Subject Focus</h4>
                <div className="space-y-2">
                  {Object.entries(
                    dashboardData.weeklyData.studySessions.reduce((acc, session) => {
                      acc[session.subject] = (acc[session.subject] || 0) + session.duration;
                      return acc;
                    }, {})
                  ).map(([subject, hours]) => (
                    <div key={subject} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{subject}</span>
                      <span className="font-medium bg-blue-50 text-blue-700 px-2 py-1 rounded-full">{hours}h</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Financial Analytics */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Financial Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expense Categories */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-700 mb-4">Expense Categories</h4>
                <div className="space-y-2">
                  {Object.entries(dashboardData.expensesByCategory).map(([category, amount]) => (
                    <div key={category} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{category}</span>
                      <span className="font-medium bg-red-50 text-red-700 px-2 py-1 rounded-full">${amount}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Monthly Trend */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
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
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Academic Performance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="text-2xl font-bold text-blue-600 mb-2">{dashboardData.planner.completedTasks}</div>
                <div className="text-sm text-blue-800">Tasks Completed</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="text-2xl font-bold text-green-600 mb-2">{dashboardData.quickStats.studyHoursThisWeek}</div>
                <div className="text-sm text-green-800">Study Hours This Week</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-100">
                <div className="text-2xl font-bold text-purple-600 mb-2">{dashboardData.classes.total}</div>
                <div className="text-sm text-purple-800">Total Classes</div>
              </div>
            </div>
          </div>

          {/* Productivity Metrics */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Productivity Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Task Completion Rate</span>
                  <span className="font-semibold">{taskCompletionRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-600 to-emerald-600 h-3 rounded-full transition-all duration-300"
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
                    className="bg-gradient-to-r from-blue-600 to-cyan-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: '85%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Wellness Tracking */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">Wellness & Balance</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="text-2xl font-bold text-yellow-600 mb-2">{dashboardData.wellness.averageMood.toFixed(1)}/5</div>
                <div className="text-sm text-yellow-800">Average Mood</div>
              </div>
              <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                <div className="text-2xl font-bold text-indigo-600 mb-2">{dashboardData.wellness.sleepHours.toFixed(1)}</div>
                <div className="text-sm text-indigo-800">Avg Sleep Hours</div>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg border border-pink-100">
                <div className="text-2xl font-bold text-pink-600 mb-2">{dashboardData.wellness.studyHours.toFixed(1)}</div>
                <div className="text-sm text-pink-800">Avg Study Hours</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default DashboardWidgets;