import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Wifi, Tv, Droplets, Coffee } from "lucide-react";

const locationData: Record<string, any> = {
  "pollux-habibie": {
    name: "Pollux Habibie",
    fullName: "Unit Apartemen di Pollux Habibie",
    description: "Premium apartment in the heart of Batam city with direct access to Batam City Mall. Features infinity pool and modern gym center.",
    units: [
      {
        id: "ph-1205",
        name: "Unit 1205",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 12,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "ph-1815",
        name: "Unit 1815",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 18,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "ph-2310",
        name: "Unit 2310",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 23,
        view: "Sea View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "ph-2918",
        name: "Unit 2918",
        image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 29,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
    ],
  },
  "citra-plaza": {
    name: "Citra Plaza Nagoya",
    fullName: "Unit Apartemen di Citra Plaza Nagoya",
    description: "Lokasi strategis dengan akses mudah ke pusat kota dan fasilitas umum",
    units: [
      {
        id: "cp-1205",
        name: "Unit 1205",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 12,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "cp-1221",
        name: "Unit 1221",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 12,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "cp-1223",
        name: "Unit 1223",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 12,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "cp-1705",
        name: "Unit 1705",
        image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 17,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "cp-1815",
        name: "Unit 1815",
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 18,
        view: "Sea View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "cp-2610",
        name: "Unit 2610",
        image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 26,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "cp-2918",
        name: "Unit 2918",
        image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 29,
        view: "Sea View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "cp-3702",
        name: "Unit 3702",
        image: "https://images.unsplash.com/photo-1566908829550-e6551b00979b?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 37,
        view: "Sea View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
    ],
  },
  "nagoya-thamrin": {
    name: "Nagoya Thamrin City",
    fullName: "Unit Apartemen di Nagoya Thamrin City",
    description: "Affordable apartment batam rental with complete facilities in strategic Thamrin area. Easy access to airport and harbor.",
    units: [
      {
        id: "nt-1108",
        name: "Unit 1108",
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 11,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "nt-1510",
        name: "Unit 1510",
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 15,
        view: "City View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "nt-2205",
        name: "Unit 2205",
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
        type: "Studio",
        floor: 22,
        view: "Sea View",
        amenities: ["wifi", "tv", "water", "coffee"],
      },
      {
        id: "nt-2810",
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
    name: "House Rental Batam",
    fullName: "House Rental di Batam",
    description: "Daily house rental batam with 4 bedrooms for large groups. Complete with kitchen, living room, and free parking - perfect for families or groups.",
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
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80",
        type: "5BR House",
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
  const location = locationData[locationId || ""];

  if (!location) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Location Not Found</h1>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-12 bg-muted/30 border-b">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-2">{location.fullName}</h1>
              <p className="text-muted-foreground">{location.description}</p>
            </div>
            <Badge className="bg-accent text-accent-foreground px-4 py-2 text-base">
              {location.units.length} Unit Tersedia
            </Badge>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {location.units.map((unit: any) => (
              <Card key={unit.id} className="overflow-hidden hover:shadow-card-hover transition-all duration-300 group">
                <div className="relative overflow-hidden">
                  <img
                    src={unit.image}
                    alt={unit.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-primary/90 text-primary-foreground">
                      {unit.type}
                    </Badge>
                    {unit.floor > 0 && (
                      <Badge className="bg-background/90 text-foreground">
                        Floor {unit.floor}
                      </Badge>
                    )}
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <h3 className="text-lg font-bold">{unit.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {location.name}
                  </p>
                </CardHeader>

                <CardContent className="pb-3">
                  <p className="text-sm text-accent font-medium mb-3">{unit.view}</p>
                  <div className="flex gap-3">
                    {unit.amenities.map((amenity: string, idx: number) => {
                      const Icon = amenityIcons[amenity];
                      return Icon ? <Icon key={idx} className="h-4 w-4 text-muted-foreground" /> : null;
                    })}
                    <span className="text-xs text-muted-foreground">+3 more</span>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link to={`/unit/${unit.id}`}>View Details & Book</Link>
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
