import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, User, LogIn, Menu, X } from "lucide-react";
import { supabase } from "../supabaseClient"; // Import Supabase client

const NavBar = ({ user, setUser }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Logout Error:", error.message);
  } else {
    setUser(null);
    localStorage.removeItem("supabaseSession"); // Ensure session is cleared
  }
};



  return (
    <nav className="bg-indigo-500 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8" />
            <span className="text-xl font-bold">EduForum</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="hover:text-indigo-200">Home</Link>
            <Link to="/dashboard" className="hover:text-indigo-200">Dashboard</Link>
            <Link to="/questions" className="hover:text-indigo-200">Questions</Link>

            {user ? (
              <>
                
                <Link to="/profile" className="hover:text-indigo-200">
                  <User className="h-6 w-6" />
                </Link>
                
              </>
            ) : (
              <Link to="/student-login" className="flex items-center space-x-1 hover:text-indigo-200">
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
      </div>
    </nav>
  );
};

export default NavBar;
