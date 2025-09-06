import React, { useState, useRef } from 'react';
import { 
  FiPlay, 
  FiPause, 
  FiChevronLeft, 
  FiChevronRight, 
  FiMaximize,
  FiSmartphone,
  FiTablet,
  FiMonitor,
  FiX
} from 'react-icons/fi';

const DemoPreview = () => {
  const [activeTab, setActiveTab] = useState('desktop');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const intervalRef = useRef(null);

  const screenshots = {
    desktop: [
      {
        id: 1,
        title: "Dashboard Overview",
        description: "Get a complete overview of your academic life with our intuitive dashboard.",
        image: "https://i.postimg.cc/s2wVfVTy/Screenshot-7.png",
        alt: "StudyMate Dashboard Overview"
      },
      {
        id: 2,
        title: "Class Schedule",
        description: "Manage your class schedule with color-coded subjects and easy editing.",
        image: "/api/placeholder/800/500",
        alt: "Class Schedule Interface"
      },
      {
        id: 3,
        title: "Budget Tracker",
        description: "Track your expenses and income with beautiful visualizations.",
        image: "/api/placeholder/800/500",
        alt: "Budget Tracking Dashboard"
      },
      {
        id: 4,
        title: "Study Planner",
        description: "Plan your study sessions and track your progress efficiently.",
        image: "/api/placeholder/800/500",
        alt: "Study Planning Interface"
      }
    ],
    tablet: [
      {
        id: 1,
        title: "Tablet Dashboard",
        description: "Perfectly optimized for tablet devices with touch-friendly interface.",
        image: "/api/placeholder/600/400",
        alt: "Tablet Dashboard View"
      },
      {
        id: 2,
        title: "Mobile Class View",
        description: "Access your class schedule on the go with our mobile interface.",
        image: "/api/placeholder/600/400",
        alt: "Mobile Class Schedule"
      }
    ],
    mobile: [
      {
        id: 1,
        title: "Mobile Dashboard",
        description: "Full-featured dashboard optimized for mobile devices.",
        image: "/api/placeholder/400/600",
        alt: "Mobile Dashboard"
      },
      {
        id: 2,
        title: "Quick Actions",
        description: "Quick access to frequently used features on mobile.",
        image: "/api/placeholder/400/600",
        alt: "Mobile Quick Actions"
      },
      {
        id: 3,
        title: "Notifications",
        description: "Stay updated with smart notifications and reminders.",
        image: "/api/placeholder/400/600",
        alt: "Mobile Notifications"
      }
    ]
  };

  const currentScreenshots = screenshots[activeTab];
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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Cleanup interval on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <section id="demo-preview" className="demo-preview-section py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title text-3xl md:text-4xl font-bold mb-4">
            See <span className='text-indigo-500'>StudyMate</span> in Action
          </h2>
          <p className="section-subtitle text-lg mb-8">
            Explore our beautiful interface and discover how StudyMate can transform your academic journey
          </p>
          <div className="section-divider w-20 h-1 bg-gradient-to-r from-blue-400 to-purple-400 mx-auto rounded-full"></div>
        </div>

        {/* Device Selector */}
        <div className="flex justify-center mb-12">
          <div className="device-selector bg-base-300 rounded-2xl p-2 flex space-x-2">
            {[
              { key: 'desktop', icon: <FiMonitor className="w-5 h-5" />, label: 'Desktop' },
              { key: 'tablet', icon: <FiTablet className="w-5 h-5" />, label: 'Tablet' },
              { key: 'mobile', icon: <FiSmartphone className="w-5 h-5" />, label: 'Mobile' }
            ].map((device) => (
              <button
                key={device.key}
                onClick={() => {
                  setActiveTab(device.key);
                  setCurrentSlide(0);
                  stopSlideshow();
                }}
                className={`device-button px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  activeTab === device.key
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-800 hover:bg-gray-400'
                }`}
              >
                {device.icon}
                <span>{device.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Demo Preview Container */}
        <div className="demo-container relative rounded-3xl p-8 shadow-2xl">
          {/* Device Frame */}
          <div className={`device-frame mx-auto transition-all duration-500 ${
            activeTab === 'desktop' ? 'max-w-4xl' : 
            activeTab === 'tablet' ? 'max-w-2xl' : 
            'max-w-xs'
          }`}>
            {/* Device Mockup */}
            <div className={`device-mockup relative rounded-3xl border-8 border-gray-400 shadow-2xl ${
              activeTab === 'desktop' ? 'rounded-b-2xl' : 
              activeTab === 'tablet' ? 'rounded-3xl' : 
              'rounded-4xl'
            }`}>
              {/* Screen Content */}
              <div className="overflow-hidden">
                <div className="relative">
                  <img
                    src={currentScreenshots[currentSlide].image}
                    alt={currentScreenshots[currentSlide].alt}
                    className="demo-image w-full object-cover transition-opacity duration-500"
                  />
                  
                  {/* Overlay */}
                  <div className="demo-overlay absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={openModal}
                      className="maximize-button p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                    >
                      <FiMaximize className="w-8 h-8 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="navigation-controls flex items-center justify-center mt-8 space-x-6">
            <button
              onClick={prevSlide}
              className="nav-button p-3 bg-gray-400 rounded-full hover:bg-gray-600 transition-colors duration-300 group"
            >
              <FiChevronLeft className="w-6 h-6 text-white group-hover:text-blue-400" />
            </button>

            <button
              onClick={toggleSlideshow}
              className="play-pause-button p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110"
            >
              {isPlaying ? (
                <FiPause className="w-6 h-6 text-white" />
              ) : (
                <FiPlay className="w-6 h-6 text-white" />
              )}
            </button>

            <button
              onClick={nextSlide}
              className="nav-button p-3 bg-gray-400 rounded-full hover:bg-gray-600 transition-colors duration-300 group"
            >
              <FiChevronRight className="w-6 h-6 text-white group-hover:text-blue-400" />
            </button>
          </div>

          {/* Slide Info */}
          <div className="slide-info text-center mt-6">
            <h3 className="slide-title text-xl font-semibold mb-2">
              {currentScreenshots[currentSlide].title}
            </h3>
            <p className="slide-description text-gray-700 max-w-md mx-auto">
              {currentScreenshots[currentSlide].description}
            </p>
          </div>

          {/* Slide Indicators */}
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

        {/* Features Grid */}
        <div className="features-grid grid md:grid-cols-3 gap-8 mt-16">
          {[
            {
              icon: '🚀',
              title: 'Lightning Fast',
              description: 'Optimized for speed and performance'
            },
            {
              icon: '🎨',
              title: 'Beautiful UI',
              description: 'Modern design with intuitive interface'
            },
            {
              icon: '📱',
              title: 'Fully Responsive',
              description: 'Works perfectly on all devices'
            }
          ].map((feature, index) => (
            <div key={index} className="feature-item text-center p-6 bg-gray-50 rounded-2xl shadow-xl transition-colors duration-300">
              <div className="feature-icon text-3xl mb-4">{feature.icon}</div>
              <h3 className="feature-title text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="feature-description text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Fullscreen View */}
      {isModalOpen && (
        <div className="modal-overlay fixed inset-0 bg-white/90 z-50 flex items-center justify-center p-4">
          <div className="modal-content relative max-w-6xl max-h-full">
            <button
              onClick={closeModal}
              className="modal-close absolute top-4 right-4 z-10 p-2 bg-gray-500 rounded-full hover:bg-gray-700 transition-colors"
            >
              <FiX className="w-6 h-6 text-white" />
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