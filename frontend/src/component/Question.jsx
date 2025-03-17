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
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchQuestions();
  }, []);

  // const fetchQuestions = async () => {
  //   const { data, error } = await supabase
  //     .from("questions")
  //     .select(`id, title, details, subject, grade, tags, created_at`)
  //     .order("created_at", { ascending: false });

  //   if (error) {
  //     console.error("Error fetching questions:", error);
  //   } else {
  //     setQuestions(data);
  //   }
  // };
const fetchQuestions = async () => {
  const { data, error } = await supabase
    .from("questions")
    .select(`id, title, details, subject, grade, tags, votes, answers_count, author, created_at`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching questions:", error);
  } else {
    setQuestions(data);
  }
};


  // Filter questions based on search, subject, and grade
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
      {/* Header Section */}
<div className="flex justify-between items-center mb-6">
  {/* Centered Heading */}
  <h1 className="text-3xl font-bold text-indigo-800 flex-1 text-center">Questions</h1>
  

  {/* Ask Question Button - Positioned Above Filters */}
  <Link 
    to="/ask" 
    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-md transition-all"
  >
    Ask Question
  </Link>
</div>


      {/* Search & Filters Section */}
      <div className="flex flex-col md:flex-row items-center justify-center mb-6 space-y-4 md:space-y-0">
        {/* Search Bar */}
        <div className="relative flex items-center w-full md:w-2/3 lg:w-1/2">
          <Search className="absolute left-4 h-5 w-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search questions..."
            className="pl-12 pr-4 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full shadow-lg transition-all duration-300 hover:shadow-xl border border-gray-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filters beside Search Bar */}
        <div className="flex items-center gap-4 ml-6">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="border rounded-md px-3 py-2 text-gray-700 shadow-sm"
          >
            {subjects.map((sub, idx) => (
              <option key={idx} value={sub}>{sub}</option>
            ))}
          </select>

          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="border rounded-md px-3 py-2 text-gray-700 shadow-sm"
          >
            {grades.map((grade, idx) => (
              <option key={idx} value={grade}>{grade}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-center">
  <div className="w-full max-w-6xl space-y-5"> {/* Increased max width */}
    {sortedQuestions.length > 0 ? (
      sortedQuestions.map((question) => (
        <div
          key={question.id}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-indigo-400"
        >
          <Link to={`/questions/${question.id}`} className="block">
            <h2 className="text-xl font-semibold text-indigo-800 mb-2">{question.title}</h2>
            <p className="text-gray-600 mb-3 line-clamp-2 text-base">{question.details}</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {question.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-indigo-500 text-white text-xs px-3 py-1 rounded-full shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* <div className="flex items-center text-sm text-gray-500">
              <BookOpen className="h-4 w-4 mr-2 text-indigo-500" />
              <span className="mr-4">{question.subject}</span>
              <span className="bg-gray-200 px-2 py-1 rounded text-gray-700">{question.grade}</span>
            </div> */}
          <div className="flex items-center text-sm text-gray-500 space-x-4 flex-wrap">
  {/* Subject */}
  <BookOpen className="h-4 w-4 text-indigo-500" />
  <span className="mr-4">{question.subject}</span>

  {/* Grade */}
  <span className="bg-gray-200 px-2 py-1 rounded text-gray-700">{question.grade}</span>

  {/* Votes */}
  <div className="flex items-center">
    <ThumbsUp className="h-4 w-4 mr-1 text-green-600" />
    <span>{question.votes} votes</span>
  </div>

  {/* Answers */}
  <div className="flex items-center">
    <MessageSquare className="h-4 w-4 mr-1 text-indigo-600" />
    <span>{question.answers_count} answers</span>
  </div>

  {/* Answered By (Author) */}
  {question.answers_count > 0 && (
    <div className="flex items-center text-gray-700">
      <span className="ml-2">Answered by:</span>
      <span className="ml-1 font-semibold text-indigo-800">{question.author}</span>
    </div>
  )}
</div>

          </Link>
        </div>
      ))
    ) : (
      <div className="bg-white rounded-lg shadow-lg border p-8 text-center flex flex-col items-center">
        <img src="/no-questions.svg" alt="No questions" className="w-28 h-28 mb-4 opacity-75" />
        <p className="text-gray-600 mb-3 text-base">No questions found.</p>
        <Link
          to="/ask"
          className="text-indigo-600 text-base font-semibold hover:text-indigo-800 transition duration-200"
        >
          Ask a question!
        </Link>
      </div>
    )}
  </div>
</div>

    </div>
  );
};

export default Questions;
