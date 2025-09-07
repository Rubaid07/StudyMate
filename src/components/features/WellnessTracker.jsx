import React, { useState, useEffect } from 'react';
import { 
  Smile, 
  Frown, 
  Meh, 
  Moon, 
  BookOpen, 
  Calendar,
} from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const WellnessTracker = () => {
  const axiosSecure = useAxiosSecure();
  
  const [wellnessData, setWellnessData] = useState({
    mood: 3,
    sleepHours: 7,
    studyHours: 4,
    notes: ''
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWellnessHistory();
  }, []);

  const fetchWellnessHistory = async () => {
    try {
      const response = await axiosSecure.get('/summary/wellness-history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching wellness history:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosSecure.post('/summary/mood-track', wellnessData);
      toast.success('Wellness entry recorded successfully!');
      setWellnessData({ mood: 3, sleepHours: 7, studyHours: 4, notes: '' });
      fetchWellnessHistory();
    } catch (error) {
      toast.error('Failed to record wellness entry');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const MoodSelector = () => (
  <div className="mood-selector grid grid-cols-5 gap-2 mb-6">
    {[1, 2, 3, 4, 5].map((level) => (
      <button
        key={level}
        type="button"
        onClick={() => setWellnessData({ ...wellnessData, mood: level })}
        className={`mood-button p-4 rounded-lg border-2 transition-all cursor-pointer ${
          wellnessData.mood === level
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-200 hover:border-blue-300'
        }`}
      >
        <div className="mood-content text-center">
          {level === 1 && <Frown className="mood-icon h-8 w-8 text-red-500 mx-auto mb-2" />}
          {level === 2 && <Meh className="mood-icon h-8 w-8 text-orange-500 mx-auto mb-2" />}
          {level === 3 && <Meh className="mood-icon h-8 w-8 text-yellow-500 mx-auto mb-2" />}
          {level === 4 && <Smile className="mood-icon h-8 w-8 text-green-500 mx-auto mb-2" />}
          {level === 5 && <Smile className="mood-icon h-8 w-8 text-green-600 mx-auto mb-2" />}
          <span className="mood-label text-sm font-medium">Level {level}</span>
        </div>
      </button>
    ))}
  </div>
);

return (
  <div className="wellness-tracker min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="wellness-header bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="header-content">
            <h1 className="header-title text-3xl font-bold text-gray-800 mb-2">Wellness Tracker</h1>
            <p className="header-subtitle text-gray-600">Track your mental and physical well-being</p>
          </div>
          <div className="header-icon bg-blue-100 p-3 rounded-xl">
            <Smile className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>

      <div className="wellness-content grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wellness Form */}
        <div className="wellness-form bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="form-title text-xl font-semibold text-gray-800 mb-6">How are you feeling today?</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mood Selection */}
            <div className="mood-section">
              <label className="mood-label block text-sm font-medium text-gray-700 mb-4">
                Mood Level (1-5)
              </label>
              <MoodSelector />
            </div>

            {/* Sleep Hours */}
            <div className="sleep-section">
              <label className="sleep-label block text-sm font-medium text-gray-700 mb-2">
                Sleep Hours Last Night
              </label>
              <div className="sleep-input flex items-center space-x-2">
                <Moon className="sleep-icon h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={wellnessData.sleepHours}
                  onChange={(e) => setWellnessData({ ...wellnessData, sleepHours: parseFloat(e.target.value) })}
                  className="sleep-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Study Hours */}
            <div className="study-section">
              <label className="study-label block text-sm font-medium text-gray-700 mb-2">
                Study Hours Today
              </label>
              <div className="study-input flex items-center space-x-2">
                <BookOpen className="study-icon h-5 w-5 text-gray-400" />
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={wellnessData.studyHours}
                  onChange={(e) => setWellnessData({ ...wellnessData, studyHours: parseFloat(e.target.value) })}
                  className="study-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="notes-section">
              <label className="notes-label block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={wellnessData.notes}
                onChange={(e) => setWellnessData({ ...wellnessData, notes: e.target.value })}
                placeholder="How was your day? Any specific feelings or observations?"
                rows={3}
                className="notes-field w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-btn w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md py-3 px-4 transition-colors disabled:opacity-50 font-medium cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save Wellness Entry'}
            </button>
          </form>
        </div>

        {/* Wellness Statistics */}
        <div className="wellness-stats bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
          <h2 className="stats-title text-xl font-semibold text-gray-800 mb-6">Wellness Overview</h2>
          
          <div className="stats-grid grid grid-cols-2 gap-4 mb-6">
            <div className="stat-card sleep-stat bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="stat-header flex items-center mb-2">
                <Moon className="stat-icon h-5 w-5 text-blue-600 mr-2" />
                <span className="stat-label text-sm font-medium text-blue-800">Avg Sleep</span>
              </div>
              <div className="stat-value text-2xl font-bold text-blue-600">
                {history.length > 0 
                  ? (history.reduce((sum, entry) => sum + entry.sleepHours, 0) / history.length).toFixed(1)
                  : '0'
                }h
              </div>
            </div>

            <div className="stat-card study-stat bg-green-50 p-4 rounded-lg border border-green-100">
              <div className="stat-header flex items-center mb-2">
                <BookOpen className="stat-icon h-5 w-5 text-green-600 mr-2" />
                <span className="stat-label text-sm font-medium text-green-800">Avg Study</span>
              </div>
              <div className="stat-value text-2xl font-bold text-green-600">
                {history.length > 0 
                  ? (history.reduce((sum, entry) => sum + entry.studyHours, 0) / history.length).toFixed(1)
                  : '0'
                }h
              </div>
            </div>

            <div className="stat-card mood-stat bg-yellow-50 p-4 rounded-lg border border-yellow-100">
              <div className="stat-header flex items-center mb-2">
                <Smile className="stat-icon h-5 w-5 text-yellow-600 mr-2" />
                <span className="stat-label text-sm font-medium text-yellow-800">Avg Mood</span>
              </div>
              <div className="stat-value text-2xl font-bold text-yellow-600">
                {history.length > 0 
                  ? (history.reduce((sum, entry) => sum + entry.mood, 0) / history.length).toFixed(1)
                  : '0'
                }/5
              </div>
            </div>

            <div className="stat-card entries-stat bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="stat-header flex items-center mb-2">
                <Calendar className="stat-icon h-5 w-5 text-purple-600 mr-2" />
                <span className="stat-label text-sm font-medium text-purple-800">Entries</span>
              </div>
              <div className="stat-value text-2xl font-bold text-purple-600">{history.length}</div>
            </div>
          </div>

          {/* Recent Entries */}
          <div className="recent-entries">
            <h3 className="entries-title font-medium text-gray-700 mb-4">Recent Entries</h3>
            <div className="entries-list space-y-3">
              {history.slice(0, 5).map((entry, index) => (
                <div key={index} className="entry-item flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="entry-date flex items-center">
                    <div className={`mood-indicator w-3 h-3 rounded-full mr-3 ${
                      entry.mood >= 4 ? 'bg-green-500' :
                      entry.mood >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="entry-date-text text-sm text-gray-700">
                      {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="entry-details text-sm text-gray-600">
                    {entry.sleepHours}h sleep • {entry.studyHours}h study
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
};

export default WellnessTracker;