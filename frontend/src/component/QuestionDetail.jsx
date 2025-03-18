import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";

const QuestionDetail = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
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
      const { data: questionData, error } = await supabase
        .from("questions")
        .select("*, users(full_name)")
        .eq("id", id)
        .single();
      if (error) console.error("Fetch Question Error:", error);
      if (questionData) setQuestion(questionData);
      setLoading(false);
    };

    const fetchAnswers = async () => {
      const { data: answersData, error } = await supabase
        .from("answers")
        .select("*, users(full_name)")
        .eq("question_id", id)
        .order("like_count", { ascending: false });

      if (error) console.error("Fetch Answers Error:", error);
      if (answersData) setAnswers(answersData);
    };

    fetchQuestion();
    fetchAnswers();
  }, [id]);

  // ✅ Function to handle likes & dislikes
  const handleVote = async (answerId, voteType) => {
    if (!user) return alert("Please log in to vote.");

    // Fetch existing vote
    const { data: existingVotes, error: fetchError } = await supabase
  .from("answer_votes")
  .select("id, vote_type")
  .eq("user_id", user.id)
  .eq("answer_id", answerId);

if (fetchError) {
  console.error("Fetch Vote Error:", fetchError);
  return;
}

// Check if any vote exists (since .single() causes issues when no rows are found)
const existingVote = existingVotes?.length > 0 ? existingVotes[0] : null;


    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        // Remove vote if clicking the same button
        const { error } = await supabase
          .from("answer_votes")
          .delete()
          .eq("id", existingVote.id);
        if (error) console.error("Delete Vote Error:", error);
      } else {
        // Update vote type
        const { error } = await supabase
          .from("answer_votes")
          .update({ vote_type: voteType })
          .eq("id", existingVote.id);
        if (error) console.error("Update Vote Error:", error);
      }
    } else {
      // Insert new vote
      const { error } = await supabase
        .from("answer_votes")
        .insert([{ user_id: user.id, answer_id: answerId, vote_type: voteType }]);

      if (error) console.error("Insert Vote Error:", error);
    }

    // Refresh answer votes
    await updateAnswerVotes(answerId);
  };

  // ✅ Function to update answer's like/dislike count
  const updateAnswerVotes = async (answerId) => {
    const { data, error } = await supabase
      .from("answer_votes")
      .select("vote_type")
      .eq("answer_id", answerId);

    if (error) {
      console.error("Error fetching votes:", error);
      return;
    }

    const likeCount = data.filter(vote => vote.vote_type === 1).length;
    const dislikeCount = data.filter(vote => vote.vote_type === -1).length;

    // Update the answer in the database
    const { error: updateError } = await supabase
      .from("answers")
      .update({ like_count: likeCount, dislike_count: dislikeCount })
      .eq("id", answerId);

    if (updateError) console.error("Update Answer Votes Error:", updateError);

    // Refresh UI with updated counts
    const { data: updatedAnswers } = await supabase
      .from("answers")
      .select("*, users(full_name)")
      .eq("question_id", id)
      .order("like_count", { ascending: false });

    if (updatedAnswers) setAnswers(updatedAnswers);
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    if (!user) return alert("Please log in to answer");

    const { data, error } = await supabase
      .from("answers")
      .insert([{ question_id: id, answer_text: answerText, user_id: user.id }])
      .select("*, users(full_name)");

    if (error) {
      console.error("Submit Answer Error:", error);
      return;
    }

    if (data) {
      setAnswers([data[0], ...answers]);
      setAnswerText("");
      setShowAnswerForm(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!question) return <p>Question not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold">{question.title}</h1>
      <p className="text-gray-600 my-4">{question.details}</p>
      <div className="text-sm text-gray-500">Asked by {question.users?.full_name}</div>

      <div className="mt-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <MessageCircle size={24} /> Answers
        </h2>

        {answers.map((answer) => (
          <div key={answer.id} className="bg-gray-50 p-4 mt-4 rounded-lg flex justify-between">
            <div>
              <p className="text-gray-800">{answer.answer_text}</p>
              <div className="text-sm text-gray-500 mt-1">Answered by {answer.users?.full_name}</div>
            </div>

            <div className="flex flex-col items-center">
              <button
                onClick={() => handleVote(answer.id, 1)}
                className="text-green-500 hover:text-green-700 transition-all"
                title="Like"
              >
                <ThumbsUp size={22} />
              </button>
              <span className="text-gray-700">{answer.like_count || 0}</span>

              <button
                onClick={() => handleVote(answer.id, -1)}
                className="text-red-500 hover:text-red-700 transition-all mt-2"
                title="Dislike"
              >
                <ThumbsDown size={22} />
              </button>
              <span className="text-gray-700">{answer.dislike_count || 0}</span>
            </div>
          </div>
        ))}
      </div>

      {!showAnswerForm ? (
        <button
          onClick={() => setShowAnswerForm(true)}
          className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded shadow-lg hover:bg-indigo-700 transition"
        >
          Write an Answer
        </button>
      ) : (
        <form onSubmit={handleSubmitAnswer} className="mt-6">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-indigo-200"
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            required
          />
          <button type="submit" className="mt-2 bg-green-600 text-white px-4 py-2 rounded shadow-lg hover:bg-green-700 transition">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default QuestionDetail;
