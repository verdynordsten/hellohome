import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Wifi, Tv, Droplets, Coffee } from "lucide-react";

const locationData: Record<string, any> = {
  "senayan-city": {
    name: "Senayan City",
    fullName: "Unit Apartemen di Senayan City",
    description: "Premium apartment in the heart of Jakarta city with direct access to Senayan City Mall. Features infinity pool and modern gym center.",
    units: [
      {
        id: "sc-1205",
        name: "Unit 1205",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 12,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "sc-1815",
        name: "Unit 1815",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 18,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "sc-2310",
        name: "Unit 2310",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 23,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "sc-2918",
        name: "Unit 2918",
        image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 29,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
    ],
  },
  "sudirman-plaza": {
    name: "Sudirman Plaza",
    fullName: "Unit Apartemen di Sudirman Plaza",
    description: "Hotel apartment jakarta in Sudirman area with stunning city views. Close to business center and entertainment district.",
    units: [
      {
        id: "sp-1205",
        name: "Unit 1205",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 12,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "sp-1221",
        name: "Unit 1221",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 12,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "sp-1223",
        name: "Unit 1223",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 12,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "sp-1705",
        name: "Unit 1705",
        image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 17,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "sp-1815",
        name: "Unit 1815",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 18,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "sp-2610",
        name: "Unit 2610",
        image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 26,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "sp-2918",
        name: "Unit 2918",
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 29,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "sp-3702",
        name: "Unit 3702",
        image: "https://images.unsplash.com/photo-1566908829550-e6551b00979b?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 37,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
    ],
  },
  "kuningan-residence": {
    name: "Kuningan Residence",
    fullName: "Unit Apartemen di Kuningan Residence",
    description: "Luxury apartment jakarta rental with complete facilities in strategic Kuningan area. Easy access to business district and shopping centers.",
    units: [
      {
        id: "kr-1108",
        name: "Unit 1108",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 11,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "kr-1510",
        name: "Unit 1510",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 15,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "kr-2205",
        name: "Unit 2205",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 22,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "kr-2810",
        name: "Unit 2810",
        image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 28,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
    ],
  },
  "house-rental": {
    name: "House Rental Jakarta",
    fullName: "House Rental di Jakarta",
    description: "Daily house rental jakarta with 4 bedrooms for large groups. Complete with kitchen, living room, and free parking - perfect for families or groups.",
    units: [
      {
        id: "hr-001",
        name: "House 1",
        image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80",
        type: "4BR House",
        floor: 0,
        view: "Garden View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "hr-002",
        name: "House 2",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80",
        type: "4BR House",
        floor: 0,
        view: "Street View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "hr-003",
        name: "House 3",
        image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80",
        type: "4BR House",
        floor: 0,
        view: "Garden View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "hr-004",
        name: "House 4",
        image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80",
        type: "4BR House",
        floor: 0,
        view: "Street View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "hr-005",
        name: "House 5",
        image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80",
        type: "4BR House",
        floor: 0,
        view: "Garden View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
    ],
  },
};

const amenityIcons: Record<string, any> = {
  wifi: Wifi,
  tv: Tv,
  water: Droplets,
  coffee: Coffee,
};

const LocationUnits = () => {
  const { locationId } = useParams();
  const location = locationId ? locationData[locationId] : null;

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
              <h1 className="text-4xl font-bold text-primary mb-2">{location.fullName}</h1>
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
          <h2 className="text-3xl font-bold mb-8">Available Units</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {location.units.map((unit: any) => (
              <Card key={unit.id} className="overflow-hidden hover:shadow-card-hover transition-all group">
                <div className="relative overflow-hidden h-48">
                  <img
                    src={unit.image}
                    alt={unit.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
                    {unit.type}
                  </Badge>
                </div>

                <CardHeader>
                  <h3 className="text-xl font-bold">{unit.name}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Floor {unit.floor}</span>
                    <span>{unit.view}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex gap-4">
                    {unit.amenities.map((amenity: string) => {
                      const Icon = amenityIcons[amenity];
                      return Icon ? (
                        <div key={amenity} className="text-primary" title={amenity}>
                          <Icon className="h-5 w-5" />
                        </div>
                      ) : null;
                    })}
                  </div>
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
