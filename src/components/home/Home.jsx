import Hero from './Hero';
import Features from './Features';
import HowItWorks from './HowItWorks';
import DemoPreview from './DemoPreview';
const Home = () => {
    return (
        <div>
          <Hero></Hero> 
          <Features></Features>
          <HowItWorks></HowItWorks>
          <DemoPreview></DemoPreview>
        </div>
    );
};

export default Home;