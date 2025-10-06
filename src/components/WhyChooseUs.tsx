import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wifi, Tv, Coffee, Waves } from "lucide-react";

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
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Why Choose Hello Home?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Best stay experience with premium facilities and satisfying service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} className="text-center hover:shadow-card-hover transition-all duration-300">
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
