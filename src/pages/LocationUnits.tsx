import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useLocationStore, useUnitStore } from "@/stores";
import { Location, Unit } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const LocationUnits = () => {
  const { locationId: locationSlug } = useParams();
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
  
  // Set a fixed units per page value
  useEffect(() => {
    if (unitsPerPage !== 9) {
      // This will trigger a fetch with the correct limit
      setSorting(sortBy || 'price_per_night', sortOrder || 'asc');
    }
  }, [unitsPerPage, sortBy, sortOrder, setSorting]);

  const fetchLocationAndUnits = useCallback(async () => {
    setLoading(true);
    try {
      // Try to fetch by slug first, then by id
      let locationData = await fetchLocationBySlug(locationSlug);
      
      if (!locationData) {
        // If not found by slug, try by id
        locationData = await fetchLocationById(locationSlug);
      }

      if (!locationData) {
        setLoading(false);
        return;
      }
      setLocation(locationData);

      // Fetch units for this location with pagination and sorting
      const response = await fetchUnitsByLocationIdPaginated(locationData.id, {
        page: currentPage,
        limit: 9, // Fixed limit of 9 units per page
        search: searchQuery,
        sortBy: sortBy || 'price_per_night',
        sortOrder: sortOrder || 'asc'
      });
      
      // Set units from the response
      setUnits(response.units);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [fetchLocationBySlug, fetchLocationById, fetchUnitsByLocationIdPaginated, currentPage, unitsPerPage, searchQuery, sortBy, sortOrder, locationSlug]);

  useEffect(() => {
    if (locationSlug) {
      fetchLocationAndUnits();
    }
  }, [locationSlug, fetchLocationAndUnits]);

  // Handle search input with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        setSearchQuery(searchInput);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, setSearchQuery]);

  // Fetch units when pagination or sorting changes
  useEffect(() => {
    if (location) {
      fetchUnitsByLocationIdPaginated(location.id, {
        page: currentPage,
        limit: 9, // Fixed limit of 9 units per page
        search: searchQuery,
        sortBy: sortBy || 'price_per_night',
        sortOrder: sortOrder || 'asc'
      }).then((response) => {
        // Set units from the response
        setUnits(response.units);
      });
    }
  }, [currentPage, searchQuery, sortBy, sortOrder, fetchUnitsByLocationIdPaginated, location]);

  const _handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order if same column
      setSorting(column, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column with default asc order
      setSorting(column, 'asc');
    }
  };

  const _getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
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
                value={sortBy || 'price_per_night'}
                onValueChange={(value) => setSorting(value, sortOrder || 'asc')}
              >
                <SelectTrigger className="w-full sm:w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price_per_night">Price/Night</SelectItem>
                  <SelectItem value="price_per_month">Price/Month</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortOrder || 'asc'}
                onValueChange={(value: 'asc' | 'desc') => setSorting(sortBy || 'price_per_night', value)}
              >
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Low to High</SelectItem>
                  <SelectItem value="desc">High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-4 text-sm text-muted-foreground">
            Showing {units.length} of {totalUnits} units
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {units.map((unit) => (
              <Card key={unit.id} className="overflow-hidden hover:shadow-card-hover transition-all group">
                <div className="relative overflow-hidden h-48">
                  <img
                    src={unit.image_url || "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"}
                    alt={unit.unit_name || unit.type}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className="absolute top-4 left-4 bg-primary/90 text-primary-foreground">
                    {unit.type}
                  </Badge>
                  {!unit.available && (
                    <Badge className="absolute top-4 right-4 bg-destructive/90 text-destructive-foreground">
                      Rented
                    </Badge>
                  )}
                </div>

                <CardHeader>
                  <h3 className="text-xl font-bold">{unit.name || unit.unit_name || `${unit.type} Unit`}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Floor {unit.floor || "N/A"}</span>
                    <span>{unit.view || "City View"}</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {unit.features?.slice(0, 4).map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="rounded-full">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  {unit.price_per_night && (
                    <p className="text-lg font-bold text-primary">
                      $ {unit.price_per_night.toLocaleString()}<span className="text-sm font-normal text-muted-foreground">/night</span>
                    </p>
                  )}
                </CardContent>

                <CardFooter>
                  <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link to={`/unit/${unit.slug || unit.id}`}>View Details</Link>
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
                    // Show first page, last page, current page, and pages around current page
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={page === currentPage}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    
                    // Show ellipsis for gaps
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
