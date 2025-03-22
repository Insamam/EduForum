import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import AskQuestion from './component/AskQuestion.jsx';
import AuthRoutes from './component/AuthRoutes.jsx';
import ChatBot from './component/ChatBot.jsx';
import Dashboard from './component/Dashboard.jsx';
import Footer from './component/Footer.jsx';
import Home from './component/Home.jsx';
import Navbar from './component/NavBar.jsx';
import Profile from './component/Profile.jsx';
import Question from './component/Question.jsx';
import QuestionDetail from './component/QuestionDetail.jsx';
import StudentLogin from './component/StudentLogin.jsx';
import StudentRegister from './component/StudentRegister.jsx';
import TeacherLogin from './component/TeacherLogin.jsx';
import TeacherRegister from './component/TeacherRegister.jsx';
import { supabase } from './supabaseClient';
const App = () => {
  const [user, setUser] = useState(null);
  const location = useLocation();

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

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);


  return (
    <div>
      {!location.pathname.startsWith('/Auth' || '/auth') && <Navbar user={user} setUser={setUser} />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/questions" element={<Question />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />
        <Route path="/ask" element={<AskQuestion />} />
        <Route path='/Auth' element={<AuthRoutes/>}>
          <Route path="student-login" element={<StudentLogin setUser={setUser} />} />
          <Route path="student-register" element={<StudentRegister />} />
          <Route path="teacher-login" element={<TeacherLogin setUser={setUser} />} />
          <Route path="teacher-register" element={<TeacherRegister />} />  
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route path="/chatbot" element={<ChatBot />} />
      </Routes>
      {location.pathname !== "/chatbot"&& !location.pathname.startsWith('/Auth' || '/auth') && <Footer />}
    </div>
  );
};

export default App;
