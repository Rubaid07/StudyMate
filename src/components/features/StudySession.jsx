import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-route';
import { 
  Clock, 
  BookOpen, 
  Play, 
  Pause, 
  Square, 
  Target,
  BarChart3,
  Calendar,
  Award
} from 'lucide-react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';

const StudySession = () => {
//   const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  
  const [session, setSession] = useState({
    subject: '',
    topic: '',
    duration: 25,
    efficiency: 85,
    isActive: false,
    elapsed: 0
  });
  const [timer, setTimer] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchStudyHistory();
    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);

  const fetchStudyHistory = async () => {
    try {
      const response = await axiosSecure.get('/summary/study-history');
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching study history:', error);
    }
  };

  const startTimer = () => {
    setSession(prev => ({ ...prev, isActive: true }));
    const interval = setInterval(() => {
      setSession(prev => {
        if (prev.elapsed >= prev.duration * 60) {
          clearInterval(interval);
          completeSession();
          return { ...prev, isActive: false, elapsed: prev.duration * 60 };
        }
        return { ...prev, elapsed: prev.elapsed + 1 };
      });
    }, 1000);
    setTimer(interval);
  };

  const pauseTimer = () => {
    setSession(prev => ({ ...prev, isActive: false }));
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const resetTimer = () => {
    setSession(prev => ({ ...prev, isActive: false, elapsed: 0 }));
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  };

  const completeSession = async () => {
    try {
      await axiosSecure.post('/summary/study-session', {
        subject: session.subject,
        duration: session.duration,
        topic: session.topic,
        efficiency: session.efficiency
      });
      toast.success('Study session completed successfully!');
      resetTimer();
      fetchStudyHistory();
    } catch (error) {
      toast.error('Failed to save study session');
      console.error('Error:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (session.elapsed / (session.duration * 60)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Study Session</h1>
              <p className="text-gray-600">Focus and track your study sessions</p>
            </div>
            <div className="bg-green-100 p-3 rounded-xl">
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Controller */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Start New Session</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={session.subject}
                  onChange={(e) => setSession({ ...session, subject: e.target.value })}
                  placeholder="e.g., Mathematics, Physics"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Topic (Optional)
                </label>
                <input
                  type="text"
                  value={session.topic}
                  onChange={(e) => setSession({ ...session, topic: e.target.value })}
                  placeholder="e.g., Calculus, Quantum Mechanics"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (minutes)
                </label>
                <select
                  value={session.duration}
                  onChange={(e) => setSession({ ...session, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={25}>25 min (Pomodoro)</option>
                  <option value={50}>50 min (Deep Focus)</option>
                  <option value={90}>90 min (Extended Session)</option>
                  <option value={120}>120 min (Marathon)</option>
                </select>
              </div>
            </div>

            {/* Timer Display */}
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gray-800 mb-4">
                {formatTime(session.elapsed)}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <div
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex justify-center space-x-4">
              {!session.isActive ? (
                <button
                  onClick={startTimer}
                  disabled={!session.subject}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer flex items-center"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Start Session
                </button>
              ) : (
                <button
                  onClick={pauseTimer}
                  className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors cursor-pointer flex items-center"
                >
                  <Pause className="h-5 w-5 mr-2" />
                  Pause
                </button>
              )}
              
              <button
                onClick={resetTimer}
                className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors cursor-pointer flex items-center"
              >
                <Square className="h-5 w-5 mr-2" />
                Reset
              </button>
            </div>
          </div>

          {/* Session Statistics */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Study Statistics</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center mb-2">
                  <Clock className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">Total Hours</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {history.length > 0 
                    ? (history.reduce((sum, session) => sum + session.duration, 0) / 60).toFixed(1)
                    : '0'
                  }h
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="flex items-center mb-2">
                  <Target className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">Sessions</span>
                </div>
                <div className="text-2xl font-bold text-green-600">{history.length}</div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="flex items-center mb-2">
                  <Award className="h-5 w-5 text-purple-600 mr-2" />
                  <span className="text-sm font-medium text-purple-800">Avg Efficiency</span>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {history.length > 0 
                    ? (history.reduce((sum, session) => sum + session.efficiency, 0) / history.length).toFixed(0)
                    : '0'
                  }%
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                <div className="flex items-center mb-2">
                  <Calendar className="h-5 w-5 text-orange-600 mr-2" />
                  <span className="text-sm font-medium text-orange-800">This Week</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  {history.filter(s => new Date(s.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </div>
              </div>
            </div>

            {/* Recent Sessions */}
            <div>
              <h3 className="font-medium text-gray-700 mb-4">Recent Sessions</h3>
              <div className="space-y-3">
                {history.slice(0, 5).map((session, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-gray-800">{session.subject}</div>
                      <div className="text-sm text-gray-600">{session.topic}</div>
                    </div>
                    <div className="text-sm text-gray-600">{session.duration}min</div>
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

export default StudySession;