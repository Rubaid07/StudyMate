import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Slider from "react-slick";
import { Star } from "lucide-react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      name: "Rubaid Islam",
      role: "Computer Science Student",
      text: "StudyMate completely transformed how I manage my coursework. The budget tracker helped me save over $500 last semester!",
      rating: 5,
      image: "https://res.cloudinary.com/djslk8o50/image/upload/v1752400850/elyzian_users/pyt09cqpv1kstu5rytas.jpg",
    },
    {
      id: 2,
      name: "Rubaid07",
      role: "School Student",
      text: "The Q&A generator is a game-changer for exam preparation. It helped me create customized practice tests.",
      rating: 5,
      image: "https://res.cloudinary.com/djslk8o50/image/upload/v1752425406/elyzian_users/ypin9fcnetesbqaiendp.jpg",
    },
    {
      id: 3,
      name: "Jubaid Islam",
      role: "Engineering Student",
      text: "I've tried countless student apps, but StudyMate is the only one that actually understands student life.",
      rating: 5,
      image: "https://res.cloudinary.com/djslk8o50/image/upload/v1753078591/elyzian_users/frfd2s4wcn208jzdptj3.jpg",
    },
    {
      id: 4,
      name: "Junaid Islam",
      role: "Business Student",
      text: "The study planner feature helped me break down complex projects into manageable tasks. My GPA improved by 0.8 points!",
      rating: 5,
      image: "https://res.cloudinary.com/djslk8o50/image/upload/v1752642506/elyzian_users/p1lxpocvgbk1mwfilkpg.jpg",
    },
  ];

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    speed: 800,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="testimonials-section py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="testimonials-title text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            What <span className='text-indigo-500'>Students Say</span>
          </h2>
          <p className="testimonials-subtitle text-gray-600 text-lg">
            Hear from students who are using <span className="font-bold">StudyMate</span> to
            succeed
          </p>
        </div>

        {/* slider */}
        <Slider {...settings}>
          {testimonials.map((t) => (
            <div key={t.id} className="px-4">
              <div className="testimonial-card bg-white rounded-3xl border border-gray-100 p-8 text-center h-[355px] flex flex-col justify-between">
                {/* User Image */}
                <div className="flex justify-center mb-4">
                  <img
                    src={t.image}
                    alt={t.name}
                    className="testimonial-image w-20 h-20 rounded-full object-cover border-4 border-indigo-100 shadow-md"
                  />
                </div>
                <div className="flex justify-center mb-4">
                  {renderStars(t.rating)}
                </div>
                <p className="testimonial-text text-gray-700 italic text-lg leading-relaxed mb-6">
                  “{t.text}”
                </p>
                <div>
                  <h4 className="testimonial-name font-bold text-gray-900 text-lg">{t.name}</h4>
                  <p className="testimonial-role text-gray-500 text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;