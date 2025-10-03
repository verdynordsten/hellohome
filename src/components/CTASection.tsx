import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-primary mb-4">
          Ready to Book the Best Apartment Batam?
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Contact us now for availability information and special offers on daily apartment batam.
        </p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link to="/contact">Contact Us Now</Link>
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
