import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Wifi, Tv, Wind, Car, CheckCircle } from "lucide-react";

const UnitDetail = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Image */}
          <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
            <img
              src="https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80"
              alt="Apartment"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-primary">Studio</Badge>
                  <Badge variant="outline">Floor 29</Badge>
                </div>
                <h1 className="text-3xl font-bold mb-2">Unit A1-2918</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Meisterstadt Pollux Habibie • Tower A1
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-foreground leading-relaxed">
                  Experience luxury living in this beautifully designed studio apartment with Japanese-inspired 
                  aesthetics. Located on the 29th floor, this unit offers stunning city views and comes fully 
                  furnished with modern amenities. Perfect for both short-term and long-term stays.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Facilities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { icon: Wifi, label: "High-Speed WiFi" },
                    { icon: Tv, label: "Smart TV" },
                    { icon: Wind, label: "Air Conditioning" },
                    { icon: Car, label: "Parking" },
                    { icon: Building2, label: "Swimming Pool" },
                    { icon: CheckCircle, label: "24/7 Security" },
                  ].map((facility, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <facility.icon className="h-5 w-5 text-primary" />
                      <span className="text-sm">{facility.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Location</h2>
                <div className="bg-muted rounded-lg h-64 flex items-center justify-center">
                  <p className="text-muted-foreground">Map view placeholder</p>
                </div>
              </div>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      IDR 350K
                      <span className="text-base font-normal text-muted-foreground">/night</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Minimum stay: 1 night</p>
                  </div>

                  <div className="space-y-3">
                    <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" size="lg">
                      <a href="https://wa.me/628116918078" className="w-full">
                        Book via WhatsApp
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      Check Availability
                    </Button>
                  </div>

                  <div className="border-t pt-4 space-y-3">
                    <h3 className="font-semibold">What's included:</h3>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Free WiFi",
                        "Utilities included",
                        "Weekly cleaning",
                        "24/7 customer support",
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UnitDetail;
