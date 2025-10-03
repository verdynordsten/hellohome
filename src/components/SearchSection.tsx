import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const SearchSection = () => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();

  return (
    <section id="search" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-3">Find Your Ideal Apartment</h2>
          <p className="text-center text-muted-foreground mb-8">
            Choose location and dates to find available apartment units
          </p>

          <div className="bg-card p-6 rounded-xl shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <MapPin className="h-4 w-4" />
                  Location
                </label>
                <Select>
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    <SelectItem value="pollux">Pollux Habibie</SelectItem>
                    <SelectItem value="citra">Citra Plaza Nagoya</SelectItem>
                    <SelectItem value="nagoya">Nagoya Thamrin City</SelectItem>
                    <SelectItem value="house">House Rental Jakarta</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Check-in */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  Check-in
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background",
                        !checkIn && "text-muted-foreground"
                      )}
                    >
                      {checkIn ? format(checkIn, "dd MMM yyyy") : <span>04 Oct 2025</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
                    <Calendar 
                      mode="single" 
                      selected={checkIn} 
                      onSelect={setCheckIn}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      initialFocus 
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Check-out */}
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  Check-out
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background",
                        !checkOut && "text-muted-foreground"
                      )}
                    >
                      {checkOut ? format(checkOut, "dd MMM yyyy") : <span>05 Oct 2025</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
                    <Calendar 
                      mode="single" 
                      selected={checkOut} 
                      onSelect={setCheckOut}
                      disabled={(date) => {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < (checkIn || today);
                      }}
                      initialFocus 
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button className="w-full bg-primary hover:bg-primary/90 h-10">
                <Search className="h-4 w-4 mr-2" />
                Search Available Units
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
