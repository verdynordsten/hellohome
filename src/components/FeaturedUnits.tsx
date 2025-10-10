import { useEffect, useState, useRef } from "react";
import { useUnitStore, useLocationStore } from "@/stores";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { Location } from "@/types";
import ImageCarousel from "@/components/ui/ImageCarousel";

const FeaturedUnits = () => {
  const { units, isLoading, fetchUnits } = useUnitStore();
  const { fetchLocationById } = useLocationStore();
  const [unitLocations, setUnitLocations] = useState<Record<string, Location>>({});
  
  const unitsFetched = useRef(false);
  const locationsFetched = useRef(false);

  useEffect(() => {
    if (!unitsFetched.current && units.length === 0 && !isLoading) {
      unitsFetched.current = true;
      fetchUnits();
    }
  }, [fetchUnits, units.length, isLoading]);

  useEffect(() => {
    const fetchLocationsForUnits = async () => {
      if (locationsFetched.current) return;
      
      locationsFetched.current = true;
      const locationMap: Record<string, Location> = {};
      
      const uniqueLocationIds = [...new Set(units.map(unit => unit.location_id).filter(Boolean))];
      
      const locationPromises = uniqueLocationIds.map(async (locationId) => {
        try {
          const location = await fetchLocationById(locationId!);
          return { locationId, location };
        } catch (error) {
          console.error(`Error fetching location ${locationId}:`, error);
          return { locationId, location: null };
        }
      });
      
      const locationResults = await Promise.all(locationPromises);
      
      const locationIdToLocation: Record<string, Location> = {};
      locationResults.forEach(({ locationId, location }) => {
        if (location) {
          locationIdToLocation[locationId!] = location;
        }
      });
      
      units.forEach(unit => {
        if (unit.location_id && locationIdToLocation[unit.location_id]) {
          locationMap[unit.id] = locationIdToLocation[unit.location_id];
        }
      });
      
      setUnitLocations(locationMap);
    };

    if (units.length > 0 && !locationsFetched.current) {
      fetchLocationsForUnits();
    }
  }, [units, fetchLocationById]);
  
  const featuredUnits = units
    .filter(unit => unit.available)
    .slice(0, 3);

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
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">Featured Units</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our best apartment selections with premium facilities and stunning views
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredUnits.map((unit) => (
            <Card key={unit.id} className="overflow-hidden hover:shadow-card-hover transition-all duration-300 group flex flex-col h-full">
              <div className="relative h-64">
                <ImageCarousel
                  images={unit.images || [unit.image_url].filter(Boolean)}
                  alt={unit.name || unit.unit_name || `${unit.type} Unit`}
                  className="w-full h-full"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                    <Building2 className="h-3 w-3 mr-1" />
                    {unit.type}
                  </Badge>
                  {unit.floor && (
                    <Badge variant="secondary" className="bg-accent/90 text-accent-foreground">
                      <Layers className="h-3 w-3 mr-1" />
                      Floor {unit.floor}
                    </Badge>
                  )}
                </div>
              </div>

              <CardHeader className="flex-1">
                <h3 className="text-xl font-bold line-clamp-2">{unit.name || unit.unit_name || `${unit.type} Unit`}</h3>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="flex flex-wrap gap-2">
                  {unit.features?.slice(0, 3).map((feature, idx) => (
                    <Badge key={idx} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link to={
                    unitLocations[unit.id]
                      ? `/location/${unitLocations[unit.id].slug || unitLocations[unit.id].id}/${unit.slug || unit.id}`
                      : `/unit/${unit.slug || unit.id}`
                  }>
                    View Details & Book
                  </Link>
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
