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
    <nav className="bg-indigo-700 text-white border-b border-indigo-200 shadow-md">

      <div className="container mx-auto  px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8" />
            <span
  className="text-xl font-bold text-white transition duration-300 ease-in-out 
             hover:text-white hover:scale-105 relative 
             after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] 
             after:bg-indigo-200 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
>
  EduForum
</span>

          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
          <Link
  to="/"
  className="relative text-white font-semibold hover:text-indigo-200 transition duration-300 ease-in-out 
             after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] 
             after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
>
  Home
</Link>
<Link
  to="/dashboard"
  className="relative text-white font-semibold hover:text-indigo-200 transition duration-300 ease-in-out 
             after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] 
             after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
>
  Dashboard
</Link>

<Link
  to="/questions"
  className="relative text-white font-semibold hover:text-indigo-200 transition duration-300 ease-in-out 
             after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] 
             after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
>
  Questions
</Link>
<Link
  to="/chatbot"
  className="relative text-white font-semibold hover:text-indigo-200 transition duration-300 ease-in-out 
             after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] 
             after:bg-white after:transition-all after:duration-300 after:ease-in-out hover:after:w-full"
>
  Chat with AI
</Link>


            {user ? (
              <>
                
                <Link to="/profile" className="hover:text-indigo-200">
                  <User className="h-6 w-6" />
                </Link>
                
              </>
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
      </div>
    </nav>
  );
};

export default NavBar;
// import React, { useState } from "react";
// import { Link } from "react-router-dom";
// import { BookOpen, User, LogIn, Menu, X } from "lucide-react";
// import { supabase } from "../supabaseClient";

// const NavBar = ({ user, setUser, isHomePage }) => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

//   const handleLogout = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (error) {
//       console.error("Logout Error:", error.message);
//     } else {
//       setUser(null);
//     }
//   };

//   return (
//     <nav
//       className={`w-full top-0 left-0 z-50 shadow-md transition-all duration-300 
//                   ${isHomePage ? "fixed bg-indigo-800/80 backdrop-blur-md" : "bg-indigo-800"}`}
//     >
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center py-4">
//           <Link to="/" className="flex items-center space-x-2">
//             <BookOpen className="h-8 w-8" />
//             <span className="text-xl font-bold text-indigo-200 hover:text-white transition duration-300">
//               EduForum
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link to="/" className="hover:text-white transition duration-300">Home</Link>
//             <Link to="/dashboard" className="hover:text-white transition duration-300">Dashboard</Link>
//             <Link to="/questions" className="hover:text-white transition duration-300">Questions</Link>

//             {user ? (
//               <Link to="/profile" className="hover:text-white transition duration-300">
//                 <User className="h-6 w-6" />
//               </Link>
//             ) : (
//               <Link to="/student-login" className="flex items-center space-x-1 hover:text-white transition duration-300">
//                 <LogIn className="h-5 w-5" />
//                 <span>Login</span>
//               </Link>
//             )}
//           </div>

//           {/* Mobile Menu Button */}
//           <button className="md:hidden" onClick={toggleMenu}>
//             {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
//           </button>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;
