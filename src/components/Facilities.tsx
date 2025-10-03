import { Card, CardContent } from "@/components/ui/card";
import { Wifi, Tv, Waves, Shield, Car } from "lucide-react";

const facilities = [
  {
    icon: Wifi,
    title: "Super fast WiFi for work and streaming",
  },
  {
    icon: Tv,
    title: "Free Netflix Premium in every unit",
  },
  {
    icon: Waves,
    title: "Swimming pool and gym center",
  },
  {
    icon: Shield,
    title: "24/7 security with card access system",
  },
  {
    icon: Car,
    title: "Housekeeping and laundry service",
  },
];

const Facilities = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Premium Apartment Batam Facilities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {facilities.map((facility, idx) => (
            <Card key={idx} className="hover:shadow-card-hover transition-all duration-300">
              <CardContent className="flex items-start gap-4 p-6">
                <facility.icon className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                <p className="text-muted-foreground">{facility.title}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Facilities;
