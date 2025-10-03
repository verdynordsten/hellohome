import { useState, useEffect } from "react";
import type { DateRange } from "react-day-picker";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Building2, MapPin, Wifi, Tv, Wind, Car, CheckCircle, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

type Unit = {
  id: string;
  location_id: string;
  unit_name: string | null;
  type: string;
  floor: string | null;
  building: string | null;
  tower: string | null;
  view: string | null;
  features: string[] | null;
  images: string[] | null;
  image_url: string | null;
  price_per_night: number | null;
  price_per_month: number | null;
  description: string | null;
  available: boolean | null;
};

type Location = {
  id: string;
  name: string;
};

const UnitDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [unit, setUnit] = useState<Unit | null>(null);
  const [location, setLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUnitDetails();
    }
  }, [id]);

  const fetchUnitDetails = async () => {
    try {
      const { data: unitData, error: unitError } = await supabase
        .from("units")
        .select("*")
        .eq("id", id)
        .single();

      if (unitError) throw unitError;
      setUnit(unitData);

      // Fetch location details
      if (unitData.location_id) {
        const { data: locationData, error: locationError } = await supabase
          .from("locations")
          .select("id, name")
          .eq("id", unitData.location_id)
          .single();

        if (locationError) throw locationError;
        setLocation(locationData);
      }
    } catch (error) {
      console.error("Error fetching unit:", error);
    } finally {
      setLoading(false);
    }
  };

  const unitImages = unit?.images && unit.images.length > 0 
    ? unit.images 
    : [
        unit?.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      ];

  // Autoplay functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setSelectedImage((prev) => (prev + 1) % unitImages.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [unitImages.length]);

  const handleImageSelect = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedImage(index);
      setIsTransitioning(false);
    }, 300);
  };
  
  // Form state
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("1");
  const [checkInTime, setCheckInTime] = useState("14:00");
  const [specialRequests, setSpecialRequests] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleBookingSubmit = () => {
    if (!guestName || !email || !phone || !dateRange?.from || !dateRange?.to) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!agreedToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    const unitName = unit?.unit_name || unit?.type || id;
    const locationName = location?.name || "Unknown Location";
    const message = `*Reservation Form*%0A%0A*Guest Information*%0AName: ${guestName}%0AEmail: ${email}%0APhone: ${phone}%0ANumber of Guests: ${guests}%0A%0A*Booking Details*%0ALocation: ${locationName}%0AUnit: ${unitName}%0ACheck-in: ${format(dateRange.from, "dd MMMM yyyy")} at ${checkInTime}%0ACheck-out: ${format(dateRange.to, "dd MMMM yyyy")}%0A%0A*Special Requests*%0A${specialRequests || "None"}`;
    
    window.open(`https://wa.me/628116918078?text=${message}`, "_blank");
    setShowBookingForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!unit) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-16 text-center">
          <h1 className="text-4xl font-bold mb-4">Unit Not Found</h1>
          <p className="text-muted-foreground mb-8">The unit you're looking for doesn't exist.</p>
          <Link to="/locations" className="text-primary hover:underline">← Back to Locations</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Image Slider */}
          <div className="space-y-4 mb-8">
            {/* Main Image */}
            <div className="relative h-[400px] rounded-xl overflow-hidden group">
              <div className="relative w-full h-full">
                {unitImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${unit.unit_name || unit.type} view ${index + 1}`}
                    className={cn(
                      "absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out",
                      selectedImage === index
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-105"
                    )}
                  />
                ))}
              </div>
              <Badge className="absolute top-4 left-4 bg-primary z-10">
                {unit.type}
              </Badge>
              {!unit.available && (
                <Badge className="absolute top-4 right-20 bg-destructive z-10">
                  Rented
                </Badge>
              )}
              
              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm z-10">
                {selectedImage + 1} / {unitImages.length}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-7 gap-2">
              {unitImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleImageSelect(index)}
                  className={cn(
                    "relative aspect-video rounded-lg overflow-hidden transition-all duration-300 hover-scale",
                    selectedImage === index
                      ? "ring-2 ring-primary scale-105 shadow-lg"
                      : "opacity-70 hover:opacity-100"
                  )}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {selectedImage === index && (
                    <div className="absolute inset-0 bg-primary/20" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-primary">{unit.type}</Badge>
                  {unit.floor && <Badge variant="outline">Floor {unit.floor}</Badge>}
                  {unit.view && <Badge variant="outline">{unit.view}</Badge>}
                </div>
                <h1 className="text-3xl font-bold mb-2">{unit.unit_name || `${unit.type} Unit`}</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {location?.name}
                  {unit.building && ` • ${unit.building}`}
                  {unit.tower && ` • ${unit.tower}`}
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold mb-4">Description</h2>
                <p className="text-foreground leading-relaxed">
                  {unit.description || `Experience comfortable living in this ${unit.type.toLowerCase()}. ${unit.view ? `Enjoy beautiful ${unit.view.toLowerCase()} from this unit.` : ''} Perfect for both short-term and long-term stays.`}
                </p>
              </div>

              {unit.features && unit.features.length > 0 && (
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Facilities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {unit.features.map((feature, idx) => {
                      const iconMap: Record<string, any> = {
                        "WiFi": Wifi,
                        "Smart TV": Tv,
                        "Cable TV": Tv,
                        "Air Conditioning": Wind,
                        "Parking": Car,
                        "Free Parking": Car,
                        "Gym Access": Building2,
                        "Pool Access": Building2,
                        "Swimming Pool": Building2,
                        "24/7 Security": CheckCircle,
                      };
                      const Icon = iconMap[feature] || CheckCircle;
                      
                      return (
                        <div key={idx} className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                          <Icon className="h-5 w-5 text-primary" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

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
                    <h3 className="text-xl font-semibold mb-4">Book This Unit</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Date Range Picker */}
                    <div className="space-y-2">
                      <Label>Check-in & Check-out Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !dateRange && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, "dd MMM")} - {format(dateRange.to, "dd MMM yyyy")}
                                </>
                              ) : (
                                format(dateRange.from, "dd MMM yyyy")
                              )
                            ) : (
                              <span>Select dates</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                          <Calendar
                            mode="range"
                            selected={dateRange}
                            onSelect={setDateRange}
                            disabled={(date) => {
                              const today = new Date();
                              today.setHours(0, 0, 0, 0);
                              return date < today;
                            }}
                            numberOfMonths={2}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    {unit.price_per_night ? (
                      <>
                        <div className="text-3xl font-bold text-primary mb-2">
                          IDR {unit.price_per_night.toLocaleString()}
                          <span className="text-base font-normal text-muted-foreground">/night</span>
                        </div>
                        {unit.price_per_month && (
                          <p className="text-sm text-muted-foreground">
                            Monthly: IDR {unit.price_per_month.toLocaleString()}
                          </p>
                        )}
                      </>
                    ) : unit.price_per_month ? (
                      <div className="text-3xl font-bold text-primary mb-2">
                        IDR {unit.price_per_month.toLocaleString()}
                        <span className="text-base font-normal text-muted-foreground">/month</span>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Contact for pricing</p>
                    )}
                    <p className="text-sm text-muted-foreground">Minimum stay: 1 night</p>
                  </div>

                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" 
                      size="lg"
                      onClick={() => setShowBookingForm(true)}
                    >
                      Book via WhatsApp
                    </Button>
                    <Button variant="outline" className="w-full" size="lg">
                      Book via Agoda
                    </Button>
                    <Button variant="outline" className="w-full text-destructive border-destructive hover:bg-destructive/10" size="lg">
                      Book via Airbnb
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground text-center">
                    Click the button above to send a WhatsApp message with your booking details
                  </p>

                  <div className="border-t pt-4 space-y-3">
                    <h3 className="font-semibold">Or Contact Directly</h3>
                    <div className="space-y-2 text-sm">
                      <p className="flex items-center gap-2">
                        <span className="text-muted-foreground">📞</span>
                        <span>+62 811 691 8078</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span className="text-muted-foreground">💬</span>
                        <span>WhatsApp</span>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Form Dialog */}
      <Dialog open={showBookingForm} onOpenChange={setShowBookingForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Reservation Form
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Guest Information */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="text-primary">👤</span>
                Guest Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="guestName">Guest Name *</Label>
                  <Input
                    id="guestName"
                    placeholder="Enter guest full name"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="+1 XXX XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="guest@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="guests">Number of Guests *</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Booking Details */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="text-primary">📅</span>
                Booking Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Booking Date (Today)</Label>
                  <Input
                    value={format(new Date(), "dd MMMM yyyy")}
                    disabled
                    className="bg-muted"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Booked Unit</Label>
                  <Input
                    value={`${location?.name || "Unknown"} - ${unit.unit_name || unit.type}`}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check-in Date</Label>
                  <Input
                    value={dateRange?.from ? format(dateRange.from, "dd MMMM yyyy") : "Not selected"}
                    disabled
                    className="bg-muted"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Check-out Date</Label>
                  <Input
                    value={dateRange?.to ? format(dateRange.to, "dd MMMM yyyy") : "Not selected"}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkInTime">Check-in Time *</Label>
                <Input
                  id="checkInTime"
                  type="time"
                  value={checkInTime}
                  onChange={(e) => setCheckInTime(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialRequests">Special Requests</Label>
                <Textarea
                  id="specialRequests"
                  placeholder="Any special requests or notes..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  rows={4}
                />
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm cursor-pointer">
                I agree to the terms and conditions and privacy policy
              </Label>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowBookingForm(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                onClick={handleBookingSubmit}
              >
                Submit & Send to WhatsApp
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UnitDetail;
