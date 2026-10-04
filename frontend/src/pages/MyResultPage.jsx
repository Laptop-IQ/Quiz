import React from "react";
import Navbar from "../components/Navbar";
import MyResult from "../components/MyResult";

const MyResultPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
        <MyResult />
      </div>
    </div>
  );
};

export default MyResultPage;
