import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import Confetti from 'react-confetti';
import {
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAward,
  FiHelpCircle,
  FiRotateCw,
  FiCheck,
  FiX
} from 'react-icons/fi';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const ExamQAGenerator = () => {
  const axiosSecure = useAxiosSecure();
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
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [questionCount, setQuestionCount] = useState(5);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset questions when question type changes
  useEffect(() => {
    if (qnaList.length > 0) {
      setQnaList([]);
      setCurrentQuestionIndex(0);
      setShowAnswer(false);
      setUserAnswers({});
      setShowResults(false);
      setScore(0);
      setQuizFinished(false);
    }
  }, [questionType]);

  // timer for MCQ and true/false
  useEffect(() => {
    let interval;
    if ((questionType === 'mcq' || questionType === 'truefalse') && !showResults && qnaList.length > 0 && currentQuestionIndex < qnaList.length) {
      if (timer === 0) {
        handleNextQuestion();
      } else {
        interval = setInterval(() => setTimer((t) => t - 1), 1000);
      }
    }
    return () => clearInterval(interval);
  }, [timer, questionType, showResults, qnaList, currentQuestionIndex]);

  // keyboard shortcuts for MCQ and true/false
  const handleKeyPress = useCallback(
    (e) => {
      if ((questionType === 'mcq' || questionType === 'truefalse') && !showResults && qnaList[currentQuestionIndex]) {
        const key = e.key.toUpperCase();

        // For MCQ questions
        if (questionType === 'mcq' && ['A', 'B', 'C', 'D', '1', '2', '3', '4'].includes(key)) {
          const optionMap = { '1': 'A', '2': 'B', '3': 'C', '4': 'D' };
          const selectedOption = optionMap[key] || key;
          handleAnswerSelection(currentQuestionIndex, selectedOption);
        }

        // For true/false questions
        if (questionType === 'truefalse' && ['T', 'F', '1', '2'].includes(key)) {
          const optionMap = { 'T': 'true', 'F': 'false', '1': 'true', '2': 'false' };
          const selectedOption = optionMap[key];
          handleAnswerSelection(currentQuestionIndex, selectedOption);
        }

        // Navigation keys
        if (e.key === 'Enter') {
          handleNextQuestion();
        } else if (e.key === 'ArrowLeft') {
          handlePreviousQuestion();
        } else if (e.key === 'ArrowRight') {
          handleNextQuestion();
        }
      }
    },
    [currentQuestionIndex, questionType, showResults, qnaList]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const saveQuizResult = async (score, totalQuestions, topic, type, difficulty) => {
    try {
      const percentage = Math.round((score / totalQuestions) * 100);

      await axiosSecure.post('/quiz/results', {
        topic,
        score,
        totalQuestions,
        percentage,
        type,
        difficulty
      });

      // Success message (optional)
      toast.success('Quiz result saved!');
    } catch (error) {
      console.error('Error saving quiz result:', error);
      toast.error('Failed to save quiz result');
    }
  };

  const handleGenerateQnA = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);

    try {
      const response = await axiosSecure.post('/qa/generate-qa', {
        topic,
        difficulty,
        type: questionType,
        count: questionCount,
        language: selectedLanguage
      });

      if (Array.isArray(response.data)) {
        const questionsWithIds = response.data.map((q, index) => ({
          ...q,
          id: `q-${Date.now()}-${index}`
        }));
        setQnaList(questionsWithIds);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating Q&A:", error);
      toast.error(error.response?.data?.message || "Failed to generate Q&A.");
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
      if (questionType === 'mcq' || questionType === 'truefalse') {
        const finalScore = calculateScore();
        setShowResults(true);
        setQuizFinished(true);
        saveQuizResult(finalScore, qnaList.length, topic, questionType, difficulty);
      } else {
        setCurrentQuestionIndex(0);
        toast("You've completed all questions!", { icon: '👏' });
      }
    }
  };

  const handlePreviousQuestion = () => {
    setShowAnswer(false);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setTimer(30);
    }
  };

  const handleAnswerSelection = (questionId, selectedOption) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: selectedOption }));
  };

  const calculateScore = () => {
    let correctCount = 0;
    qnaList.forEach((qna, index) => {
      const userAnswer = userAnswers[index];
      const correctAnswer = qna.correctAnswer;
      if (userAnswer && correctAnswer &&
        userAnswer.toString().toLowerCase() === correctAnswer.toString().toLowerCase()) {
        correctCount++;
      }
    });
    setScore(correctCount);
    return correctCount;
  };

  const currentQnA = qnaList[currentQuestionIndex];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg">
        {quizFinished && score > qnaList.length / 2 && (
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            recycle={false}
            numberOfPieces={200}
          />
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Exam Q&A Generator</h1>
          <p className="text-gray-600">Enter a topic and let AI generate exam-style questions!</p>
        </div>

        <form onSubmit={handleGenerateQnA} className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl mb-8 border border-indigo-100">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-indigo-100">
                <FiHelpCircle className="text-indigo-600" />
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="bg-transparent focus:outline-none"
                  disabled={loading}
                >
                  <option value="short">Short Questions</option>
                  <option value="mcq">MCQ</option>
                  <option value="truefalse">True/False</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-indigo-100">
                <FiAward className="text-indigo-600" />
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="bg-transparent focus:outline-none"
                  disabled={loading}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-indigo-100">
                <span className="text-indigo-600">🌐</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-transparent focus:outline-none"
                  disabled={loading}
                >
                  <option value="en">English</option>
                  <option value="bn">Bengali</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-indigo-100">
                <span className="text-indigo-600">📝</span>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(parseInt(e.target.value))}
                  className="bg-transparent focus:outline-none"
                  disabled={loading}
                >
                  <option value={3}>3 Questions</option>
                  <option value={5}>5 Questions</option>
                  <option value={10}>10 Questions</option>
                  <option value={15}>15 Questions</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Photosynthesis, World War II, React Hooks"
              className="flex-grow p-3 border border-indigo-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
              disabled={loading}
            />
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center cursor-pointer justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <FiRotateCw className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  Generate Q&A
                </>
              )}
            </button>
          </div>
        </form>

        {qnaList.length > 0 && !showResults && (
          <div className="mt-8">
            {/* progress bar */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-600">
                Question {currentQuestionIndex + 1} of {qnaList.length}
              </span>
              {(questionType === 'mcq' || questionType === 'truefalse') && (
                <div className="flex items-center gap-1 text-sm font-medium text-purple-600">
                  <FiClock className="animate-pulse" />
                  <span>{timer}s remaining</span>
                </div>
              )}
            </div>

            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / qnaList.length) * 100}%` }}
              ></div>
            </div>

            {/* Question card */}
            <div className="bg-white border border-indigo-100 rounded-xl p-6 shadow-md mb-6 relative min-h-[250px] flex flex-col justify-between">
              <div>
                <div className="flex items-start mb-4">
                  <span className="bg-indigo-100 text-indigo-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded">
                    Q{currentQuestionIndex + 1}
                  </span>
                  <p className="text-lg font-medium text-gray-800 flex-1">
                    {currentQnA.question}
                  </p>
                </div>

                {questionType === 'mcq' && currentQnA.options && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {currentQnA.options.map((option, idx) => {
                      const optionKey = option.charAt(0);
                      const isSelected = userAnswers[currentQuestionIndex] === optionKey;

                      return (
                        <button
                          key={idx}
                          onClick={() => handleAnswerSelection(currentQuestionIndex, optionKey)}
                          className={`p-3 text-left rounded-lg border transition-all duration-200 cursor-pointer ${isSelected
                              ? 'bg-indigo-100 border-indigo-500 shadow-inner'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                            }`}
                        >
                          <div className="flex items-center">
                            <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mr-3 ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                              }`}>
                              {optionKey}
                            </span>
                            <span>{option.substring(3)}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {questionType === 'truefalse' && (
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <button
                      onClick={() => handleAnswerSelection(currentQuestionIndex, 'true')}
                      className={`p-4 rounded-lg border transition-all duration-200 flex items-center justify-center cursor-pointer ${userAnswers[currentQuestionIndex] === 'true'
                          ? 'bg-green-100 border-green-500 shadow-inner'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                    >
                      <div className="flex items-center">
                        <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 ${userAnswers[currentQuestionIndex] === 'true' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'
                          }`}>
                          <FiCheck size={16} />
                        </span>
                        <span className="font-medium">True</span>
                      </div>
                    </button>

                    <button
                      onClick={() => handleAnswerSelection(currentQuestionIndex, 'false')}
                      className={`p-4 rounded-lg border transition-all duration-200 flex items-center justify-center cursor-pointer${userAnswers[currentQuestionIndex] === 'false'
                          ? 'bg-red-100 border-red-500 shadow-inner'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                    >
                      <div className="flex items-center">
                        <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full mr-3 ${userAnswers[currentQuestionIndex] === 'false' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
                          }`}>
                          <FiX size={16} />
                        </span>
                        <span className="font-medium">False</span>
                      </div>
                    </button>
                  </div>
                )}

                {(questionType === 'short' || questionType === 'truefalse') && showAnswer && (
                  <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
                    <p className="text-indigo-800 font-semibold mb-2">Answer:</p>
                    <p className="text-gray-700">
                      {questionType === 'truefalse'
                        ? currentQnA.correctAnswer === 'true' ? 'True' : 'False'
                        : currentQnA.answer
                      }
                    </p>
                    {currentQnA.explanation && (
                      <div className="mt-3 pt-3 border-t border-indigo-100">
                        <p className="text-indigo-800 font-semibold mb-1">Explanation:</p>
                        <p className="text-gray-700 text-sm">{currentQnA.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex justify-center mt-6 gap-3">
                <button
                  onClick={handlePreviousQuestion}
                  className="px-4 py-2 bg-gray-100 text-gray-800 font-medium rounded-lg hover:bg-gray-200 transition-colors cursor-pointer duration-200 flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentQuestionIndex === 0}
                >
                  <FiChevronLeft /> Previous
                </button>

                {(questionType === 'short' || questionType === 'truefalse') && (
                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="px-4 py-2 bg-indigo-100 text-indigo-800 font-medium rounded-lg hover:bg-indigo-200 transition-colors duration-200 cursor-pointer"
                  >
                    {showAnswer ? 'Hide Answer' : 'Show Answer'}
                  </button>
                )}

                <button
                  onClick={handleNextQuestion}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-colors duration-200 flex items-center gap-1 cursor-pointer"
                >
                  {currentQuestionIndex === qnaList.length - 1 && (questionType === 'mcq' || questionType === 'truefalse')
                    ? 'Finish Quiz'
                    : 'Next'
                  }
                  <FiChevronRight />
                </button>
              </div>
            </div>

            {/* Keyboard shortcuts hint */}
            {questionType === 'mcq' && (
              <div className="text-center text-sm text-gray-500 mt-4">
                <p>Press <kbd className="px-2 py-1 bg-gray-100 rounded border">1-4</kbd> or <kbd className="px-2 py-1 bg-gray-100 rounded border">A-D</kbd> to select answers</p>
              </div>
            )}

            {questionType === 'truefalse' && (
              <div className="text-center text-sm text-gray-500 mt-4">
                <p>Press <kbd className="px-2 py-1 bg-gray-100 rounded border">T</kbd> for True or <kbd className="px-2 py-1 bg-gray-100 rounded border">F</kbd> for False</p>
              </div>
            )}
          </div>
        )}

        {/* Results section */}
        {showResults && (questionType === 'mcq' || questionType === 'truefalse') && (
          <div className="mt-8 bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-indigo-100">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                {score > qnaList.length / 2 ? 'Quiz Completed! 🎉' : 'Quiz Results'}
              </h2>
              <div className="inline-flex items-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full">
                <FiAward className="mr-2" />
                <span className="font-bold mr-1">{score}</span> out of <span className="font-bold ml-1">{qnaList.length}</span>
              </div>
              <p className="text-gray-600 mt-2">
                {score === qnaList.length ? 'Perfect score! Amazing! 🏆' :
                  score >= qnaList.length * 0.7 ? 'Great job! 👍' :
                    'Keep practicing! You\'ll get better! 💪'}
              </p>
            </div>

            <div className="space-y-4">
              {qnaList.map((qna, index) => {
                const userAnswer = userAnswers[index];
                const correctAnswer = qna.correctAnswer;
                const isCorrect = userAnswer && correctAnswer &&
                  userAnswer.toString().toLowerCase() === correctAnswer.toString().toLowerCase();

                return (
                  <div
                    key={qna.id || index}
                    className={`p-4 rounded-lg border ${isCorrect ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
                      }`}
                  >
                    <p className="font-semibold text-gray-800 mb-2">
                      Q{index + 1}: {qna.question}
                    </p>

                    {qna.options && (
                      <div className="space-y-2">
                        {qna.options.map((option, optIdx) => {
                          const optionKey = option.charAt(0);
                          const isCorrectOption = correctAnswer && optionKey.toUpperCase() === correctAnswer.toUpperCase();
                          const isUserSelection = userAnswer === optionKey;

                          return (
                            <div
                              key={optIdx}
                              className={`flex items-center p-2 rounded ${isCorrectOption ? 'bg-green-100' :
                                  isUserSelection && !isCorrectOption ? 'bg-red-100' : 'bg-gray-100'
                                }`}
                            >
                              <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${isCorrectOption ? 'bg-green-500 text-white' :
                                  isUserSelection && !isCorrectOption ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-700'
                                }`}>
                                {optionKey}
                              </span>
                              <span className="flex-1">{option.substring(3)}</span>
                              {isCorrectOption && <FiCheckCircle className="text-green-600 ml-2" />}
                              {isUserSelection && !isCorrectOption && <FiXCircle className="text-red-600 ml-2" />}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {questionType === 'truefalse' && (
                      <div className="mt-3">
                        <div className={`flex items-center p-2 rounded ${correctAnswer === 'true' ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                          <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${correctAnswer === 'true' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                            }`}>
                            <FiCheck size={14} />
                          </span>
                          <span className="flex-1">True</span>
                          {correctAnswer === 'true' && <FiCheckCircle className="text-green-600 ml-2" />}
                        </div>

                        <div className={`flex items-center p-2 rounded mt-2 ${correctAnswer === 'false' ? 'bg-green-100' : 'bg-gray-100'
                          }`}>
                          <span className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${correctAnswer === 'false' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                            }`}>
                            <FiX size={14} />
                          </span>
                          <span className="flex-1">False</span>
                          {correctAnswer === 'false' && <FiCheckCircle className="text-green-600 ml-2" />}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="text-sm">
                        Your answer: <span className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                          {userAnswer || 'No answer'}
                        </span>
                      </p>
                      {!isCorrect && correctAnswer && (
                        <p className="text-sm mt-1">
                          Correct answer: <span className="font-semibold text-green-700">
                            {questionType === 'truefalse'
                              ? correctAnswer === 'true' ? 'True' : 'False'
                              : correctAnswer
                            }
                          </span>
                        </p>
                      )}
                      {qna.explanation && (
                        <div className="mt-2 p-2 bg-indigo-50 rounded">
                          <p className="text-sm text-indigo-800 font-semibold">Explanation:</p>
                          <p className="text-sm text-indigo-700">{qna.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => {
                setQnaList([]);
                setTopic('');
                setShowResults(false);
                setCurrentQuestionIndex(0);
                setUserAnswers({});
                setScore(0);
                setQuizFinished(false);
              }}
              className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-colors duration-200 cursor-pointer"
            >
              Start New Quiz
            </button>
          </div>
        )}

        {qnaList.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <FiHelpCircle className="w-8 h-8 text-indigo-600" />
            </div>
            <p className="text-gray-500">No Q&A generated yet. Enter a topic and choose your question type above!</p>
            <p className="text-sm text-gray-400 mt-2">Try topics like "Photosynthesis", "World War II", or "JavaScript Basics"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamQAGenerator;