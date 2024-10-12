import React from 'react';
import { Link } from 'react-router-dom';

const topics = ['Reasoning', 'Quants', 'Current Affairs', 'English'];

const HomePage: React.FC = () => {
  return (
    <div className="App">
      <header className="header">
        <h1>Offline Quiz App</h1>
        <button className="menu-button">☰</button>
      </header>
      <div className="quiz-container">
        <h2>Select a Topic</h2>
        <div className="topic-list">
          {topics.map((topic) => (
            <Link key={topic} to={`/topic/${topic.toLowerCase()}`} className="nav-button">
              {topic}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;