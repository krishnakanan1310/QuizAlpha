import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { QuizSet, Question, getQuizSet } from '../utils/storage';

const QuizAttempt: React.FC = () => {
  const { topicName, quizId } = useParams<{ topicName: string; quizId: string }>();
  const navigate = useNavigate();
  const [quizSet, setQuizSet] = useState<QuizSet | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(600); // 10 minutes in seconds
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<number[]>([]);

  useEffect(() => {
    if (topicName && quizId) {
      const loadedQuizSet = getQuizSet(topicName, quizId);
      if (loadedQuizSet) {
        setQuizSet(loadedQuizSet);
        const storedBookmarks = localStorage.getItem(`bookmarks_${quizId}`);
        if (storedBookmarks) {
          setBookmarkedQuestions(JSON.parse(storedBookmarks));
        }
      } else {
        setError("Quiz not found. It may have been deleted or doesn't exist.");
      }
    }
  }, [topicName, quizId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
    setShowExplanation(true);
    if (quizSet && optionIndex === quizSet.questions[currentQuestionIndex].correctOption) {
      setScore((prevScore) => prevScore + 1);
    }
  };

  const handleNextQuestion = () => {
    if (quizSet && currentQuestionIndex < quizSet.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      // Quiz finished
      alert(`Quiz completed! Your score: ${score}/${quizSet?.questions.length}`);
      navigate(`/topic/${topicName}`);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const toggleBookmark = () => {
    const updatedBookmarks = bookmarkedQuestions.includes(currentQuestionIndex)
      ? bookmarkedQuestions.filter(index => index !== currentQuestionIndex)
      : [...bookmarkedQuestions, currentQuestionIndex];
    
    setBookmarkedQuestions(updatedBookmarks);
    localStorage.setItem(`bookmarks_${quizId}`, JSON.stringify(updatedBookmarks));
  };

  const goToBookmarkedQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  if (error) {
    return (
      <div className="quiz-attempt error">
        <h1>Error</h1>
        <p>{error}</p>
        <Link to={`/topic/${topicName}`}>Back to Topic</Link>
      </div>
    );
  }

  if (!quizSet || quizSet.questions.length === 0) {
    return <div className="quiz-attempt loading">Loading...</div>;
  }

  const currentQuestion: Question = quizSet.questions[currentQuestionIndex];

  if (!currentQuestion) {
    return (
      <div className="quiz-attempt error">
        <h1>Error</h1>
        <p>No questions found in this quiz.</p>
        <Link to={`/topic/${topicName}`}>Back to Topic</Link>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="header">
        <button className="back-button" onClick={() => navigate(`/topic/${topicName}`)}>←</button>
        <h1>{quizSet.name}</h1>
        <button className="menu-button">☰</button>
      </header>
      <div className="quiz-container">
        <div className="timer">
          Time: {Math.floor(timeRemaining / 60)}:{timeRemaining % 60 < 10 ? '0' : ''}{timeRemaining % 60}
        </div>
        <div className="question-info">
          <span className="question-number">Question {currentQuestionIndex + 1}/{quizSet.questions.length}</span>
          <button className="bookmark-button" onClick={toggleBookmark}>
            {bookmarkedQuestions.includes(currentQuestionIndex) ? '★' : '☆'}
          </button>
        </div>
        <div className="question">{currentQuestion.question}</div>
        <div className="options">
          {[1, 2, 3, 4, 5].map((optionNum) => (
            <button
              key={optionNum}
              onClick={() => handleOptionSelect(optionNum)}
              disabled={selectedOption !== null}
              className={`option ${selectedOption === optionNum ? (optionNum === currentQuestion.correctOption ? 'correct' : 'incorrect') : ''} ${selectedOption === optionNum ? 'selected' : ''}`}
            >
              {currentQuestion[`option${optionNum}` as keyof Question]}
            </button>
          ))}
        </div>
        {showExplanation && (
          <div className="explanation">
            <p>Explanation: {currentQuestion.explanation}</p>
          </div>
        )}
        <div className="navigation">
          <button className="nav-button" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
          <button className="nav-button" onClick={handleNextQuestion} disabled={selectedOption === null}>
            {currentQuestionIndex < quizSet.questions.length - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
        {bookmarkedQuestions.length > 0 && (
          <div className="bookmarked-questions">
            <h2>Bookmarked Questions</h2>
            <div className="bookmarked-list">
              {bookmarkedQuestions.map((index) => (
                <button key={index} className="bookmarked-item" onClick={() => goToBookmarkedQuestion(index)}>
                  Q{index + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizAttempt;