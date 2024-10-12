import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QuizSet, getQuizSets, saveQuizSet, deleteQuizSet } from '../utils/storage';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const TopicPage: React.FC = () => {
  const { topicName } = useParams<{ topicName: string }>();
  const [quizSets, setQuizSets] = useState<QuizSet[]>([]);
  const nodeRef = useRef(null);

  useEffect(() => {
    if (topicName) {
      setQuizSets(getQuizSets(topicName));
    }
  }, [topicName]);

  const handleSaveQuiz = (newQuizSet: QuizSet) => {
    if (topicName) {
      saveQuizSet(topicName, newQuizSet);
      setQuizSets(getQuizSets(topicName));
    }
  };

  const handleDeleteQuiz = (id: string) => {
    if (topicName && window.confirm('Are you sure you want to delete this quiz?')) {
      deleteQuizSet(topicName, id);
      setQuizSets(getQuizSets(topicName));
    }
  };

  const handleExportQuiz = (quizSet: QuizSet) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quizSet.questions));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${quizSet.name}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportQuiz = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const questions = JSON.parse(e.target?.result as string);
          const newQuizSet: QuizSet = {
            id: Date.now().toString(),
            name: file.name.replace('.json', ''),
            questions: questions,
          };
          handleSaveQuiz(newQuizSet);
        } catch (error) {
          alert('Error importing quiz: Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="App">
      <header className="header">
        <Link to="/" className="back-button">←</Link>
        <h1>{topicName} Quizzes</h1>
        <button className="menu-button">☰</button>
      </header>
      <div className="quiz-container">
        <div className="action-buttons">
          <label className="nav-button">
            Import Quiz
            <input type="file" accept=".json" onChange={handleImportQuiz} style={{ display: 'none' }} />
          </label>
        </div>
        <TransitionGroup className="quiz-list">
          {quizSets.map((quizSet) => (
            <CSSTransition key={quizSet.id} timeout={300} classNames="fade" nodeRef={nodeRef}>
              <div ref={nodeRef} className="quiz-item">
                <h3>{quizSet.name}</h3>
                <div className="quiz-actions">
                  <Link to={`/quiz/${topicName}/${quizSet.id}`} className="nav-button">Attempt Quiz</Link>
                  <button onClick={() => handleDeleteQuiz(quizSet.id)} className="nav-button">Delete</button>
                  <button onClick={() => handleExportQuiz(quizSet)} className="nav-button">Export</button>
                </div>
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </div>
  );
};

export default TopicPage;