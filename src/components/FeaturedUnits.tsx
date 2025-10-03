import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const units = [
  {
    id: "ph-a1-2918",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
    type: "Studio",
    floor: 29,
    unit: "Unit A1-2918",
    building: "Meisterstadt Pollux Habibie",
    tower: "Tower A1",
    features: ["Japanese Design", "City View"],
  },
  {
    id: "cp-3702a",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
    type: "Studio",
    floor: 37,
    unit: "Unit 3702A",
    building: "Citra Plaza Nagoya",
    tower: "",
    features: ["Sea View", "Modern Design", "Prime Location"],
  },
  {
    id: "ph-a1-5310",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80",
    type: "Studio",
    floor: 53,
    unit: "Unit A1-5310",
    building: "Meisterstadt Pollux Habibie",
    tower: "Tower A1",
    features: ["Sea View", "High Floor"],
  },
];

const FeaturedUnits = () => {
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
          {units.map((unit) => (
            <Card key={unit.id} className="overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img
                  src={unit.image}
                  alt={unit.unit}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                    <Building2 className="h-3 w-3 mr-1" />
                    {unit.type}
                  </Badge>
                  <Badge variant="secondary" className="bg-accent/90 text-accent-foreground">
                    <Layers className="h-3 w-3 mr-1" />
                    Floor {unit.floor}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <h3 className="text-xl font-bold">{unit.unit}</h3>
                <p className="text-sm text-muted-foreground">
                  {unit.building}
                  {unit.tower && ` • ${unit.tower}`}
                </p>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {unit.features.map((feature, idx) => (
                    <Badge key={idx} variant="outline">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter>
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link to={`/unit/${unit.id}`}>View Details & Book</Link>
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
