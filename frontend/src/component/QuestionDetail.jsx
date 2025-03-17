import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState('');
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Add user state

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error("Error fetching session:", error);
        setUser(null);
      }
    };
    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchQuestion = async () => {
      setLoading(true);
      try {
        const { data: questionData, error } = await supabase
          .from('questions')
          .select('*, users(full_name)')
          .eq('id', id)
          .single();

        if (error) {
          console.error("Error fetching question:", error);
        } else {
          setQuestion(questionData);
        }
      } catch (error) {
        console.error("Error fetching question:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchAnswers = async () => {
      try {
        const { data: answersData, error } = await supabase
          .from('answers')
          .select('*, users(full_name)')
          .eq('question_id', id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Error fetching answers:", error);
        } else {
          setAnswers(answersData);
        }
      } catch (error) {
        console.error("Error fetching answers:", error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchQuestion(), fetchAnswers()]);
    };

    fetchData();
  }, [id]);

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    if (!user) {
      alert("Please log in to answer");
      return;
    }

    try{
      const { data, error } = await supabase
        .from('answers')
        .insert([{ question_id: id, answer_text: answerText, user_id: user.id }])
        .select('*, users(full_name)');

      if (!error) {
        setAnswers([data[0], ...answers]);
        setAnswerText('');
        setShowAnswerForm(false);
      } else {
        console.error("Error submitting answer:", error);
      }
    } catch(error){
      console.error("Error submitting answer:", error);
    }

  };

  if (loading) return <p>Loading...</p>;
  if (!question) return <p>Question not found.</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <div className="lg:col-span-3 bg-white p-6 shadow rounded-lg">
        <h1 className="text-2xl font-bold">{question.title}</h1>
        <p className="text-gray-600 my-4">{question.details}</p>
        <div className="text-sm text-gray-500">Asked by {question.users?.full_name}</div>

        <div className="mt-6">
          <h2 className="text-xl font-bold">Answers</h2>
          {answers.map((answer) => (
            <div key={answer.id} className="bg-gray-50 p-4 mt-4 rounded-lg">
              <p>{answer.answer_text}</p>
              <div className="text-sm text-gray-500">Answered by {answer.users?.full_name}</div>
            </div>
          ))}
        </div>

        {!showAnswerForm ? (
          <button
            onClick={() => setShowAnswerForm(true)}
            className="mt-4 bg-indigo-500 text-white px-4 py-2 rounded"
          >
            Write an Answer
          </button>
        ) : (
          <form onSubmit={handleSubmitAnswer} className="mt-4">
            <textarea
              className="w-full p-2 border"
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              required
            />
            <button
              type="submit"
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;