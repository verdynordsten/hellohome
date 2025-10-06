import { useEffect } from "react";
import { useUnitStore } from "@/stores";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const FeaturedUnits = () => {
  const { units, isLoading, fetchUnits } = useUnitStore();

  useEffect(() => {
    if (units.length === 0) {
      fetchUnits();
    }
  }, [fetchUnits, units.length]);
  
  // Filter available units and limit to 3
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
            <Card key={unit.id} className="overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img
                  src={unit.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"}
                  alt={unit.unit_name || unit.type}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
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

              <CardHeader>
                <h3 className="text-xl font-bold">{unit.name || unit.unit_name || `${unit.type} Unit`}</h3>
              </CardHeader>

              <CardContent>
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
                  <Link to={`/unit/${unit.slug || unit.id}`}>View Details & Book</Link>
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
