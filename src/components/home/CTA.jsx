import { Link } from "react-router";
import { ArrowRight } from "lucide-react";

const CTA = () => {
  return (
    <section className="cta-section py-20 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold  mb-6">
          Ready to Transform <span className="text-indigo-500">Your Student Life?</span>
        </h2>
        <p className="text-xl mb-10 max-w-2xl mx-auto faq-answer">
          Join thousands of students who are already using StudyMate to stay organized, save money, and achieve academic success.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/register"
            className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg flex items-center justify-center gap-2 shadow-lg hover:bg-gray-100 transition duration-300"
          >
            Get Started Free <ArrowRight />
          </Link>
        </div>
        <p className="mt-6 text-sm faq-answer">
          No credit card required. Free forever plan.
        </p>
      </div>
    </section>
  );
};

export default CTA;