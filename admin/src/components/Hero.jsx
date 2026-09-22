import { GraduationCap, Lock } from 'lucide-react';
import React from 'react'
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
useEffect(() => {
  const previous = document.body.style.overflow;
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = previous;
  };
}, []);


  return (
    <>
      <div className="h-screen pb-30 w-screen overflow-hidden font-[pacifico] bg-gray-50 flex items-center justify-center">
        <div className="text-center px-6">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 rounded-full bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 animate-spin-slow blur-[2px]" />{" "}
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-white text-indigo-600 shadow-lg">
              <GraduationCap size={40} />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome to Tech Quiz Master
          </h1>
          <p className="text-lg text-gray-600">
            Admin Panel - Manage quizzes, users, and analytics
          </p>

          <Link
            to="/dashboard"
            className="text-md text-indigo-500 mt-6 font-bold items-center flex justify-center gap-2 animate-pulse"
          >
            <Lock size={16} /> Please authenticate to continue
          </Link>

        </div>
      </div>
    </>
  );
}

export default Hero