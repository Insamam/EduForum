import {
    BookOpen,
    Brain,
    Clock,
    GraduationCap,
    Heart,
    MessageSquare,
    Share2,
    Sparkles,
    ThumbsUp
} from 'lucide-react';
import React from 'react';

function Dashboard(){
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
          <div className="flex items-center space-x-4">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop" 
              alt="Profile" 
              className="w-12 h-12 rounded-full border-2 border-blue-600"
            />
          </div>
        </div>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full -mr-32 -mt-32 opacity-50" />
          <div className="relative">
            <div className="flex items-center mb-4">
              <GraduationCap className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-2xl font-bold text-gray-900">Welcome back, Sarah!</h2>
            </div>
            <div className="flex items-center">
              <Brain className="h-5 w-5 text-indigo-600 mr-2" />
              <p className="text-indigo-600 font-medium">Class 10 • Science Stream</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard icon={MessageSquare} title="Questions Asked" value="24" color="blue" />
          <StatCard icon={Heart} title="Posts Liked" value="56" color="red" />
          <StatCard icon={Clock} title="Saved for Later" value="8" color="purple" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Your Posts */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <MessageSquare className="h-6 w-6 text-blue-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Your Posts</h2>
              </div>
              <PostsList posts={yourPosts} />
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Heart className="h-6 w-6 text-red-500 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">Posts You Liked</h2>
              </div>
              <PostsList posts={likedPosts} />
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

const yourPosts = [
  {
    id: 1,
    title: "Can someone explain quantum entanglement in simple terms?",
    content: "I'm struggling to understand the concept of quantum entanglement. Could someone break it down into simpler terms?",
    subject: "Physics",
    likes: 12,
    comments: 5,
    time: "2 hours ago"
  },
  {
    id: 2,
    title: "Help with calculus integration problem",
    content: "I'm stuck on this integration problem: ∫(x²+2x+1)dx. Can anyone help me solve this step by step?",
    subject: "Mathematics",
    likes: 8,
    comments: 7,
    time: "1 day ago"
  },
  {
    id: 3,
    title: "Understanding photosynthesis process",
    content: "What's the role of chlorophyll in photosynthesis? Need a detailed explanation.",
    subject: "Biology",
    likes: 15,
    comments: 6,
    time: "2 days ago"
  }
];

const likedPosts = [
  {
    id: 4,
    title: "Explanation of Newton's Third Law",
    content: "For every action, there is an equal and opposite reaction. Here's a practical example...",
    subject: "Physics",
    likes: 45,
    comments: 12,
    time: "1 day ago",
    author: "PhysicsWhiz"
  },
  {
    id: 5,
    title: "Understanding DNA Replication",
    content: "DNA replication is a complex process. Let me break it down step by step...",
    subject: "Biology",
    likes: 32,
    comments: 8,
    time: "3 days ago",
    author: "BioExpert"
  },
  {
    id: 6,
    title: "Solving Quadratic Equations Made Easy",
    content: "Here's a simple trick to solve any quadratic equation quickly...",
    subject: "Mathematics",
    likes: 56,
    comments: 15,
    time: "4 days ago",
    author: "MathGenius"
  }
];

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

function PostsList({ posts }) {
  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div 
          key={post.id} 
          className="p-6 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {post.subject}
            </span>
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">{post.content}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                <ThumbsUp className="h-4 w-4" />
                <span>{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                <MessageSquare className="h-4 w-4" />
                <span>{post.comments}</span>
              </button>
              <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
                <Share2 className="h-4 w-4" />
              </button>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              {post.author && <span className="mr-2">by {post.author}</span>}
              <span>{post.time}</span>
            </div>
          </div>
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

export default Dashboard;