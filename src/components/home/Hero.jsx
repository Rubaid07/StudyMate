import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import study from "../../assets/study.png";

const Hero = () => {
  return (
   <section className="hero-section relative min-h-[calc(100vh-57px)] flex items-center bg-white transition-colors duration-300">
      <div
        className="hero-bg absolute inset-0 z-0"
      />
      <div className="relative z-10 w-full px-4 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16">
          <div className="flex-1 text-center lg:text-left space-y-6">
            <h1 className="hero-heading text-4xl lg:text-5xl font-bold text-gray-900 leading-tight transition-colors">
              Simplify Your Student Life with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                StudyMate
              </span>
            </h1>
            <p className="hero-text text-lg text-gray-600 max-w-xl mx-auto lg:mx-0 transition-colors">
              Track your classes, manage budgets, plan your study schedule,
              and generate smart exam questions — all in one toolkit built for
              students.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/dashboard"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold flex items-center justify-center gap-2 shadow-lg hover:from-purple-600 hover:to-indigo-600 transition duration-300"
              >
                Get Started <ArrowRight size={18} />
              </Link>
            </div>
          </div>
          <div className="flex-1 flex justify-center lg:justify-end">
            <img
              src={study}
              alt="Student studying with ideas"
              className="hero-image w-full max-w-md lg:max-w-lg h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
