import { useState } from "react";
import { useParams } from "react-router-dom";
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

const UnitDetail = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // Sample images for the unit
  const unitImages = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80",
  ];
  
  // Form state
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState("1");
  const [checkInTime, setCheckInTime] = useState("14:00");
  const [specialRequests, setSpecialRequests] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleBookingSubmit = () => {
    if (!guestName || !email || !phone || !checkInDate || !checkOutDate) {
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

    const message = `*Reservation Form*%0A%0A*Guest Information*%0AName: ${guestName}%0AEmail: ${email}%0APhone: ${phone}%0ANumber of Guests: ${guests}%0A%0A*Booking Details*%0AUnit: ${id}%0ACheck-in: ${format(checkInDate, "dd MMMM yyyy")} at ${checkInTime}%0ACheck-out: ${format(checkOutDate, "dd MMMM yyyy")}%0A%0A*Special Requests*%0A${specialRequests || "None"}`;
    
    window.open(`https://wa.me/628116918078?text=${message}`, "_blank");
    setShowBookingForm(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Image Slider */}
          <div className="space-y-4 mb-8">
            {/* Main Image */}
            <div className="relative h-[400px] rounded-xl overflow-hidden group">
              <img
                src={unitImages[selectedImage]}
                alt={`Apartment view ${selectedImage + 1}`}
                className="w-full h-full object-cover transition-transform duration-300"
              />
              <Badge className="absolute top-4 left-4 bg-primary">
                Standard Studio
              </Badge>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-7 gap-2">
              {unitImages.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={cn(
                    "relative aspect-video rounded-lg overflow-hidden transition-all duration-200",
                    selectedImage === index
                      ? "ring-2 ring-primary scale-105"
                      : "opacity-70 hover:opacity-100 hover:scale-105"
                  )}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
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
                    <h3 className="text-xl font-semibold mb-4">Book This Unit</h3>
                  </div>

                  <div className="space-y-4">
                    {/* Check-in Date */}
                    <div className="space-y-2">
                      <Label>Check-in Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !checkInDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkInDate ? format(checkInDate, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkInDate}
                            onSelect={setCheckInDate}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Check-out Date */}
                    <div className="space-y-2">
                      <Label>Check-out Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !checkOutDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {checkOutDate ? format(checkOutDate, "PPP") : <span>Select date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={checkOutDate}
                            onSelect={setCheckOutDate}
                            disabled={(date) => date < (checkInDate || new Date())}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <div className="text-3xl font-bold text-primary mb-2">
                      IDR 350K
                      <span className="text-base font-normal text-muted-foreground">/night</span>
                    </div>
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
                    value={`Meisterstadt Pollux Habibie Unit ${id}`}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check-in Date</Label>
                  <Input
                    value={checkInDate ? format(checkInDate, "dd MMMM yyyy") : "Not selected"}
                    disabled
                    className="bg-muted"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Check-out Date</Label>
                  <Input
                    value={checkOutDate ? format(checkOutDate, "dd MMMM yyyy") : "Not selected"}
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
