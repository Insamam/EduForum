import {
  BookOpen,
  Brain,
  Clock,
  GraduationCap,
  Heart,
  MessageSquare,
  ThumbsUp,
  Share2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  User,
  Edit,
  Trash2,
  Save,
  X,
  Calendar
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

function StatCard({ icon: Icon, title, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 transform transition-transform hover:scale-105">
      <div className="flex items-center">
        <div className={`rounded-xl p-3 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          <p className="text-sm text-gray-600">{title}</p>
        </div>
      </div>
    </div>
  );
}

function PostsList({ posts, onUpdate, onDelete }) {
  const [expandedPost, setExpandedPost] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDetails, setEditedDetails] = useState("");

  const startEditing = (post) => {
    setEditingId(post.id);
    setEditedTitle(post.title);
    setEditedDetails(post.details);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedTitle("");
    setEditedDetails("");
  };

  const handleEdit = async (postId) => {
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
      .eq("id", postId);

    if (error) {
      console.error("Error updating question:", error);
      return alert("Failed to update question.");
    }

    setEditingId(null);
    onUpdate();
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this question? This action cannot be undone.")) {
      return;
    }

    const { error } = await supabase
      .from("questions")
      .delete()
      .eq("id", postId);

    if (error) {
      console.error("Error deleting question:", error);
      return alert("Failed to delete question.");
    }

    onDelete();
  };

  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">You haven't posted any questions yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div 
          key={post.id} 
          className="p-6 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          {editingId === post.id ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full text-xl font-semibold p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Question title"
              />
              <textarea
                value={editedDetails}
                onChange={(e) => setEditedDetails(e.target.value)}
                className="w-full h-32 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Question details"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(post.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Save size={20} /> Save Changes
                </button>
                <button
                  onClick={cancelEditing}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <X size={20} /> Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    {post.subject || 'General'}
                  </span>
                  <button
                    onClick={() => startEditing(post)}
                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg transition-colors duration-200"
                    title="Edit question"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-800 p-2 rounded-lg transition-colors duration-200"
                    title="Delete question"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-4 line-clamp-2">{post.details}</p>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-gray-500">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.like_count || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.answers?.length || 0}</span>
                  </div>
                  <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Answers Section */}
              {post.answers && post.answers.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
                    className="flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-4"
                  >
                    {expandedPost === post.id ? (
                      <>
                        <ChevronUp className="h-4 w-4 mr-1" />
                        Hide Answers
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Show Answers ({post.answers.length})
                      </>
                    )}
                  </button>

                  {expandedPost === post.id && (
                    <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                      {post.answers.map((answer) => (
                        <div key={answer.id} className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-700 mb-3">{answer.answer_text}</p>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center text-gray-600">
                              <User className="h-4 w-4 mr-2" />
                              <span>{answer.users?.full_name}</span>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1 text-gray-500">
                                <ThumbsUp className="h-3 w-3" />
                                <span>{answer.like_count || 0}</span>
                              </div>
                              <span className="text-gray-500">
                                {new Date(answer.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ subject, progress, color }) {
  const colorClasses = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    indigo: 'bg-indigo-600'
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{subject}</span>
        <span className="text-sm font-medium text-gray-700">{progress}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <div 
          className={`h-3 rounded-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

function Achievement({ title, description }) {
  return (
    <div className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0">
        <div className="bg-yellow-50 rounded-lg p-2">
          <Sparkles className="h-5 w-5 text-yellow-600" />
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const [userName, setUserName] = useState('User');
  const [userClassStream, setUserClassStream] = useState('Class ');
  const [loading, setLoading] = useState(true);
  const [userQuestions, setUserQuestions] = useState([]);
  const [stats, setStats] = useState({
    questionsCount: 0,
    likesReceived: 0,
    savedCount: 0
  });

  const fetchUserDataAndQuestions = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      // Fetch user data
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          full_name,
          students(grade)
        `)
        .eq('id', user.id)
        .single();

      if (!userError && userData) {
        setUserName(userData.full_name);
        setUserClassStream(userData.students?.grade || 'No Class');
      }

      // Fetch user questions with answers and their details
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select(`
          *,
          answers (
            id,
            answer_text,
            created_at,
            like_count,
            users (
              full_name
            )
          ),
          question_votes(count)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!questionsError && questionsData) {
        const questionsWithCounts = questionsData.map(question => ({
          ...question,
          like_count: question.question_votes[0]?.count || 0
        }));
        setUserQuestions(questionsWithCounts);
        
        // Calculate stats
        const totalLikes = questionsWithCounts.reduce((sum, q) => sum + (q.like_count || 0), 0);
        setStats({
          questionsCount: questionsWithCounts.length,
          likesReceived: totalLikes,
          savedCount: 0
        });
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUserDataAndQuestions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 rounded-2xl p-3">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                EduForum
              </h1>
              <p className="text-gray-600">Your Learning Journey</p>
            </div>
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-32 -mt-32 opacity-50" />
          <div className="relative">
            <div className="flex items-center mb-4">
              <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back, {userName}!
              </h2>
            </div>
            <div className="flex items-center">
              <Brain className="h-5 w-5 text-indigo-600 mr-2" />
              <p className="text-indigo-600 font-medium">
                {userClassStream}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard 
            icon={MessageSquare} 
            title="Questions Asked" 
            value={stats.questionsCount} 
            color="blue" 
          />
          <StatCard 
            icon={Heart} 
            title="Likes Received" 
            value={stats.likesReceived} 
            color="red" 
          />
          <StatCard 
            icon={Clock} 
            title="Saved for Later" 
            value={stats.savedCount} 
            color="purple" 
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User Questions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <MessageSquare className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Your Posts</h2>
              </div>
              <PostsList 
                posts={userQuestions} 
                onUpdate={fetchUserDataAndQuestions}
                onDelete={fetchUserDataAndQuestions}
              />
            </div>
          </div>

          {/* Progress & Achievements */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Subject Progress</h2>
              <div className="space-y-6">
                <ProgressBar subject="Mathematics" progress={85} color="blue" />
                <ProgressBar subject="Physics" progress={72} color="purple" />
                <ProgressBar subject="Chemistry" progress={68} color="green" />
                <ProgressBar subject="Biology" progress={91} color="indigo" />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Achievements</h2>
              <div className="space-y-4">
                <Achievement
                  title="Quick Thinker"
                  description="Asked 5 insightful questions in one day"
                />
                <Achievement
                  title="Math Wizard"
                  description="Most liked answer in Mathematics"
                />
                <Achievement
                  title="Helper"
                  description="Helped 50 students with their doubts"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;