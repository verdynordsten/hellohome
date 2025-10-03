import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const locations = [
  {
    id: "pollux-habibie",
    name: "Pollux Habibie",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
    area: "Batam City Center",
    units: 12,
    description: "Premium apartments in the heart of Batam with infinity pool and modern gym",
    features: ["City Mall Access", "Infinity Pool", "Modern Gym"],
  },
  {
    id: "citra-plaza",
    name: "Citra Plaza Nagoya",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
    area: "Nagoya",
    units: 8,
    description: "Hotel-standard apartments with stunning city views in prime Nagoya area",
    features: ["Sea View", "City View", "Premium Design"],
  },
  {
    id: "nagoya-thamrin",
    name: "Nagoya Thamrin City",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
    area: "Thamrin",
    units: 10,
    description: "Affordable apartments with complete facilities and easy airport access",
    features: ["Airport Access", "Complete Facilities", "Strategic Location"],
  },
  {
    id: "house-rental",
    name: "House Rental Batam",
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80",
    area: "Various Locations",
    units: 5,
    description: "Spacious house rentals perfect for families and large groups",
    features: ["4 Bedrooms", "Kitchen", "Free Parking"],
  },
];

const FeaturedUnits = () => {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Our Locations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover premium apartment locations across Batam with world-class facilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {locations.map((location) => (
            <Card key={location.id} className="overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img
                  src={location.image}
                  alt={location.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                    <Building2 className="h-3 w-3 mr-1" />
                    {location.units} Units Available
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <h3 className="text-2xl font-bold">{location.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {location.area}
                </p>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-4">{location.description}</p>
                <div className="flex flex-wrap gap-2">
                  {location.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link to="/locations">View Available Units</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedUnits;
