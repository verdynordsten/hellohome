import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchSection from "@/components/SearchSection";
import AllLocations from "@/components/AllLocations";
import FeaturedUnits from "@/components/FeaturedUnits";
import LocationsOverview from "@/components/LocationsOverview";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SmoothScrollWrapper from "@/components/SmoothScrollWrapper";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <SearchSection />
      <SmoothScrollWrapper>
        <AllLocations />
        <FeaturedUnits />
        <LocationsOverview />
        <WhyChooseUs />
        <Testimonials />
        <CTASection />
        <Footer />
      </SmoothScrollWrapper>
    </div>
  );
};

export default Index;
