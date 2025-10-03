import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const locations = [
  {
    id: "pollux-habibie",
    name: "Pollux Habibie",
    description: "Premium apartments in the heart of Batam with infinity pool and modern gym",
    units: 12,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80",
  },
  {
    id: "citra-plaza",
    name: "Citra Plaza Nagoya",
    description: "Hotel-standard apartments with stunning city views in prime Nagoya area",
    units: 13,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
  },
  {
    id: "nagoya-thamrin",
    name: "Nagoya Thamrin City",
    description: "Affordable apartments with complete facilities and easy airport access",
    units: 10,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
  },
  {
    id: "house-rental",
    name: "House Rental Batam",
    description: "Spacious house rentals perfect for families and large groups",
    units: 5,
    image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80",
  },
];

const Locations = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Our Locations</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover premium apartments across Batam's most strategic locations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {locations.map((location) => (
              <Link key={location.id} to={`/locations/${location.id}`}>
                <Card className="overflow-hidden hover:shadow-card-hover transition-all group cursor-pointer">
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={location.image}
                      alt={location.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <MapPin className="h-5 w-5 text-primary" />
                      {location.name}
                    </CardTitle>
                    <CardDescription className="text-base">{location.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-accent font-medium">{location.units} available units</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Locations;
