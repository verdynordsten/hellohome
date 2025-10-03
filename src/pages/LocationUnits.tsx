import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Wifi, Tv, Wind, Car, CheckCircle, Building2 } from "lucide-react";

type Location = {
  id: string;
  name: string;
  description: string | null;
  units_count: number;
  image_url: string | null;
  slug: string | null;
};

type Unit = {
  id: string;
  location_id: string;
  unit_name: string | null;
  type: string;
  floor: string | null;
  view: string | null;
  features: string[] | null;
  image_url: string | null;
  price_per_night: number | null;
  available: boolean | null;
};

const featureIcons: Record<string, any> = {
  "WiFi": Wifi,
  "Smart TV": Tv,
  "Cable TV": Tv,
  "Air Conditioning": Wind,
  "Parking": Car,
  "Free Parking": Car,
  "Gym Access": Building2,
  "Pool Access": Building2,
  "24/7 Security": CheckCircle,
};
const LocationUnits = () => {
  const { locationId: locationSlug } = useParams();
  const [location, setLocation] = useState<Location | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (locationSlug) {
      fetchLocationAndUnits();
    }
  }, [locationSlug]);

  const fetchLocationAndUnits = async () => {
    try {
      // Try to fetch by slug first, then by id
      let locationData = null;
      
      // First try by slug
      const { data: slugData } = await supabase
        .from("locations")
        .select("*")
        .eq("slug", locationSlug)
        .maybeSingle();
      
      if (slugData) {
        locationData = slugData;
      } else {
        // If not found by slug, try by id
        const { data: idData } = await supabase
          .from("locations")
          .select("*")
          .eq("id", locationSlug)
          .maybeSingle();
        
        locationData = idData;
      }

      if (!locationData) {
        setLoading(false);
        return;
      }
      setLocation(locationData);

      // Fetch units for this location
      const { data: unitsData, error: unitsError } = await supabase
        .from("units")
        .select("*")
        .eq("location_id", locationData.id)
        .order("floor");

      if (unitsError) throw unitsError;
      setUnits(unitsData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!location) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Location Not Found</h1>
          <p className="text-muted-foreground mb-8">The location you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/locations">Back to Locations</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-32 pb-12 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start">
            <div>
              <Link to="/locations" className="text-primary hover:underline mb-4 inline-block">
                ← Back to Locations
              </Link>
              <h1 className="text-4xl font-bold text-primary mb-2">{location.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5" />
                {location.name}
              </p>
              <p className="text-muted-foreground max-w-3xl">{location.description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Available Units ({units.length})</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((unit) => (
              <Card key={unit.id} className="overflow-hidden hover:shadow-card-hover transition-all group">
                <div className="relative overflow-hidden h-48">
                  <img
                    src={unit.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"}
                    alt={unit.unit_name || unit.type}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
                    {unit.type}
                  </Badge>
                  {!unit.available && (
                    <Badge className="absolute top-4 right-4 bg-destructive/90 text-destructive-foreground">
                      Rented
                    </Badge>
                  )}
                </div>

                <CardHeader>
                  <h3 className="text-xl font-bold">{unit.unit_name || `${unit.type} Unit`}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Floor {unit.floor || "N/A"}</span>
                    <span>{unit.view || "City View"}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {unit.features?.slice(0, 4).map((feature, idx) => {
                      const Icon = featureIcons[feature];
                      return (
                        <div key={idx} className="flex items-center gap-1 text-xs text-muted-foreground" title={feature}>
                          {Icon && <Icon className="h-4 w-4 text-primary" />}
                          <span>{feature}</span>
                        </div>
                      );
                    })}
                  </div>
                  {unit.price_per_night && (
                    <p className="text-lg font-bold text-primary">
                      IDR {unit.price_per_night.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/night</span>
                    </p>
                  )}
                </CardContent>

                <CardFooter>
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link to={`/unit/${unit.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LocationUnits;
