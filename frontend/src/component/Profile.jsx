import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userSession, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !userSession.session) {
        console.error("Error fetching session:", sessionError);
        navigate("/student-login");
        return;
      }

      const userId = userSession.session.user.id;
      console.log("Logged-in User ID:", userId); // Debugging log

      // Fetch user details from 'users' table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle(); // Prevents "multiple (or no) rows returned" error

      if (userError) {
        console.error("Error fetching user:", userError);
        return;
      }

      if (!userData) {
        console.error("User not found in users table!");
        return;
      }

      setUser(userData);

      // Fetch student or teacher data based on role
      if (userData.role === "student") {
        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("grade, school_name")
          .eq("user_id", userId)
          .single();

        if (studentError) {
          console.error("Error fetching student data:", studentError);
        } else {
          setProfileData(studentData);
        }
      } else if (userData.role === "teacher") {
        const { data: teacherData, error: teacherError } = await supabase
          .from("teachers")
          .select("school_name")
          .eq("user_id", userId)
          .single();

        if (teacherError) {
          console.error("Error fetching teacher data:", teacherError);
        } else {
          setProfileData(teacherData);
        }
      }

      setLoading(false);
    };

    fetchUser();
  }, [navigate]);

  // Logout Function
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Profile</h2>

      {user && (
        <div className="space-y-4">
          <p><strong>Full Name:</strong> {user.full_name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>

          {profileData && (
            <>
              {user.role === "student" ? (
                <>
                  <p><strong>Grade:</strong> {profileData.grade}</p>
                  <p><strong>School:</strong> {profileData.school_name}</p>
                </>
              ) : (
                <p><strong>School:</strong> {profileData.school_name}</p>
              )}
            </>
          )}
        </div>
      )}

      <button 
        onClick={handleLogout} 
        className="mt-6 w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
