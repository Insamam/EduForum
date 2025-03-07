import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Search, User, LogIn, Menu, X } from 'lucide-react';

const NavBar = ({ isLoggedIn, user, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    onLogout();
    navigate('/');
    setIsMenuOpen(false);
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
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions..."
                className="pl-10 pr-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
            <Link to="/" className="hover:text-indigo-200">Home</Link>
            <Link to="/questions" className="hover:text-indigo-200">Questions</Link>
            {isLoggedIn ? (
              <>
                <Link to="/ask" className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md">Ask Question</Link>
                <div className="relative group">
                  <button className="flex items-center space-x-1 hover:text-indigo-200">
                    <User className="h-5 w-5" />
                    <span>{user?.name || 'Profile'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-indigo-100">My Profile</Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-indigo-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 hover:text-indigo-200">
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

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search questions..."
                className="pl-10 pr-4 py-2 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
            </div>
            <div className="flex flex-col space-y-3">
              <Link to="/" className="hover:text-indigo-200" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/questions" className="hover:text-indigo-200" onClick={() => setIsMenuOpen(false)}>Questions</Link>
              {isLoggedIn ? (
                <>
                  <Link to="/ask" className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-md text-center" onClick={() => setIsMenuOpen(false)}>
                    Ask Question
                  </Link>
                  <Link to="/profile" className="hover:text-indigo-200" onClick={() => setIsMenuOpen(false)}>My Profile</Link>
                  <button 
                    onClick={handleLogout}
                    className="text-left hover:text-indigo-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="flex items-center space-x-1 hover:text-indigo-200" onClick={() => setIsMenuOpen(false)}>
                  <LogIn className="h-5 w-5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
