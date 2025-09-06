import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import DemoPreview from './DemoPreview';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import CTA from './CTA';
const Home = () => {
    return (
        <div>
          <Hero></Hero> 
          <Features></Features>
          <HowItWorks></HowItWorks>
          <DemoPreview></DemoPreview>
          <Testimonials></Testimonials>
          <FAQ></FAQ>
          <CTA></CTA>
        </div>
    );
};

export default Home;