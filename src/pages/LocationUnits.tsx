import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useLocationStore, useUnitStore } from "@/stores";
import { Location, Unit } from "@/types";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, ArrowUp, ArrowDown } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ImageCarousel from "@/components/ui/ImageCarousel";

const LocationUnits = () => {
  const { locationId: locationSlug } = useParams();
  const [searchParams] = useSearchParams();
  const { fetchLocationBySlug, fetchLocationById } = useLocationStore();
  const {
    fetchUnitsByLocationIdPaginated,
    currentPage,
    totalPages,
    totalUnits,
    unitsPerPage,
    searchQuery,
    sortBy,
    sortOrder,
    setSearchQuery,
    setCurrentPage,
    setSorting
  } = useUnitStore();
  const [location, setLocation] = useState<Location | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  
  const locationFetched = useRef(false);
  const unitsFetched = useRef(false);
  
  useEffect(() => {
    if (unitsPerPage !== 9) {
      setSorting('price_per_night', sortOrder || 'asc');
    }
  }, [unitsPerPage, sortOrder, setSorting]);

  useEffect(() => {
    const fromParam = searchParams.get('from');
    const toParam = searchParams.get('to');
    
    if (fromParam) {
      const [year, month, day] = fromParam.split('-').map(Number);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        setDateRange(prev => ({
          ...prev,
          from: new Date(year, month - 1, day)
        }));
      }
    }
    
    if (toParam) {
      const [year, month, day] = toParam.split('-').map(Number);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        setDateRange(prev => ({
          ...prev,
          to: new Date(year, month - 1, day)
        }));
      }
    }
  }, [searchParams]);

  const fetchLocationAndUnits = useCallback(async () => {
    if (locationFetched.current) return;
    
    locationFetched.current = true;
    setLoading(true);
    try {
      let locationData = await fetchLocationBySlug(locationSlug);
      
      if (!locationData) {
        locationData = await fetchLocationById(locationSlug);
      }

      if (!locationData) {
        setLoading(false);
        return;
      }
      setLocation(locationData);
    } catch (error) {
      console.error("Error fetching location:", error);
      setLoading(false);
    }
  }, [fetchLocationBySlug, fetchLocationById, locationSlug]);

  useEffect(() => {
    if (locationSlug && !locationFetched.current) {
      fetchLocationAndUnits();
    }
  }, [locationSlug, fetchLocationAndUnits]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        setSearchQuery(searchInput);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, setSearchQuery]);

  useEffect(() => {
    if (location && !unitsFetched.current) {
      unitsFetched.current = true;
      setLoading(true);
      fetchUnitsByLocationIdPaginated(location.id, {
        page: currentPage,
        limit: 9,
        search: searchQuery,
        sortBy: 'price_per_night',
        sortOrder: sortOrder || 'asc'
      }).then((response) => {
        setUnits(response.units);
        setLoading(false);
      }).catch((error) => {
        console.error("Error fetching units:", error);
        setLoading(false);
      });
    } else if (location && unitsFetched.current && (currentPage > 1 || searchQuery || sortBy || sortOrder)) {
      setLoading(true);
      fetchUnitsByLocationIdPaginated(location.id, {
        page: currentPage,
        limit: 9,
        search: searchQuery,
        sortBy: 'price_per_night',
        sortOrder: sortOrder || 'asc'
      }).then((response) => {
        setUnits(response.units);
        setLoading(false);
      }).catch((error) => {
        console.error("Error fetching units:", error);
        setLoading(false);
      });
    }
  }, [currentPage, searchQuery, sortBy, sortOrder, fetchUnitsByLocationIdPaginated, location]);

  const _handleSort = () => {
    setSorting('price_per_night', sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const _getSortIcon = () => {
    return sortOrder === 'asc'
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

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
              <h1 className="text-4xl font-bold text-primary mb-2">{location.name}</h1>
              <p className="text-muted-foreground flex items-center gap-2 mb-4">
                <MapPin className="h-5 w-5" />
                {location.name}
              </p>
              <p className="text-muted-foreground max-w-3xl">{location.description}</p>
              
              {dateRange.from && (
                <div className="mt-4 p-3 bg-background rounded-lg border">
                  <p className="text-sm text-muted-foreground mb-1">Selected Dates:</p>
                  <p className="font-medium">
                    {format(dateRange.from, "dd MMM yyyy")}
                    {dateRange.to && ` - ${format(dateRange.to, "dd MMM yyyy")}`}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-3xl font-bold">Available Units ({totalUnits})</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search units..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-8 w-full sm:w-64"
                />
              </div>
              <Select
                value={sortOrder || 'asc'}
                onValueChange={(value: 'asc' | 'desc') => setSorting('price_per_night', value)}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by price" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Price: Low to High</SelectItem>
                  <SelectItem value="desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-4 text-sm text-muted-foreground">
            Showing {units.length} of {totalUnits} units
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {units.map((unit) => (
              <Card key={unit.id} className="overflow-hidden hover:shadow-2xl transition-all duration-500 group flex flex-col h-full border-0 shadow-lg">
                <div className="relative h-72 overflow-hidden">
                  <div className="relative w-full h-full">
                    <ImageCarousel
                      images={unit.images || [unit.image_url].filter(Boolean)}
                      alt={unit.name || unit.unit_name || `${unit.type} Unit`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="absolute top-4 left-4 flex gap-2 z-10">
                    <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm border-0">
                      {unit.type}
                    </Badge>
                    {unit.floor && (
                      <Badge className="bg-white/90 text-foreground backdrop-blur-sm border-0">
                        🏢 Floor {unit.floor}
                      </Badge>
                    )}
                  </div>
                  
                  {unit.view && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-white/90 text-foreground backdrop-blur-sm border-0">
                        🌅 {unit.view}
                      </Badge>
                    </div>
                  )}
                  
                  {unit.price_per_night && (
                    <div className="absolute bottom-4 left-4 z-10">
                      <div className="bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
                        <p className="text-lg font-bold text-primary">
                          ${unit.price_per_night.toLocaleString()}
                          <span className="text-xs font-normal text-muted-foreground">/night</span>
                        </p>
                        {unit.price_per_month && (
                          <p className="text-xs text-muted-foreground">
                            ${unit.price_per_month.toLocaleString()}/month
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="absolute bottom-4 right-4 z-10">
                    {unit.available ? (
                      <Badge className="bg-green-100 text-green-800 border-0">
                        ✓ Available
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 border-0">
                        ✗ Rented
                      </Badge>
                    )}
                  </div>
                </div>

                <CardHeader className="flex-1 pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                      {unit.name || unit.unit_name || `${unit.type} Unit`}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{unit.building || 'Building A'}</span>
                    {unit.tower && <span>• {unit.tower}</span>}
                  </div>
                </CardHeader>

                <CardContent className="flex-1 pb-3">
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {unit.features?.slice(0, 4).map((feature, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs rounded-full px-2 py-1 bg-muted/50">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  {unit.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {unit.description}
                    </p>
                  )}
                </CardContent>

                <CardFooter className="pt-0">
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-md hover:shadow-lg transition-all duration-300">
                    <Link to={`/location/${location.slug || location.id}/${unit.slug || unit.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => page !== currentPage && setCurrentPage(page)}
                            isActive={page === currentPage}
                            className={page === currentPage ? "pointer-events-none" : "cursor-pointer"}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    
                    if (
                      (page === 2 && currentPage > 3) ||
                      (page === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LocationUnits;
