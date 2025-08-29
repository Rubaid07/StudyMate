import React, { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';
import Confetti from 'react-confetti';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ExamQAGenerator = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [qnaList, setQnaList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questionType, setQuestionType] = useState('short');
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30); 
  const [quizFinished, setQuizFinished] = useState(false);

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (questionType === 'mcq' && !showResults && qnaList.length > 0) {
      if (timer === 0) {
        handleNextQuestion();
      }
      const interval = setInterval(() => setTimer((t) => (t > 0 ? t - 1 : 0)), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, questionType, showResults, qnaList]);

  const handleKeyPress = useCallback(
    (e) => {
      if (questionType === 'mcq' && !showResults && qnaList[currentQuestionIndex]) {
        const key = e.key.toUpperCase();
        if (['A', 'B', 'C', 'D'].includes(key)) {
          handleAnswerSelection(currentQuestionIndex, key);
        }
      }
    },
    [currentQuestionIndex, questionType, showResults, qnaList]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const handleGenerateQnA = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error("Please enter a topic to generate Q&A.");
      return;
    }

    setLoading(true);
    setQnaList([]);
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
    setUserAnswers({});
    setScore(0);
    setShowResults(false);
    setQuizFinished(false);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/generate-qa`,
        { topic, difficulty, type: questionType, count: 5 },
        { headers: { 'x-user-id': user?.uid } }
      );
      setQnaList(response.data);
      toast.success("Q&A generated successfully!");
      setTimer(30);
    } catch (error) {
      console.error('Error generating Q&A:', error);
      toast.error("Failed to generate Q&A. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    setShowAnswer(false);
    if (currentQuestionIndex < qnaList.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTimer(30);
    } else {
      if (questionType === 'mcq') {
        calculateScore();
        setShowResults(true);
        setQuizFinished(true);
      } else {
        setCurrentQuestionIndex(0);
        toast("You've completed this set of short questions!", { icon: '👏' });
      }
    }
  };

  const handlePreviousQuestion = () => {
    setShowAnswer(false);
    setCurrentQuestionIndex((prev) => (prev - 1 + qnaList.length) % qnaList.length);
    setTimer(30);
  };

  const handleAnswerSelection = (questionId, selectedOption) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    qnaList.forEach((qna, index) => {
      if (questionType === 'mcq' && userAnswers[index] === qna.answer) {
        correctCount++;
      }
    });
    setScore(correctCount);
  };

  const currentQnA = qnaList[currentQuestionIndex];

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg min-h-full relative">
      {quizFinished && score > qnaList.length / 2 && <Confetti />}
      
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Exam Q&A Generator</h1>
      <p className="text-gray-600 mb-6">Enter a topic and let AI generate exam-style questions!</p>

      <form onSubmit={handleGenerateQnA} className="flex flex-col gap-4 mb-8">
        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <input type="radio" value="short" checked={questionType === 'short'} onChange={() => setQuestionType('short')} disabled={loading}/>
            Short Questions
          </label>
          <label className="flex items-center gap-2 text-gray-700 font-medium">
            <input type="radio" value="mcq" checked={questionType === 'mcq'} onChange={() => setQuestionType('mcq')} disabled={loading}/>
            MCQ
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border rounded-lg p-2 text-gray-700"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Photosynthesis, World War II, React Hooks"
            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            disabled={loading}
          />
          <button type="submit" className="px-6 py-3 bg-cyan-700 text-white font-semibold rounded-lg shadow-md hover:bg-cyan-800 transition-colors duration-200 disabled:opacity-50" disabled={loading}>
            {loading ? 'Generating...' : 'Generate Q&A'}
          </button>
        </div>
      </form>

      {qnaList.length > 0 && !showResults && (
        <div>
          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div className="bg-cyan-600 h-2 rounded-full" style={{ width: `${((currentQuestionIndex + 1) / qnaList.length) * 100}%` }}></div>
          </div>
          
          <div className="bg-blue-50 border rounded-xl p-6 shadow-md mb-6 relative">
            <p className="text-lg font-medium text-gray-800 mb-4">
              <strong>Question {currentQuestionIndex + 1}/{qnaList.length}:</strong> {currentQnA.question}
            </p>

            {questionType === 'mcq' && currentQnA.options && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Time left: {timer}s</p>
                {currentQnA.options.map((option, idx) => (
                  <label key={idx} className="block mb-2">
                    <input type="radio" name={`question-${currentQuestionIndex}`} value={option.charAt(0)} checked={userAnswers[currentQuestionIndex] === option.charAt(0)} onChange={() => handleAnswerSelection(currentQuestionIndex, option.charAt(0))}/>
                    <span className="ml-2">{option}</span>
                  </label>
                ))}
              </div>
            )}

            {questionType === 'short' && showAnswer && (
              <p className="mt-4"><strong>Answer:</strong> {currentQnA.answer}</p>
            )}

            <div className="flex justify-between mt-6">
              <button onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0} className="px-4 py-2 bg-gray-200 rounded-lg">Previous</button>
              {questionType === 'short' && (
                <button onClick={() => setShowAnswer(!showAnswer)} className="px-4 py-2 bg-blue-500 text-white rounded-lg">
                  {showAnswer ? 'Hide Answer' : 'Show Answer'}
                </button>
              )}
              <button onClick={handleNextQuestion} className="px-4 py-2 bg-cyan-700 text-white rounded-lg">
                {currentQuestionIndex === qnaList.length - 1 && questionType === 'mcq' ? 'Finish Quiz' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {showResults && questionType === 'mcq' && (
        <div className="mt-8">
          <h2 className="text-3xl font-bold mb-4 text-center">Quiz Results 🎉</h2>
          <p className="text-lg text-center mb-6">You scored <strong>{score}</strong> out of <strong>{qnaList.length}</strong></p>
          <button onClick={() => {setQnaList([]);setTopic('');setShowResults(false);setCurrentQuestionIndex(0);setUserAnswers({});setScore(0);}} className="mt-4 w-full px-4 py-2 bg-cyan-700 text-white rounded-lg">
            Start New Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default ExamQAGenerator;
