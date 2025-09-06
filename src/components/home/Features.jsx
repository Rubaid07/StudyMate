import { Calendar, DollarSign, BookOpen, Clock, Heart, Quote } from "lucide-react";

const Features = () => {
  const features = [
    {
      title: "Class Schedule Tracker",
      description:
        "Keep track of your daily and weekly classes with subject, time, day, and instructor details.",
      icon: <Calendar className="w-8 h-8 text-indigo-600" />,
    },
    {
      title: "Budget Tracker",
      description:
        "Easily manage your income, expenses, and savings with clear insights and visual charts.",
      icon: <DollarSign className="w-8 h-8 text-indigo-600" />,
    },
    {
      title: "Exam Q&A Generator",
      description:
        "Prepare smarter with practice questions, MCQs, and quizzes generated for your exams.",
      icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
    },
    {
      title: "Study Planner",
      description:
        "Break down study goals into smaller tasks, assign priorities, and never miss deadlines.",
      icon: <Clock className="w-8 h-8 text-indigo-600" />,
    },
    {
      title: "Wellness Tracker",
      description:
        "Balance your study with wellness — track sleep, water intake, and relaxation for a healthier student life.",
      icon: <Heart className="w-8 h-8 text-indigo-600" />,
    },
    {
      title: "Daily Motivation Quotes",
      description:
        "Stay inspired every day with fresh motivational quotes directly on your dashboard.",
      icon: <Quote className="w-8 h-8 text-indigo-600" />,
    },
  ];

  return (
    <section id="features" className="features-section py-16 bg-gray-50">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="text-center mb-12">
          <h2 className="section-title text-3xl font-bold text-gray-900">
            Everything you need in one <span className="text-indigo-500">Toolkit</span>
          </h2>
          <p className="section-description text-gray-600 mt-3 max-w-2xl mx-auto">
            StudyMate brings all your student essentials together – making life
            easier, smarter, and more productive.
          </p>
        </div>

        {/* Features Grid */}
        <div className="features-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card bg-white rounded-xl shadow-sm p-6 text-center border border-gray-200 hover:shadow-md transition"
            >
              <div className="feature-icon flex items-center justify-center mb-4">
                <div className="icon-container h-12 w-12 flex items-center justify-center rounded-lg bg-indigo-50">
                  {feature.icon}
                </div>
              </div>
              <h3 className="feature-title text-lg font-semibold text-gray-800">
                {feature.title}
              </h3>
              <p className="feature-description text-gray-600 mt-2 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;