import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

// Constants
const SECTION_TITLE = "Find Your Ideal Apartment";
const SECTION_DESCRIPTION = "Choose location and dates to find available apartment units";
const SEARCH_BUTTON_TEXT = "Search Available Units";
const LOCATION_PLACEHOLDER = "Select location";
const DATE_PLACEHOLDER = "Select dates";

const LOCATION_OPTIONS = [
  { value: "pollux", label: "Pollux Habibie" },
  { value: "citra", label: "Citra Plaza Nagoya" },
  { value: "nagoya", label: "Nagoya Thamrin City" },
  { value: "house", label: "House Rental Jakarta" },
] as const;

type LocationValue = typeof LOCATION_OPTIONS[number]["value"];

const SearchSection = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedLocation, setSelectedLocation] = useState<LocationValue | "">("");

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

  const handleSearch = (): void => {
    // TODO: Implement search functionality
    console.log('Searching with:', { location: selectedLocation, dateRange });
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
              {/* Location */}
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
                    {LOCATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Picker */}
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
