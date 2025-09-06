import {
  FiCalendar,
  FiDollarSign,
  FiBook,
  FiHelpCircle,
  FiHeart,
  FiArrowRight,
} from "react-icons/fi";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Class Schedule Management",
      description:
        "Add your classes with subject, time, day, and instructor details. Color-code subjects for better organization and never miss a lecture.",
      icon: <FiCalendar className="text-xl" />,
      color: "from-blue-500 to-blue-600",
      feature: "Class Tracker",
    },
    {
      id: 2,
      title: "Budget Tracking",
      description:
        "Track your income and expenses, categorize spending, and visualize your financial health with interactive charts and graphs.",
      icon: <FiDollarSign className="text-xl" />,
      color: "from-green-500 to-green-600",
      feature: "Budget Tracker",
    },
    {
      id: 3,
      title: "Study Planning",
      description:
        "Break down big study goals into manageable tasks, set priorities and deadlines, and allocate time slots for each subject.",
      icon: <FiBook className="text-xl" />,
      color: "from-purple-500 to-purple-600",
      feature: "Study Planner",
    },
    {
      id: 4,
      title: "Exam Preparation",
      description:
        "Generate practice questions (MCQs, short answers, true/false) with customizable difficulty levels for effective exam preparation.",
      icon: <FiHelpCircle className="text-xl" />,
      color: "from-orange-500 to-orange-600",
      feature: "Q&A Generator",
    },
    {
      id: 5,
      title: "Wellness Tracking",
      description:
        "Monitor your mood, sleep patterns, study hours, and overall wellness to maintain a healthy study-life balance.",
      icon: <FiHeart className="text-xl" />,
      color: "from-pink-500 to-pink-600",
      feature: "Wellness Tracker",
    },
  ];

  return (
    <section className="how-it-works-section py-16 bg-gradient-to-r from-indigo-50 via-purple-50 to-indigo-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How StudyMate Works
          </h2>
          <p className="section-subtitle text-lg text-gray-600">
            Your all-in-one academic companion designed to simplify student life.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Middle Line */}
          <div className="timeline-line absolute left-1/2 top-0 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 transform -translate-x-1/2"></div>

          <div className="steps-container space-y-16">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`step-item relative flex items-center w-full ${
                  index % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                {/* Dot in Center */}
                <div className="timeline-dot md:block hidden absolute left-1/2 transform -translate-x-1/2 bg-white border-4 border-indigo-500 rounded-full w-6 h-6 z-10"></div>

                {/* Card */}
                <div
                  className={`step-card w-full md:w-5/12 bg-white p-6 rounded-2xl shadow-lg border border-gray-100  transition-all duration-300 ${
                    index % 2 === 0 ? "ml-0 mr-auto" : "ml-auto mr-0"
                  }`}
                >
                  <div
                    className="feature-badge inline-flex items-center text-sm font-medium mb-4"
                    style={{
                      background: `linear-gradient(to right, ${step.color
                        .split(" ")[0]
                        .replace("from-", "#")}, ${step.color
                        .split(" ")[1]
                        .replace("to-", "#")})`,
                    }}
                  >
                    {step.icon}
                    <span className="ml-2">{step.feature}</span>
                  </div>
                  <h3 className="step-title text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="step-description text-gray-600 leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;