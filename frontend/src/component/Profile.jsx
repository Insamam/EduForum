import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { FaUserCircle } from "react-icons/fa";
import { MdEmail, MdSchool, MdLogout } from "react-icons/md";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: userSession, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !userSession.session) {
        navigate("/Auth/student-login");
        return;
      }

      const userId = userSession.session.user.id;
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (userError || !userData) {
        return;
      }

      setUser(userData);
      if (userData.role === "student") {
        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("grade, school_name")
          .eq("user_id", userId)
          .single();

        if (!studentError) setProfileData(studentData);
      } else if (userData.role === "teacher") {
        const { data: teacherData, error: teacherError } = await supabase
          .from("teachers")
          .select("school_name")
          .eq("user_id", userId)
          .single();

        if (!teacherError) setProfileData(teacherData);
      }

      setLoading(false);
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/Auth/student-login");
  };

  if (loading) return <div className="text-center mt-10 text-gray-600">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-100">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-xl border border-gray-200 p-8 transition-all hover:shadow-xl">
        <div className="flex flex-col items-center">
          <FaUserCircle className="text-gray-600 text-6xl mb-4 transition-transform duration-300 hover:scale-105" />
          <h2 className="text-2xl font-semibold text-gray-800">Profile</h2>
        </div>

        {user && (
          <div className="mt-6 space-y-4 text-gray-700">
            <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition">
              <FaUserCircle className="text-gray-500 text-lg" />
              <p className="font-medium">{user.full_name}</p>
            </div>
            <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition">
              <MdEmail className="text-gray-500 text-lg" />
              <p>{user.email}</p>
            </div>
            <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition">
              <MdSchool className="text-gray-500 text-lg" />
              <p className="capitalize">{user.role}</p>
            </div>

            {profileData && (
              <>
                {user.role === "student" ? (
                  <>
                    <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition">
                      <MdSchool className="text-gray-500 text-lg" />
                      <p>Grade: {profileData.grade}</p>
                    </div>
                    <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition">
                      <MdSchool className="text-gray-500 text-lg" />
                      <p>School: {profileData.school_name}</p>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md transition">
                    <MdSchool className="text-gray-500 text-lg" />
                    <p>School: {profileData.school_name}</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className="mt-6 w-full bg-red-600 text-white py-2 rounded-md flex items-center justify-center gap-2 hover:bg-red-700 transition-all hover:shadow-md"
        >
          <MdLogout className="text-lg" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
