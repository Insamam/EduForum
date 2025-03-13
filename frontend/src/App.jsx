import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Home from './component/Home.jsx';
import Footer from './component/Footer.jsx';
import Navbar from './component/NavBar.jsx';
import AskQuestion from './component/AskQuestion.jsx';
import Question from './component/Question.jsx';
import QuestionDetail from './component/QuestionDetail.jsx';
import StudentLogin from './component/StudentLogin.jsx';
import StudentRegister from './component/StudentRegister.jsx';
import Profile from './component/Profile.jsx';

const App = () => {
  const [user, setUser] = useState(null);

   useEffect(() => {
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } else {
      setUser(data?.user || null);
    }
  };

  fetchUser();

  // Listen for auth state changes (Login/Logout)
  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user || null);
  });

  return () => {
    authListener.subscription.unsubscribe();
  };
}, []);


  return (
    <div>
      <Navbar user={user} setUser={setUser} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questions" element={<Question />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />
        <Route path="/ask" element={<AskQuestion />} />
        <Route path="/student-login" element={<StudentLogin setUser={setUser} />} />
        <Route path="/student-register" element={<StudentRegister />} />
        <Route path= "/profile" element={<Profile />} />
      </Routes>
      <Footer />
    </div>
  // const location = useLocation(); // Get the current route
  // const isHomePage = location.pathname === "/"; // Check if it's the home page

  // return (
  //   <div>
  //     {/* Pass a prop to Navbar to determine transparency */}
  //     <Navbar isHomePage={isHomePage} />

  //     <Routes>
  //       <Route path="/" element={<Home />} />
  //       <Route path="/questions" element={<Question />} />
  //       <Route path="/questions/:id" element={<QuestionDetail />} />
  //       <Route path="/ask" element={<AskQuestion />} />
  //       <Route path="/student-login" element={<StudentLogin />} />
  //       <Route path="/student-register" element={<StudentRegister />} />
  //       <Route path="/profile" element={<Profile />} />
  //     </Routes>

  //     <Footer />
  //   </div>
  );
};

export default App;
