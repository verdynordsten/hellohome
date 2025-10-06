import { useEffect } from "react";
import { useLocationStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";
import { Link } from "react-router-dom";

const AllLocations = () => {
  const { locations, isLoading, fetchLocations } = useLocationStore();

  useEffect(() => {
    if (locations.length === 0) {
      fetchLocations();
    }
  }, [fetchLocations, locations.length]);
  
  // Randomly shuffle and select 4 locations
  const shuffled = [...locations].sort(() => Math.random() - 0.5);
  const displayLocations = shuffled.slice(0, 4);

  if (isLoading) {
    return (
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Our Locations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover premium apartment locations across Jakarta with world-class facilities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayLocations.map((location) => (
            <Card key={location.id} className="overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img
                  src={location.image_url || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80"}
                  alt={location.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                    <Building2 className="h-3 w-3 mr-1" />
                    {location.units_count || 0} Units Available
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <h3 className="text-2xl font-bold">{location.name}</h3>
              </CardHeader>

              <CardContent>
                <p className="text-muted-foreground mb-4">{location.description}</p>
              </CardContent>

              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link to={`/locations/${location.slug || location.id}`}>View Available Units</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AllLocations;
