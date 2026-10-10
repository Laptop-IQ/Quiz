import Navbar from "../components/Navbar";
import Hero from "../components/Landing/Hero";
import Stats from "../components/Landing/Stats";
import ExamMarquee from "../components/Landing/ExamMarquee";
import ExamCategories from "../components/Landing/ExamCategories";
import PopularSeries from "../components/Landing/PopularSeries";
import HowItWorks from "../components/Landing/HowItWorks";
import WhyUs from "../components/Landing/WhyUs";
import QuizPass from "../components/Landing/QuizPass";
import Faq from "../components/Landing/Faq";
import FinalCta from "../components/Landing/FinalCta";
import Footer from "../components/Landing/Footer";

const Landing = () => (
  <>
    <Navbar />
    <main>
      <Hero />
      <Stats />
      <ExamMarquee />
      <ExamCategories />
      <PopularSeries />
      <HowItWorks />
      <WhyUs />
      <QuizPass />
      <Faq />
      <FinalCta />
    </main>
    <Footer />
  </>
);

export default Landing;
