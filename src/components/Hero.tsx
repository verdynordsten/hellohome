import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

// Constants
const HERO_TITLE = "Your Premium Home in Jakarta";
const HERO_DESCRIPTION = "Experience the comfort of living in Jakarta's best apartments with complete facilities and strategic locations. Unforgettable stay experiences await you.";
const BACKGROUND_IMAGE_URL = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80";
const WHATSAPP_LINK = "https://wa.me/628116918078";

const Hero = () => {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center bg-hero-gradient">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url('${BACKGROUND_IMAGE_URL}')` }}
      />
      
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-in">
          {HERO_TITLE}
        </h1>
        <p className="text-lg md:text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto animate-fade-in">
          {HERO_DESCRIPTION}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Link to="#search">Find Apartment</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="hero"
          >
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Book apartment via WhatsApp"
            >
              Book Now
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
