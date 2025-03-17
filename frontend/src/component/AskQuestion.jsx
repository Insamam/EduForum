import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { supabase } from '../supabaseClient';

const subjects = [
  "Mathematics", "Science", "English", "History", "Geography",
  "Computer Science", "Physics", "Chemistry", "Biology", "Economics"
];

const AskQuestion = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [tags, setTags] = useState("");
  const [errors, setErrors] = useState({});
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

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    else if (title.length < 15) newErrors.title = "Title should be at least 15 characters";

    if (!details.trim()) newErrors.details = "Question details are required";
    else if (details.length < 30) newErrors.details = "Please provide more details (at least 30 characters)";

    if (!subject) newErrors.subject = "Subject is required";
    if (!grade) newErrors.grade = "Grade is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to ask a question.");
      return;
    }

    if (!validateForm()) return;

    const formattedTags = tags.split(",").map(tag => tag.trim());

    try {
      const { data, error } = await supabase.from("questions").insert([
        {
          user_id: user.id, // Use the logged-in user's ID
          title,
          details,
          subject,
          grade,
          tags: formattedTags,
        },
      ]);

      if (error) {
        console.error("Error inserting question:", error);
        alert("Error submitting question. Please try again.");
      } else {
        alert("Question added successfully");
        navigate("/questions");
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      alert("An unexpected error occurred. Please try again later.");
    }

    setTitle("");
    setDetails("");
    setSubject("");
    setGrade("");
    setTags("");
    setErrors({});
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Ask a Question</h1>

      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 flex">
        <Info className="h-5 w-5 text-blue-500" />
        <div className="ml-3">
          <p className="text-sm text-blue-700">Tips for getting good answers:</p>
          <ul className="mt-1 text-sm text-blue-700 list-disc list-inside">
            <li>Make sure your question is clear and specific</li>
            <li>Include all necessary details and context</li>
            <li>Use proper grammar and formatting</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          {/* Title Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full border ${errors.title ? "border-red-500" : "border-gray-300"} rounded-md p-3`}
              placeholder="e.g., How do I solve quadratic equations?"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Details Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Details</label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={6}
              className={`w-full border ${errors.details ? "border-red-500" : "border-gray-300"} rounded-md p-3`}
              placeholder="Include details, what you've tried, and what you're struggling with..."
            ></textarea>
            {errors.details && <p className="mt-1 text-sm text-red-600">{errors.details}</p>}
          </div>

          {/* Subject & Grade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={`w-full border ${errors.subject ? "border-red-500" : "border-gray-300"} rounded-md p-3`}
              >
                <option value="">Select a subject</option>
                {subjects.map((sub, index) => (
                  <option key={index} value={sub}>{sub}</option>
                ))}
              </select>
              {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grade</label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className={`w-full border ${errors.grade ? "border-red-500" : "border-gray-300"} rounded-md p-3`}
              >
                <option value="">Select your grade</option>
                <option value="Grade 10">Grade 10</option>
                <option value="Grade 11">Grade 11</option>
                <option value="Grade 12">Grade 12</option>
              </select>
              {errors.grade && <p className="mt-1 text-sm text-red-600">{errors.grade}</p>}
            </div>
          </div>

          {/* Tags Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-3"
              placeholder="e.g., algebra, equations (comma-separated, max 5)"
            />
            <p className="mt-1 text-sm text-gray-500">Add up to 5 tags to describe your question</p>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-semibold">
              Post Your Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestion;