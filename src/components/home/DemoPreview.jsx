import React, { useState, useRef } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Smartphone,
  Tablet,
  Monitor,
  X,
  Rocket,
  Palette
} from 'lucide-react';

const DemoPreview = () => {
  const [activeTab, setActiveTab] = useState('desktop');
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false)
  const intervalRef = useRef(null)

  const screenshots = {
    desktop: [
      {
        id: 1,
        title: "Dashboard Overview",
        description: "Get a complete overview of your academic life with our intuitive dashboard.",
        image: "https://i.postimg.cc/mkRfg6nW/dashboard.png",
        alt: "StudyMate Dashboard Overview"
      },
      {
        id: 2,
        title: "Class Schedule",
        description: "Manage your class schedule with color-coded subjects and easy editing.",
        image: "https://i.postimg.cc/CM6sYfnm/calss.png",
        alt: "Class Schedule Interface"
      },
      {
        id: 3,
        title: "Budget Tracker",
        description: "Track your expenses and income with beautiful visualizations.",
        image: "https://i.postimg.cc/9f5rBcRd/budget.png",
        alt: "Budget Tracking Dashboard"
      },
      {
        id: 4,
        title: "Study Planner",
        description: "Plan your study sessions and track your progress efficiently.",
        image: "https://i.postimg.cc/zXvbztYg/study.png",
        alt: "Study Planning Interface"
      }
    ],
    tablet: [
      {
        id: 1,
        title: "Tablet Dashboard",
        description: "Perfectly optimized for tablet devices with touch-friendly interface.",
        image: "https://i.postimg.cc/MK9LRGLL/tablet-dashboard1.png",
        alt: "Tablet Dashboard View"
      },
      {
        id: 2,
        title: "Exam Q&A Generator",
        description: "Access your class schedule on the go with our mobile interface.",
        image: "https://i.postimg.cc/fW9YnWm9/Q-A.png",
        alt: "Exam Q&A Generator"
      }
    ],
    mobile: [
      {
        id: 1,
        title: "Mobile Landing Page",
        description: "Full-featured dashboard optimized for mobile devices.",
        image: "https://i.postimg.cc/7hRxZrpt/landing.png",
        alt: "Mobile Landing Page"
      },
      {
        id: 2,
        title: "Mobile Dashbaord view",
        description: "Quick access to frequently used features on mobile.",
        image: "https://i.postimg.cc/dV5m4HcQ/mobile-dashboard.png",
        alt: "Mobile Mobile Dashbaord view"
      }
    ]
  };

  const currentScreenshots = screenshots[activeTab]
  const totalSlides = currentScreenshots.length;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const startSlideshow = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(nextSlide, 3000);
    setIsPlaying(true);
  };

  const stopSlideshow = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleSlideshow = () => {
    if (isPlaying) {
      stopSlideshow();
    } else {
      startSlideshow();
    }
  };

  const openModal = () => {
    stopSlideshow();
    setIsModalOpen(true)
  };

  const closeModal = () => {
    setIsModalOpen(false)
  };

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const features = [
    {
      icon: <Rocket className="w-8 h-8 text-purple-600" />,
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance',
    },
    {
      icon: <Palette className="w-8 h-8 text-pink-500" />,
      title: 'Beautiful UI',
      description: 'Modern design with intuitive interface',
    },
    {
      icon: <Smartphone className="w-8 h-8 text-green-500" />,
      title: 'Fully Responsive',
      description: 'Works perfectly on all devices',
    },
  ];


  return (
    <section id="demo-preview" className="demo-preview-section py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title text-3xl md:text-4xl font-bold mb-4">
            See <span className='text-indigo-500'>StudyMate</span> in Action
          </h2>
          <p className="section-subtitle text-lg mb-8">
            Explore our beautiful interface and discover how StudyMate can transform your academic journey
          </p>
          <div className="section-divider w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
        </div>

        {/* device selector */}
        <div className="flex justify-center mb-12">
          <div className="device-selector bg-base-300 rounded-2xl p-2 flex gap-2 sm:gap-4">
            {[
              { key: 'desktop', icon: <Monitor className="w-5 h-5" />, label: 'Desktop' },
              { key: 'tablet', icon: <Tablet className="w-5 h-5" />, label: 'Tablet' },
              { key: 'mobile', icon: <Smartphone className="w-5 h-5" />, label: 'Mobile' }
            ].map((device) => (
              <button
                key={device.key}
                onClick={() => {
                  setActiveTab(device.key);
                  setCurrentSlide(0);
                  stopSlideshow();
                }}
                className={`device-button px-3 py-2 md:px-6 md:py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${activeTab === device.key
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-800 hover:bg-gray-300'
                  }`}
              >
                {device.icon}
                <span>{device.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="demo-container relative rounded-3xl p-8 shadow-2xl">
          <div className={`device-frame mx-auto transition-all duration-500 ${activeTab === 'desktop' ? 'max-w-4xl' :
              activeTab === 'tablet' ? 'max-w-2xl' :
                'max-w-xs'
            }`}>
            {/* device mockup */}
            <div className={`device-mockup relative rounded-xl border-8 border-gray-400 shadow-2xl ${activeTab === 'desktop' ? 'rounded-b-2xl' :
                activeTab === 'tablet' ? 'rounded-3xl' :
                  'rounded-4xl'
              }`}>
              <div className="overflow-hidden">
                <div className="relative">
                  <img
                    src={currentScreenshots[currentSlide].image}
                    alt={currentScreenshots[currentSlide].alt}
                    className="demo-image w-full object-cover transition-opacity duration-500"
                  />

                  <div className="demo-overlay absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={openModal}
                      className="maximize-button p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                    >
                      <Maximize className="w-8 h-8 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="navigation-controls flex items-center justify-center mt-8 space-x-6">
            <button
              onClick={prevSlide}
              className="nav-button p-3 bg-gray-400 rounded-full hover:bg-gray-600 transition-colors duration-300 group"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:text-blue-400" />
            </button>

            <button
              onClick={toggleSlideshow}
              className="play-pause-button p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 text-white" />
              ) : (
                <Play className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={nextSlide}
              className="nav-button p-3 bg-gray-400 rounded-full hover:bg-gray-600 transition-colors duration-300 group"
            >
              <ChevronRight className="w-6 h-6 text-white group-hover:text-blue-400" />
            </button>
          </div>

          {/* slide info */}
          <div className="slide-info text-center mt-6">
            <h3 className="slide-title text-xl font-semibold mb-2">
              {currentScreenshots[currentSlide].title}
            </h3>
            <p className="slide-description text-gray-700 max-w-md mx-auto">
              {currentScreenshots[currentSlide].description}
            </p>
          </div>

          {/* slide indicator */}
          <div className="slide-indicators flex justify-center mt-6 space-x-2">
            {currentScreenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  stopSlideshow();
                }}
                className={`indicator ${index === currentSlide ? 'active' : ''} w-3 h-3 rounded-full transition-all duration-300`}
              />
            ))}
          </div>
        </div>

        <div className="features-grid grid md:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-item text-center p-6 bg-gray-50 rounded-2xl shadow-xl transition-colors duration-300"
            >
              <div className="feature-icon mb-4 flex justify-center">
                {feature.icon}
              </div>
              <h3 className="feature-title text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="feature-description text-gray-600">{feature.description}</p>
            </div>
          ))}

        </div>
      </div>

      {/* modal for fullscreen*/}
      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 bg-white/90 z-50 flex items-center justify-center p-4">
          <div className="modal-content relative max-w-6xl max-h-full">
            <button
              onClick={closeModal}
              className="modal-close absolute top-4 right-4 z-10 p-2 bg-gray-500 rounded-full hover:bg-gray-700 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <div className="modal-body bg-gray-300 rounded-2xl p-4">
              <img
                src={currentScreenshots[currentSlide].image}
                alt={currentScreenshots[currentSlide].alt}
                className="modal-image max-w-full max-h-[80vh] object-contain rounded-lg"
              />

              <div className="modal-text text-center mt-4">
                <h3 className="modal-title text-xl font-semibold">
                  {currentScreenshots[currentSlide].title}
                </h3>
                <p className="modal-description text-gray-600">
                  {currentScreenshots[currentSlide].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default DemoPreview;