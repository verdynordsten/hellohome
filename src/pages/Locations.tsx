import { useEffect, useRef } from "react";
import { useLocationStore } from "@/stores";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Locations = () => {
  const { locations, isLoading, fetchLocations } = useLocationStore();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current && locations.length === 0 && !isLoading) {
      hasFetched.current = true;
      fetchLocations();
    }
  }, [fetchLocations, locations.length, isLoading]);
  
  const sortedLocations = [...locations].sort((a, b) => a.name.localeCompare(b.name));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-primary mb-4">Our Locations</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover premium apartments across Jakarta's most strategic locations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sortedLocations.map((location) => (
              <Link key={location.id} to={`/${location.slug || location.id}`}>
                <Card className="overflow-hidden hover:shadow-card-hover transition-all group cursor-pointer">
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={location.image_url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"}
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
                    <p className="text-sm text-accent font-medium">{location.units_count || 0} available units</p>
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
