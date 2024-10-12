export interface Question {
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  option5: string;
  correctOption: number;
  explanation: string;
}

export interface QuizSet {
  id: string;
  name: string;
  questions: Question[];
}

export const saveQuizSet = (topic: string, quizSet: QuizSet): void => {
  const quizSets = getQuizSets(topic);
  const updatedQuizSets = [...quizSets.filter(qs => qs.id !== quizSet.id), quizSet];
  localStorage.setItem(`quizSets_${topic}`, JSON.stringify(updatedQuizSets));
};

export const getQuizSets = (topic: string): QuizSet[] => {
  const quizSetsJson = localStorage.getItem(`quizSets_${topic}`);
  return quizSetsJson ? JSON.parse(quizSetsJson) : [];
};

export const getQuizSet = (topic: string, id: string): QuizSet | null => {
  const quizSets = getQuizSets(topic);
  return quizSets.find(qs => qs.id === id) || null;
};

export const deleteQuizSet = (topic: string, id: string): void => {
  const quizSets = getQuizSets(topic);
  const updatedQuizSets = quizSets.filter(qs => qs.id !== id);
  localStorage.setItem(`quizSets_${topic}`, JSON.stringify(updatedQuizSets));
};