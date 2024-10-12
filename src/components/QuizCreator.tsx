import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { QuizSet, Question } from '../utils/storage';

interface QuizCreatorProps {
  onSave: (quizSet: QuizSet) => void;
  onCancel: () => void;
}

const QuizCreator: React.FC<QuizCreatorProps> = ({ onSave, onCancel }) => {
  const [quizName, setQuizName] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    option5: '',
    correctOption: 1,
    explanation: '',
  });

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({ ...prev, [name]: name === 'correctOption' ? parseInt(value) : value }));
  };

  const addQuestion = () => {
    setQuestions(prev => [...prev, currentQuestion]);
    setCurrentQuestion({
      question: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      option5: '',
      correctOption: 1,
      explanation: '',
    });
  };

  const handleSave = () => {
    const newQuizSet: QuizSet = {
      id: uuidv4(),
      name: quizName,
      questions: questions,
    };
    onSave(newQuizSet);
  };

  return (
    <div className="quiz-creator">
      <h2>Create New Quiz</h2>
      <input
        type="text"
        placeholder="Quiz Name"
        value={quizName}
        onChange={(e) => setQuizName(e.target.value)}
      />
      <div className="question-form">
        <textarea
          name="question"
          placeholder="Question"
          value={currentQuestion.question}
          onChange={handleQuestionChange}
        />
        {[1, 2, 3, 4, 5].map((num) => (
          <input
            key={num}
            type="text"
            name={`option${num}`}
            placeholder={`Option ${num}`}
            value={currentQuestion[`option${num}` as keyof Question]}
            onChange={handleQuestionChange}
          />
        ))}
        <select
          name="correctOption"
          value={currentQuestion.correctOption}
          onChange={handleQuestionChange}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              Option {num}
            </option>
          ))}
        </select>
        <textarea
          name="explanation"
          placeholder="Explanation"
          value={currentQuestion.explanation}
          onChange={handleQuestionChange}
        />
        <button onClick={addQuestion}>Add Question</button>
      </div>
      <div className="question-list">
        {questions.map((q, index) => (
          <div key={index} className="question-item">
            <p>{q.question}</p>
          </div>
        ))}
      </div>
      <button onClick={handleSave}>Save Quiz</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};

export default QuizCreator;