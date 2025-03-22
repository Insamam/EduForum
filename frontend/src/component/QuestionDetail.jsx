import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import recommendBestAnswer from "./recommendBestAnswer";

import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  User,
  Calendar,
  Edit,
  Send,
  Trash2,
  X,
  Save,
  CheckCircle,
} from "lucide-react";

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [showAnswerForm, setShowAnswerForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDetails, setEditedDetails] = useState("");
  const [recommendedAnswerId, setRecommendedAnswerId] = useState(null);
  const [editingAnswerId, setEditingAnswerId] = useState(null);
  const [editedAnswerText, setEditedAnswerText] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        const { data: teacherData, error } = await supabase
          .from('teachers')
          .select('*')
          .eq('user_id', session.user.id)
          .single({
            headers: { 'Accept': 'application/json' },
          });

        if (error) {
          console.error("Error fetching teacher data:", error);
          setIsTeacher(false); // Default to false if error occurs
        } else {
          setIsTeacher(!!teacherData);
        }
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
      const { data: questionData, error } = await supabase
        .from("questions")
        .select("*, users(full_name)")
        .eq("id", id)
        .single();
      if (questionData) {
        setQuestion(questionData);
        setEditedTitle(questionData.title);
        setEditedDetails(questionData.details);
      } else if (error) {
        console.error("Error fetching question:", error);
      }
      setLoading(false);
    };

    const fetchAnswers = async () => {
      const { data: answersData, error } = await supabase
        .from("answers")
        .select("*, users(full_name)")
        .eq("question_id", id)
        .order("like_count", { ascending: false });

      if (answersData) {
        setAnswers(answersData);
      } else if (error) {
        console.error("Error fetching answers:", error);
      }
    };

    fetchQuestion();
    fetchAnswers();
  }, [id]);

  useEffect(() => {
    const getRecommendedAnswer = async () => {
      if (answers.length > 0 && question) {
        const recommendedId = await recommendBestAnswer(question.details, answers);
        setRecommendedAnswerId(recommendedId);
      }
    };
    getRecommendedAnswer();
  }, [answers, question]);

  const handleQuestionLike = async () => {
    if (!user) return alert("Please log in to like the question.");

    const { data: existingVote, error: fetchError } = await supabase
      .from("question_votes")
      .select("id")
      .eq("user_id", user.id)
      .eq("question_id", id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Fetch Vote Error:", fetchError);
      return;
    }

    if (existingVote) {
      const { error } = await supabase
        .from("question_votes")
        .delete()
        .eq("id", existingVote.id);
      if (error) console.error("Error deleting vote:", error);
    } else {
      const { error } = await supabase
        .from("question_votes")
        .insert([{ user_id: user.id, question_id: id }]);
      if (error) console.error("Error inserting vote:", error);
    }

    await updateQuestionLikes();
  };

  const updateQuestionLikes = async () => {
    const { data, error } = await supabase
      .from("question_votes")
      .select("id")
      .eq("question_id", id);

    if (error) {
      console.error("Error fetching likes:", error);
      return;
    }

    const likeCount = data.length;

    const { error: updateError } = await supabase
      .from("questions")
      .update({ like_count: likeCount })
      .eq("id", id);

    if (updateError) console.error("Update Question Likes Error:", updateError);

    setQuestion((prev) => prev ? { ...prev, like_count: likeCount } : prev);
  };

  const handleVote = async (answerId, voteType) => {
    if (!user) return alert("Please log in to vote.");

    const { data: existingVotes, error: fetchError } = await supabase
      .from("answer_votes")
      .select("id, vote_type")
      .eq("user_id", user.id)
      .eq("answer_id", answerId);

    if (fetchError) {
      console.error("Fetch Vote Error:", fetchError);
      return;
    }

    const existingVote = existingVotes?.length > 0 ? existingVotes[0] : null;

    if (existingVote) {
      if (existingVote.vote_type === voteType) {
        const { error } = await supabase
          .from("answer_votes")
          .delete()
          .eq("id", existingVote.id);
        if (error) console.error("Error deleting vote:", error);
      } else {
        const { error } = await supabase
          .from("answer_votes")
          .update({ vote_type: voteType })
          .eq("id", existingVote.id);
        if (error) console.error("Error updating vote:", error);
      }
    } else {
      const { error } = await supabase
        .from("answer_votes")
        .insert([{ user_id: user.id, answer_id: answerId, vote_type: voteType }]);
      if (error) console.error("Error inserting vote:", error);
    }

    await updateAnswerVotes(answerId);
  };

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

    const { error: updateError } = await supabase
      .from("answers")
      .update({ like_count: likeCount, dislike_count: dislikeCount })
      .eq("id", answerId);
    if (updateError) console.error("Error updating answer votes:", updateError);

    const { data: updatedAnswers, error: answersError } = await supabase
      .from("answers")
      .select("*, users(full_name)")
      .eq("question_id", id)
      .order("like_count", { ascending: false });

    if (updatedAnswers) {
      setAnswers(updatedAnswers);
    } else if (answersError) {
      console.error("Error fetching updated answers:", answersError);
    }
  };

  const handleVerifyAnswer = async (answerId) => {
    if (!isTeacher) return;

    const { error } = await supabase
      .from('answers')
      .update({ is_verified: true })
      .eq('id', answerId);

    if (error) {
      console.error('Error verifying answer:', error);
      return;
    }

    setAnswers(answers.map(answer =>
      answer.id === answerId ? { ...answer, is_verified: true } : answer
    ));
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to submit an answer.");
    if (!answerText.trim()) return alert("Answer cannot be empty.");

    const { error } = await supabase
      .from("answers")
      .insert([{
        answer_text: answerText,
        question_id: id,
        user_id: user.id,
        is_verified: false
      }]);

    if (error) {
      console.error("Error submitting answer:", error);
      return;
    }

    setAnswerText("");
    setShowAnswerForm(false);

    const { data: updatedAnswers, error: answersError } = await supabase
      .from("answers")
      .select("*, users(full_name)")
      .eq("question_id", id)
      .order("like_count", { ascending: false });

    if (updatedAnswers) {
      setAnswers(updatedAnswers);
    } else if (answersError) {
      console.error("Error fetching updated answers:", answersError);
    }
  };

  const handleEditQuestion = async () => {
    if (!user) return alert("Please log in to edit the question.");
    if (user.id !== question.user_id) return alert("You can only edit your own questions.");

    if (!editedTitle.trim() || !editedDetails.trim()) {
      return alert("Title and details cannot be empty.");
    }

    const { error } = await supabase
      .from("questions")
      .update({
        title: editedTitle,
        details: editedDetails,
        updated_at: new Date().toISOString()
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating question:", error);
      return alert("Failed to update question.");
    }

    setQuestion(prev => ({
      ...prev,
      title: editedTitle,
      details: editedDetails,
      updated_at: new Date().toISOString()
    }));
    setIsEditing(false);
  };

  const handleDeleteQuestion = async () => {
    if (!user) return alert("Please log in to delete the question.");
    if (user.id !== question.user_id) return alert("You can only delete your own questions.");

    if (!window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      return;
    }

    const { error } = await supabase
      .from("questions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting question:", error);
      return alert("Failed to delete question.");
    }

    navigate("/");
  };

  const reorderAnswers = (answers, recommendedId) => {
    if (!recommendedId) return answers;

    const recommendedIndex = answers.findIndex((answer) => answer.id === recommendedId);
    if (recommendedIndex === -1) return answers;

    const recommendedAnswer = answers.splice(recommendedIndex, 1)[0];
    return [recommendedAnswer, ...answers];
  };

  const orderedAnswers = reorderAnswers([...answers], recommendedAnswerId);

  const handleEditAnswer = (answerId, answerText) => {
    setEditingAnswerId(answerId);
    setEditedAnswerText(answerText);
  };

  const handleUpdateAnswer = async (answerId) => {
    if (!user) return alert("Please log in to edit the answer.");
    if (!editedAnswerText.trim()) return alert("Answer cannot be empty.");

    const { error } = await supabase
      .from("answers")
      .update({ answer_text: editedAnswerText })
      .eq("id", answerId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error updating answer:", error);
      return;
    }

    setEditingAnswerId(null);
    setEditedAnswerText("");

    const { data: updatedAnswers, error: answersError } = await supabase
      .from("answers")
      .select("*, users(full_name)")
      .eq("question_id", id)
      .order("like_count", { ascending: false });

    if (updatedAnswers) {
      setAnswers(updatedAnswers);
    } else if (answersError) {
      console.error("Error fetching updated answers:", answersError);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    if (!user) return alert("Please log in to delete the answer.");

    const { error } = await supabase
      .from("answers")
      .delete()
      .eq("id", answerId)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting answer:", error);
      return;
    }

    const { data: updatedAnswers, error: answersError } = await supabase
      .from("answers")
      .select("*, users(full_name)")
      .eq("question_id", id)
      .order("like_count", { ascending: false });

    if (updatedAnswers) {
      setAnswers(updatedAnswers);
    } else if (answersError) {
      console.error("Error fetching updated answers:", answersError);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!question) return <p>Question not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl transition-all duration-300 ease-in-out">
      {/* Question Details */}
      <div className="mb-10 border-b pb-6">
        {isEditing ? (
          <div className="space-y-4">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full text-3xl font-bold p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={editedDetails}
              onChange={(e) => setEditedDetails(e.target.value)}
              className="w-full h-32 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <button
                onClick={handleEditQuestion}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <Save size={20} /> Save Changes
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedTitle(question.title);
                  setEditedDetails(question.details);
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <X size={20} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                <Edit className="text-blue-600" size={28} /> {question.title}
              </h1>
              {user && user.id === question.user_id && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg transition-colors duration-200"
                  >
                    <Edit size={20} />
                  </button>
                  <button
                    onClick={handleDeleteQuestion}
                    className="text-red-600 hover:text-red-800 p-2 rounded-lg transition-colors duration-200"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )}
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">{question.details}</p>
          </>
        )}
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <User className="mr-2" size={18} /> {question.users?.full_name}
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <Calendar className="mr-2" size={18} /> Asked on: {new Date(question.created_at).toLocaleDateString()}
        </div>
        <div className="flex items-center">
          <button onClick={handleQuestionLike} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200">
            <ThumbsUp className="mr-2" size={22} /> Like
          </button>
          <span className="ml-2 text-gray-700">{question.like_count || 0}</span>
        </div>
      </div>

      {/* Answers Section */}
      <div>
        <h2 className="text-3xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
          <MessageCircle className="text-indigo-600" size={26} /> Answers
        </h2>
        {orderedAnswers.map((answer) => (
          <div key={answer.id} className={`p-6 bg-gray-50 rounded-xl mb-6 border border-gray-200 transition-shadow duration-300 hover:shadow-md ${recommendedAnswerId === answer.id ? 'border-blue-500 shadow-lg' : ''}`}>
            <div className="flex justify-between items-start mb-4">
              {editingAnswerId === answer.id ? (
                <textarea
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  value={editedAnswerText}
                  onChange={(e) => setEditedAnswerText(e.target.value)}
                />
              ) : (
                <p className="text-gray-800 leading-relaxed">
                  {answer.answer_text}
                  {recommendedAnswerId === answer.id && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800">
                      AI Recommended
                    </span>
                  )}
                </p>
              )}
              {answer.is_verified && (
                <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  <CheckCircle size={16} />
                  <span className="text-sm font-medium">Verified Teacher</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 flex items-center">
                <User className="mr-2" size={18} /> {answer.users?.full_name}
              </div>
              <div className="flex items-center space-x-3">
                {isTeacher && !answer.is_verified && (
                  <button
                    onClick={() => handleVerifyAnswer(answer.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2"
                  >
                    <CheckCircle size={16} /> Verify
                  </button>
                )}
                <button onClick={() => handleVote(answer.id, 1)} className="text-green-600 hover:text-green-800 transition-colors duration-200">
                  <ThumbsUp size={22} />
                </button>
                <span className="text-gray-700">{answer.like_count || 0}</span>
                <button onClick={() => handleVote(answer.id, -1)} className="text-red-600 hover:text-red-800 transition-colors duration-200">
                  <ThumbsDown size={22} />
                </button>
                <span className="text-gray-700">{answer.dislike_count || 0}</span>
                {user && user.id === answer.user_id && (
                  <>
                    {editingAnswerId === answer.id ? (
                      <button
                        onClick={() => handleUpdateAnswer(answer.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm flex items-center gap-2"
                      >
                        <Save size={16} /> Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEditAnswer(answer.id, answer.answer_text)}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                      >
                        <Edit size={20} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAnswer(answer.id)}
                      className="text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Answer Form */}
      <div className="mt-10">
        {!showAnswerForm ? (
          <button onClick={() => setShowAnswerForm(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center gap-3">
            <Edit size={20} /> Write an Answer
          </button>
        ) : (
          <form className="mt-6" onSubmit={handleSubmitAnswer}>
            <textarea
              className="w-full p-4 border rounded-xl mb-4 focus:ring-2 focus:ring-indigo-200 transition-shadow duration-300"
              placeholder="Your answer..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
            />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center gap-3">
              <Send size={20} /> Submit Answer
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;