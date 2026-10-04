import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Landing/Hero";
import Stats from "../components/Landing/Stats";
import PopularSeries from "../components/Landing/PopularSeries";
import QuizPass from "../components/Landing/QuizPass";
import WhyUs from "../components/Landing/WhyUs";
import Footer from "../components/Landing/Footer";

const Landing = () => (
  <>
    <Navbar />
    <Hero />
    <Stats />
    <PopularSeries />
    <QuizPass />
    <WhyUs />
    <Footer />
  </>
);

export default Landing;
