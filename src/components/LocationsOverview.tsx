import { useEffect } from "react";
import { useLocationStore } from "@/stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const LocationsOverview = () => {
  const { locations, isLoading, fetchLocations } = useLocationStore();

  useEffect(() => {
    if (locations.length === 0) {
      fetchLocations();
    }
  }, [fetchLocations, locations.length]);
  
  // Sort locations by name
  const sortedLocations = [...locations].sort((a, b) => a.name.localeCompare(b.name));

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">
            Best Apartment Jakarta - Premium Daily Apartment Rental
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto mb-4">
            HelloHome Apartment is the #1 choice for apartment jakarta with hotel-grade standards. We provide daily and
            monthly apartment rentals in strategic locations with premium facilities.
          </p>
          <p className="text-muted-foreground max-w-4xl mx-auto">
            Why choose apartment jakarta from HelloHome? We offer premium apartemen jakarta with hotel-grade standards, strategic city
            center locations, and competitive pricing. Every daily apartment jakarta is equipped with modern facilities and excellent service.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {sortedLocations.map((location) => (
            <Card key={location.id} className="hover:shadow-card-hover transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-start gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>{location.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{location.description}</p>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link to={`/locations/${location.slug || location.id}`}>View Available Units</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LocationsOverview;
