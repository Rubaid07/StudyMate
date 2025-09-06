import { useState } from "react";
import { FiPlus, FiMinus } from "react-icons/fi";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Is StudyMate completely free to use?",
      answer: "Yes, StudyMate offers a free plan with all essential features. We also have a premium plan with advanced analytics and additional customization options."
    },
    {
      question: "How does the Q&A generator work?",
      answer: "Our AI-powered generator analyzes your study materials and creates relevant practice questions, MCQs, and quizzes tailored to your specific subjects and exam patterns."
    },
    {
      question: "Can I access StudyMate on multiple devices?",
      answer: "Absolutely! StudyMate syncs across all your devices, so you can access your schedules, budgets, and study plans from your phone, tablet, or computer."
    },
    {
      question: "How secure is my financial data in the budget tracker?",
      answer: "We take security seriously. All your financial data is encrypted and stored securely. We never share your personal information with third parties."
    },
    {
      question: "Do I need technical skills to use StudyMate?",
      answer: "Not at all! StudyMate is designed with students in mind, featuring an intuitive interface that's easy to navigate without any technical knowledge."
    }
  ];

  return (
    <section className="faq-section py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="faq-title text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently <span className="text-indigo-500">Asked Questions</span>
          </h2>
          <p className="faq-subtitle text-gray-600 text-lg">
            Everything you need to know about StudyMate
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item bg-white rounded-lg border border-gray-200 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span className="text-lg faq-question font-medium text-gray-900">{faq.question}</span>
                {activeIndex === index ? (
                  <FiMinus className="w-5 h-5 text-indigo-600" />
                ) : (
                  <FiPlus className="w-5 h-5 text-indigo-600" />
                )}
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                activeIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              }`}>
                <div className="faq-answer p-6 pt-0 text-gray-600">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;