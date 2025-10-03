import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchSection from "@/components/SearchSection";
import FeaturedUnits from "@/components/FeaturedUnits";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <SearchSection />
      <FeaturedUnits />
    </div>
  );
};

export default Index;
