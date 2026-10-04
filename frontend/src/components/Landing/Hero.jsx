import React from "react";
import { useNavigate } from "react-router-dom";
import heroImage from "../../assets/Learning-amico.svg";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-gradient-to-b from-white to-cyan-200 pt-16 pb-28">
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="md:w-1/2 py-5">
          <h1 className="text-3xl text-gray-900 leading-tight">
            One Destination for <br />
            <span className="text-black font-bold">Complete Tech Preparation</span>
          </h1>
          <p className="mt-6 text-green-500 font-medium">
            Learn ▶ Practice ▶ Improve ▶ Succeed
          </p>
          <p className="mt-4 text-gray-600">
            Start your preparation for interviews. For Free!
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => navigate("/test-series")}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium transition cursor-pointer"
            >
              Get Started For Free
            </button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <img src={heroImage} alt="Preparation" className="max-w-md w-full" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
