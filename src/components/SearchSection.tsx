import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPin, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { useNavigate } from "react-router-dom";
import { useLocationStore } from "@/stores";

const SECTION_TITLE = "Find Your Ideal Apartment";
const SECTION_DESCRIPTION = "Choose location and dates to find available apartment units";
const SEARCH_BUTTON_TEXT = "Search Available Units";
const LOCATION_PLACEHOLDER = "Select location";
const DATE_PLACEHOLDER = "Select dates";

type LocationValue = string;

const SearchSection = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedLocation, setSelectedLocation] = useState<LocationValue | "">("");
  const navigate = useNavigate();
  const { locations, fetchLocations, isLoading } = useLocationStore();

  const formatDateRange = (range: DateRange | undefined): string => {
    if (!range?.from) return DATE_PLACEHOLDER;
    
    if (range.to) {
      return `${format(range.from, "dd MMM")} - ${format(range.to, "dd MMM yyyy")}`;
    }
    
    return format(range.from, "dd MMM yyyy");
  };

  const isDateDisabled = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Fetch locations on component mount
  useEffect(() => {
    if (locations.length === 0) {
      fetchLocations();
    }
  }, [fetchLocations, locations.length]);

  const handleSearch = (): void => {
    if (!selectedLocation) {
      return;
    }
    
    // Find the selected location to get the correct slug or ID
    const location = locations.find(loc => loc.slug === selectedLocation || loc.id === selectedLocation);
    
    if (!location) {
      return;
    }
    
    // Build URL with date range parameters if available
    let url = `/locations/${location.slug || location.id}`;
    const params = new URLSearchParams();
    
    if (dateRange?.from) {
      params.append('from', dateRange.from.toISOString());
    }
    
    if (dateRange?.to) {
      params.append('to', dateRange.to.toISOString());
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    // Navigate to the location units page with the selected location and date range
    navigate(url);
  };

  return (
    <section id="search" className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-primary mb-3">
            {SECTION_TITLE}
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            {SECTION_DESCRIPTION}
          </p>

          <div className="bg-card p-6 rounded-xl shadow-card">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <MapPin className="h-4 w-4" />
                  Location
                </label>
                <Select
                  value={selectedLocation}
                  onValueChange={(value) => setSelectedLocation(value as LocationValue)}
                >
                  <SelectTrigger className="bg-background">
                    <SelectValue placeholder={LOCATION_PLACEHOLDER} />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {isLoading ? (
                      <SelectItem value="loading" disabled>
                        Loading locations...
                      </SelectItem>
                    ) : locations.length > 0 ? (
                      locations.map((location) => (
                        <SelectItem key={location.id} value={location.slug || location.id}>
                          {location.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-locations" disabled>
                        No locations available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2 text-foreground">
                  <CalendarIcon className="h-4 w-4" />
                  Check-in & Check-out
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background",
                        !dateRange && "text-muted-foreground"
                      )}
                    >
                      {formatDateRange(dateRange)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background z-50" align="start">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      disabled={isDateDisabled}
                      initialFocus
                      numberOfMonths={2}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90 h-10"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4 mr-2" />
                {SEARCH_BUTTON_TEXT}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchSection;
