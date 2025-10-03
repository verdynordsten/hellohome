import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";

type Location = {
  id: string;
  name: string;
  description: string | null;
};

const LocationsOverview = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from("locations")
        .select("id, name, description")
        .order("name");

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
          {locations.map((location) => (
            <Card key={location.id} className="hover:shadow-card-hover transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-start gap-2 text-lg">
                  <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                  <span>{location.name}</span>
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
