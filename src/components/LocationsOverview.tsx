import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const locations = [
  {
    title: "Pollux Habibie Apartment Batam",
    description: "Premium apartment in the heart of Batam city with direct access to Batam City Mall. Features infinity pool and modern gym center.",
  },
  {
    title: "Citra Plaza Nagoya Apartment",
    description: "Hotel apartment batam in Nagoya area with stunning city views. Close to business center and entertainment district.",
  },
  {
    title: "Nagoya Thamrin City Apartment",
    description: "Affordable apartment batam rental with complete facilities in strategic Thamrin area. Easy access to airport and harbor.",
  },
  {
    title: "House Rental Batam",
    description: "Daily house rental batam with 4 bedrooms for large groups. Complete with kitchen, living room, and free parking - perfect for families or groups.",
  },
];

const LocationsOverview = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Best Apartment Batam - Premium Daily Apartment Rental
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-4">
            Hai Home Apartment is the #1 choice for apartment batam with hotel-grade standards. We provide daily and
            monthly apartment rentals in strategic locations with premium facilities.
          </p>
          <p className="text-muted-foreground max-w-4xl mx-auto">
            Why choose apartment batam from Hai Home? We offer premium apartemen batam with hotel-grade standards, strategic city
            center locations, and competitive pricing. Every daily apartment batam is equipped with modern facilities and excellent service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {locations.map((location, idx) => (
            <Card key={idx} className="hover:shadow-card-hover transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-start gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>{location.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{location.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsOverview;
