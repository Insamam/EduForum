import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

export default function AuthRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className='w-[100%] h-[100vh] flex flex-col justify-center items-center overflow-scroll'>
        <div className='w-[20%] flex justify-between m-2 border-2 border-blue-300 rounded-md cursor-pointer font-semibold'>
            <span className={`w-[50%] text-center rounded-md p-2 ${location.pathname.startsWith('/Auth/teacher') && 'bg-indigo-600 text-white'}`} onClick={()=>navigate('/Auth/teacher-login')}>Teacher</span>
            <span className={`w-[50%] text-center rounded-md p-2 ${location.pathname.startsWith('/Auth/student') && 'bg-indigo-600 text-white'}`} onClick={()=>navigate('/Auth/student-login')}>Student</span>
        </div>
        <Outlet/>
    </div>
  )
}
