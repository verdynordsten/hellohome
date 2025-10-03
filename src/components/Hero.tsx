import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-hero-gradient">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20"></div>
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
          Your Premium Home in Batam
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-fade-in">
          Experience the comfort of living in Batam's best apartments with complete facilities and strategic locations. Unforgettable stay experiences await you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link to="#search">Find Apartment</Link>
          </Button>
          <Button asChild size="lg" variant="hero">
            <a href="https://wa.me/628116918078" target="_blank" rel="noopener noreferrer">
              Book Now
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
