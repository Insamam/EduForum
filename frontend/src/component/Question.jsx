import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, ThumbsUp, Eye, Filter, BookOpen, Search } from "lucide-react";
import { supabase } from "../supabaseClient";

const subjects = [
  "All Subjects",
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Economics",
];

const grades = ["All Grades", "Grade 10", "Grade 11", "Grade 12"];

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("All Subjects");
  const [selectedGrade, setSelectedGrade] = useState("All Grades");
  const [sortBy, setSortBy] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from("questions")
      .select(`id, title, details, subject, grade, tags, created_at`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching questions:", error);
    } else {
      setQuestions(data);
    }
  };


  // const fetchQuestions = async () => {
  //   let { data, error } = await supabase
  //     .from("questions")
  //     .select(
  //       `id, title, details, subject, grade, tags, created_at, 
  //        users(full_name), 
  //        answers(count), 
  //        votes: votes(count), 
  //        views(count)`
  //     )
  //     .order("created_at", { ascending: false });

  //   if (error) {
  //     console.error("Error fetching questions:", error);
  //     return;
  //   }

  //   // Convert tags from Supabase string format to an array
  //   const formattedData = data.map((q) => ({
  //     ...q,
  //     tags: q.tags ? q.tags.replace(/[{}"]/g, "").split(",") : [],
  //     author: q.users?.full_name || "Unknown",
  //     answers_count: q.answers?.length || 0,
  //     votes: q.votes?.length || 0,
  //     views: q.views?.length || 0,
  //   }));

  //   setQuestions(formattedData);
  // };

  // Filter questions based on search query, selected subject & grade
  const filteredQuestions = questions.filter((question) => {
    const subjectMatch =
      selectedSubject === "All Subjects" || question.subject === selectedSubject;
    const gradeMatch =
      selectedGrade === "All Grades" || question.grade === selectedGrade;
    const searchMatch =
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.details.toLowerCase().includes(searchQuery.toLowerCase());
    return subjectMatch && gradeMatch && searchMatch;
  });

  // Sorting logic
  const sortedQuestions = [...filteredQuestions].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
    return 0;
  });

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Questions</h1>
        <Link to="/ask" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md">
          Ask Question
        </Link>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search questions..."
          className="pl-12 pr-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-96 shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-300"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="md:hidden flex items-center text-indigo-600"
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
          </button>
          <div className="hidden md:flex items-center space-x-4">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border rounded-md px-3 py-1"
            >
              {subjects.map((sub, idx) => (
                <option key={idx} value={sub}>{sub}</option>
              ))}
            </select>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="border rounded-md px-3 py-1"
            >
              {grades.map((grade, idx) => (
                <option key={idx} value={grade}>{grade}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {sortedQuestions.length > 0 ? (
          sortedQuestions.map((question) => (
            <div key={question.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <Link to={`/questions/${question.id}`} className="block">
                <h2 className="text-xl font-semibold text-indigo-700 mb-2">{question.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{question.details}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((tag, idx) => (
                    <span key={idx} className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <BookOpen className="h-4 w-4 mr-1" />
                  <span className="mr-4">{question.subject}</span>
                  <span>{question.grade}</span>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">No questions found.</p>
            <Link to="/ask" className="text-indigo-600 hover:text-indigo-800">Ask a question!</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Questions;
