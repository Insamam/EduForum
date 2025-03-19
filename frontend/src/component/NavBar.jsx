import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, User, LogIn, Menu, X } from "lucide-react";
import { supabase } from "../supabaseClient";

const NavBar = ({ user, setUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout Error:", error.message);
    } else {
      setUser(null);
      localStorage.removeItem("supabaseSession");
    }
  };

  return (
    <nav className="bg-indigo-700 text-white border-b border-indigo-200 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8" />
            <span className="text-xl font-bold text-white">EduForum</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-indigo-200">Home</Link>
            <Link to="/dashboard" className="hover:text-indigo-200">Dashboard</Link>
            <Link to="/questions" className="hover:text-indigo-200">Questions</Link>
            <Link to="/chatbot" className="hover:text-indigo-200">Chat with AI</Link>
            {user ? (
              <Link to="/profile" className="hover:text-indigo-200">
                <User className="h-6 w-6" />
              </Link>
            ) : (
              <Link to="auth/student-login" className="flex items-center space-x-1 hover:text-indigo-200">
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-indigo-800 text-white p-4 rounded-lg shadow-lg space-y-2 flex flex-col items-center animate-fade-in">
            <Link to="/" className="hover:bg-indigo-600 px-4 py-2 rounded transition duration-300 w-full text-center" onClick={toggleMenu}>Home</Link>
            <Link to="/dashboard" className="hover:bg-indigo-600 px-4 py-2 rounded transition duration-300 w-full text-center" onClick={toggleMenu}>Dashboard</Link>
            <Link to="/questions" className="hover:bg-indigo-600 px-4 py-2 rounded transition duration-300 w-full text-center" onClick={toggleMenu}>Questions</Link>
            <Link to="/chatbot" className="hover:bg-indigo-600 px-4 py-2 rounded transition duration-300 w-full text-center" onClick={toggleMenu}>Chat with AI</Link>
            {user ? (
              <Link to="/profile" className="hover:bg-indigo-600 px-4 py-2 rounded transition duration-300 w-full text-center" onClick={toggleMenu}>
                <User className="h-6 w-6 inline-block" />
              </Link>
            ) : (
              <Link to="auth/student-login" className="flex items-center space-x-1 hover:bg-indigo-600 px-4 py-2 rounded transition duration-300 w-full justify-center" onClick={toggleMenu}>
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
