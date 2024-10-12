import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import TopicPage from './components/TopicPage';
import QuizAttempt from './components/QuizAttempt';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/topic/:topicName" element={<TopicPage />} />
            <Route path="/quiz/:topicName/:quizId" element={<QuizAttempt />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </Router>
  );
};

export default App;