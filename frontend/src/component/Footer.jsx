import React from 'react';
import { BookOpen, Mail, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="h-6 w-6" />
              <span className="text-xl font-bold">EduForum</span>
            </div>
            <p className="text-gray-300">
              A community-driven Q&A platform for school students in Grades 10-12, making learning more interactive and accessible.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="/questions" className="text-gray-300 hover:text-white">Questions</a></li>
              <li><a href="/ask" className="text-gray-300 hover:text-white">Ask a Question</a></li>
              <li><a href="/login" className="text-gray-300 hover:text-white">Login</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Subjects</h3>
            <ul className="space-y-2">
              <li><a href="/questions?subject=mathematics" className="text-gray-300 hover:text-white">Mathematics</a></li>
              <li><a href="/questions?subject=science" className="text-gray-300 hover:text-white">Science</a></li>
              <li><a href="/questions?subject=english" className="text-gray-300 hover:text-white">English</a></li>
              <li><a href="/questions?subject=history" className="text-gray-300 hover:text-white">History</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="mailto:contact@eduforum.com" className="text-gray-300 hover:text-white">
                <Mail className="h-5 w-5" />
              </a>
            </div>
            <p className="text-gray-300">contact@eduforum.com</p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
          <p>&copy; {new Date().getFullYear()} EduForum. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;