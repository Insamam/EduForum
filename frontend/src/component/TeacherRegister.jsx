import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { BookOpen, User, Mail, Lock, School, Eye, EyeOff } from "lucide-react";

const TeacherRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    schoolName: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    if (!formData.schoolName.trim()) newErrors.schoolName = "School name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setLoading(true);
  try {
    console.log("Starting registration...");

    // Step 1: Sign up the user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password, // Supabase Auth handles this
    });

    if (error) throw error;
    if (!data.user) throw new Error("User registration failed");

    console.log("User registered:", data.user);

    // Step 2: Insert user details into 'users' table, including the password
    const { error: userError } = await supabase
      .from("users")
      .insert([
        {
          id: data.user.id, // Ensure it matches the auth user ID
          full_name: formData.fullName,
          email: formData.email,
          password: formData.password, // Include password for student login consistency
          role: "teacher",
        },
      ]);

    if (userError) throw userError;

    console.log("User inserted into 'users' table");

    // Step 3: Insert teacher details into 'teachers' table
    const { error: teacherError } = await supabase.from("teachers").insert([
      {
        user_id: data.user.id, // Link to users table correctly
        school_name: formData.schoolName,
      },
    ]);

    if (teacherError) throw teacherError;

    console.log("Teacher registered successfully!");

    alert("Registration successful! Please log in.");
    navigate("/teacher-login");
  } catch (error) {
    console.error("Registration error:", error.message);
    alert(error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="max-w-md mx-auto overflow-y-auto">
      <div className="text-center mb-8">
        <BookOpen className="h-12 w-12 text-indigo-600 mx-auto" />
        <h1 className="text-3xl font-bold">Join EduForum</h1>
        <p className="text-gray-600 mt-2">Create a teacher account to share your knowledge</p>
      </div>
      <div className="bg-white rounded-lg shadow-md p-8">
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Full Name</label>
            <div className="flex items-center border rounded-md p-2">
              <User className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full ml-2 outline-none"
                placeholder="John Doe"
              />
            </div>
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Email</label>
            <div className="flex items-center border rounded-md p-2">
              <Mail className="h-5 w-5 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full ml-2 outline-none"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Password</label>
            <div className="flex items-center border rounded-md p-2">
              <Lock className="h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full ml-2 outline-none"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2">
                {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium">Confirm Password</label>
            <div className="flex items-center border rounded-md p-2">
              <Lock className="h-5 w-5 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full ml-2 outline-none"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
          </div>

          {/* School Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium">School Name</label>
            <div className="flex items-center border rounded-md p-2">
              <School className="h-5 w-5 text-gray-400" />
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                className="w-full ml-2 outline-none"
                placeholder="ABC High School"
              />
            </div>
            {errors.schoolName && <p className="text-red-500 text-sm">{errors.schoolName}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-md font-semibold">
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherRegister;
