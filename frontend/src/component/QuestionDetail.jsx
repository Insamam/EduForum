import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ThumbsUp, ThumbsDown, MessageSquare, Award, Flag, Share2, BookmarkPlus, CheckCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [relatedQuestions, setRelatedQuestions] = useState([]);
  const [answerText, setAnswerText] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      const { data: questionData, error } = await supabase
        .from('questions')
        .select('*')
        .eq('id', id)
        .single();
      if (!error) setQuestion(questionData);
    };

    const fetchAnswers = async () => {
      const { data: answersData, error } = await supabase
        .from('answers')
        .select('*')
        .eq('question_id', id)
        .order('votes', { ascending: false });
      if (!error) setAnswers(answersData);
    };

    const fetchRelatedQuestions = async () => {
      const { data: relatedData, error } = await supabase
        .from('questions')
        .select('id, title')
        .neq('id', id)
        .limit(5);
      if (!error) setRelatedQuestions(relatedData);
    };

    fetchQuestion();
    fetchAnswers();
    fetchRelatedQuestions();
  }, [id]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    const { data, error } = await supabase
      .from('answers')
      .insert([{ question_id: id, body: answerText, votes: 0 }]);

    if (!error) {
      setAnswers([data[0], ...answers]);
      setAnswerText('');
      setShowAnswerForm(false);
    }
  };

  if (!question) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 bg-white p-6 shadow rounded-lg">
        <h1 className="text-2xl font-bold">{question.title}</h1>
        <p className="text-gray-600 my-4">{question.body}</p>
        <div className="text-sm text-gray-500">Asked by {question.author}</div>

        <div className="mt-6">
          <h2 className="text-xl font-bold">Answers</h2>
          {answers.map(answer => (
            <div key={answer.id} className="bg-gray-50 p-4 mt-4 rounded-lg">
              <p>{answer.body}</p>
              <div className="text-sm text-gray-500">Votes: {answer.votes}</div>
            </div>
          ))}
        </div>

        {!showAnswerForm ? (
          <button onClick={() => setShowAnswerForm(true)} className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded">
            Write an Answer
          </button>
        ) : (
          <form onSubmit={handleSubmitAnswer} className="mt-4">
            <textarea className="w-full p-2 border" value={answerText} onChange={(e) => setAnswerText(e.target.value)} required />
            <button type="submit" className="mt-2 bg-green-500 text-white px-4 py-2 rounded">Submit</button>
          </form>
        )}
      </div>

      <div className="lg:col-span-1 bg-white p-4 shadow rounded-lg">
        <h3 className="text-lg font-semibold">Related Questions</h3>
        <ul className="mt-3 space-y-2">
          {relatedQuestions.map(q => (
            <li key={q.id}>
              <a href={`/questions/${q.id}`} className="text-blue-600 hover:underline">
                {q.title}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuestionDetail;