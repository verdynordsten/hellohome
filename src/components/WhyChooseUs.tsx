import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Tv, Coffee, Waves, Car, Shield, Dumbbell, Utensils, Wind } from "lucide-react";
import { useEffect, useRef } from "react";

const features = [
  {
    icon: Wifi,
    title: "Super Fast WiFi",
    description: "High-speed internet for work and entertainment needs",
  },
  {
    icon: Tv,
    title: "Premium Netflix",
    description: "Free access to Netflix for unlimited entertainment",
  },
  {
    icon: Coffee,
    title: "Complete Facilities",
    description: "Coffee, tea, mineral water, and complete amenities available",
  },
  {
    icon: Waves,
    title: "Swimming Pool Access",
    description: "Enjoy swimming pool and gym center facilities",
  },
  {
    icon: Car,
    title: "Free Parking",
    description: "Secure parking space available for all guests",
  },
  {
    icon: Shield,
    title: "24/7 Security",
    description: "Advanced security system with CCTV monitoring",
  },
  {
    icon: Dumbbell,
    title: "Fitness Center",
    description: "Modern gym equipment for your workout routine",
  },
  {
    icon: Utensils,
    title: "Kitchen Facilities",
    description: "Fully equipped kitchen for your cooking needs",
  },
  {
    icon: Wind,
    title: "Air Conditioning",
    description: "Climate control for optimal comfort",
  },
];

const WhyChooseUs = () => {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    let animationId: number;
    let position = 0;

    const animate = () => {
      if (slider) {
        position += 0.3; 
        if (position >= slider.scrollWidth / 2) {
          position = 0;
        }
        slider.scrollLeft = position;
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <section className="py-16 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Why Choose Hello Home?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Best stay experience with premium facilities and satisfying service
          </p>
        </div>

        <div className="relative">
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-hidden scrollbar-hide"
            style={{ scrollBehavior: 'auto' }}
          >
            {[...features, ...features].map((feature, idx) => (
              <div key={idx} className="flex-shrink-0 w-64">
                <Card className="text-center hover:shadow-card-hover transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <feature.icon className="h-12 w-12 text-accent" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
