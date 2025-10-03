import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchSection from "@/components/SearchSection";
import AllLocations from "@/components/AllLocations";
import FeaturedUnits from "@/components/FeaturedUnits";
import LocationsOverview from "@/components/LocationsOverview";
import Facilities from "@/components/Facilities";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/Testimonials";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <SearchSection />
      <AllLocations />
      <FeaturedUnits />
      <LocationsOverview />
      <Facilities />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
