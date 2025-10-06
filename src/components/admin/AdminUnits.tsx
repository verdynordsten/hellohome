import { useState, useEffect } from "react";
import { useUnitStore, useLocationStore } from "@/stores";
import { Unit, CreateUnitInput, UpdateUnitInput } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit, Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export const AdminUnits = () => {
  const {
    units,
    isLoading,
    fetchUnits,
    createUnit,
    updateUnit,
    deleteUnit,
    currentPage,
    totalPages,
    totalUnits,
    unitsPerPage,
    searchQuery,
    sortBy,
    sortOrder,
    setSearchQuery,
    setCurrentPage,
    setUnitsPerPage,
    setSorting
  } = useUnitStore();
  const { locations, fetchLocations } = useLocationStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [formData, setFormData] = useState({
    location_id: "",
    name: "",
    slug: "",
    type: "",
    unit_name: "",
    floor: "",
    building: "",
    tower: "",
    view: "",
    description: "",
    features: "",
    images: "",
    image_url: "",
    price_per_month: "",
    price_per_night: "",
    available: true,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUnits({ page: currentPage, limit: unitsPerPage, search: searchQuery, sortBy, sortOrder });
    if (locations.length === 0) {
      fetchLocations();
    }
  }, [fetchUnits, fetchLocations, locations.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== searchQuery) {
        setSearchQuery(searchInput);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, searchQuery, setSearchQuery]);

  useEffect(() => {
    fetchUnits({ page: currentPage, limit: unitsPerPage, search: searchQuery, sortBy, sortOrder });
  }, [currentPage, unitsPerPage, searchQuery, sortBy, sortOrder, fetchUnits]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const featuresArray = formData.features
        ? formData.features.split(",").map((f) => f.trim())
        : [];
      
      const imagesArray = formData.images
        ? formData.images.split(",").map((img) => img.trim())
        : [];

      if (editingUnit) {
        const updateData: UpdateUnitInput = {
          location_id: formData.location_id,
          name: formData.name || undefined,
          slug: formData.slug || undefined,
          type: formData.type,
          unit_name: formData.unit_name || undefined,
          floor: formData.floor || undefined,
          building: formData.building || undefined,
          tower: formData.tower || undefined,
          view: formData.view || undefined,
          description: formData.description || undefined,
          features: featuresArray,
          images: imagesArray,
          image_url: formData.image_url || undefined,
          price_per_month: formData.price_per_month
            ? parseFloat(formData.price_per_month)
            : undefined,
          price_per_night: formData.price_per_night
            ? parseFloat(formData.price_per_night)
            : undefined,
          available: formData.available,
        };
        
        console.log('AdminUnits: Attempting to update unit with ID:', editingUnit.id, 'and data:', updateData);
        const result = await updateUnit(editingUnit.id, updateData);
        console.log('AdminUnits: Update result:', result);
        
        if (result) {
          toast({
            title: "Unit updated",
            description: "The unit has been successfully updated.",
          });
        } else {
          throw new Error("Failed to update unit");
        }
      } else {
        const createData: CreateUnitInput = {
          location_id: formData.location_id,
          name: formData.name || undefined,
          slug: formData.slug || undefined,
          type: formData.type,
          unit_name: formData.unit_name || undefined,
          floor: formData.floor || undefined,
          building: formData.building || undefined,
          tower: formData.tower || undefined,
          view: formData.view || undefined,
          description: formData.description || undefined,
          features: featuresArray,
          images: imagesArray,
          image_url: formData.image_url || undefined,
          price_per_month: formData.price_per_month
            ? parseFloat(formData.price_per_month)
            : undefined,
          price_per_night: formData.price_per_night
            ? parseFloat(formData.price_per_night)
            : undefined,
          available: formData.available,
        };
        
        const result = await createUnit(createData);
        
        if (result) {
          toast({
            title: "Unit created",
            description: "The unit has been successfully created.",
          });
        } else {
          throw new Error("Failed to create unit");
        }
      }

      setDialogOpen(false);
      setFormData({
        location_id: "",
        name: "",
        slug: "",
        type: "",
        unit_name: "",
        floor: "",
        building: "",
        tower: "",
        view: "",
        description: "",
        features: "",
        images: "",
        image_url: "",
        price_per_month: "",
        price_per_night: "",
        available: true,
      });
      setEditingUnit(null);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setFormData({
      location_id: unit.location_id,
      name: unit.name || "",
      slug: unit.slug || "",
      type: unit.type,
      unit_name: unit.unit_name || "",
      floor: unit.floor || "",
      building: unit.building || "",
      tower: unit.tower || "",
      view: unit.view || "",
      description: unit.description || "",
      features: unit.features?.join(", ") || "",
      images: unit.images?.join(", ") || "",
      image_url: unit.image_url || "",
      price_per_month: unit.price_per_month?.toString() || "",
      price_per_night: unit.price_per_night?.toString() || "",
      available: unit.available,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteUnit(id);
      
      if (result) {
        toast({
          title: "Unit deleted",
          description: "The unit has been successfully deleted.",
        });
      } else {
        throw new Error("Failed to delete unit");
      }
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      location_id: "",
      name: "",
      slug: "",
      type: "",
      unit_name: "",
      floor: "",
      building: "",
      tower: "",
      view: "",
      description: "",
      features: "",
      images: "",
      image_url: "",
      price_per_month: "",
      price_per_night: "",
      available: true,
    });
    setEditingUnit(null);
  };

  const getLocationName = (locationId: string) => {
    const location = locations.find((loc) => loc.id === locationId);
    return location?.name || "Unknown";
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      // Toggle sort order if same column
      setSorting(column, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column with default asc order
      setSorting(column, 'asc');
    }
  };

  const getSortIcon = (column: string) => {
    if (sortBy !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    }
    return sortOrder === 'asc'
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Units Management</h2>
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Unit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingUnit ? "Edit Unit" : "Add New Unit"}
              </DialogTitle>
              <DialogDescription>
                {editingUnit
                  ? "Update the information for this unit. Click save when you're done."
                  : "Fill in the details to add a new unit to your properties."
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location_id">Location</Label>
                  <Select
                    value={formData.location_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, location_id: value })
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name (Display)</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Premium Studio Apartment"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (URL-friendly)</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })
                    }
                    placeholder="premium-studio-apartment"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Unit Type</Label>
                  <Input
                    id="type"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    placeholder="e.g. 2BR Apartment"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit_name">Unit Name (Building)</Label>
                  <Input
                    id="unit_name"
                    value={formData.unit_name}
                    onChange={(e) =>
                      setFormData({ ...formData, unit_name: e.target.value })
                    }
                    placeholder="e.g. Unit 1205"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    value={formData.floor}
                    onChange={(e) =>
                      setFormData({ ...formData, floor: e.target.value })
                    }
                    placeholder="e.g. 5th"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="building">Building</Label>
                  <Input
                    id="building"
                    value={formData.building}
                    onChange={(e) =>
                      setFormData({ ...formData, building: e.target.value })
                    }
                    placeholder="e.g. Building A"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tower">Tower</Label>
                  <Input
                    id="tower"
                    value={formData.tower}
                    onChange={(e) =>
                      setFormData({ ...formData, tower: e.target.value })
                    }
                    placeholder="e.g. North Tower"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="view">View</Label>
                  <Input
                    id="view"
                    value={formData.view}
                    onChange={(e) =>
                      setFormData({ ...formData, view: e.target.value })
                    }
                    placeholder="e.g. City View, Ocean View"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_per_month">Price per Month</Label>
                  <Input
                    id="price_per_month"
                    type="number"
                    step="0.01"
                    value={formData.price_per_month}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price_per_month: e.target.value,
                      })
                    }
                    placeholder="1500.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price_per_night">Price per Night</Label>
                  <Input
                    id="price_per_night"
                    type="number"
                    step="0.01"
                    value={formData.price_per_night}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price_per_night: e.target.value,
                      })
                    }
                    placeholder="50.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of the unit"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="features">
                  Features (comma-separated)
                </Label>
                <Input
                  id="features"
                  value={formData.features}
                  onChange={(e) =>
                    setFormData({ ...formData, features: e.target.value })
                  }
                  placeholder="WiFi, AC, Parking"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="images">Images (comma-separated URLs)</Label>
                <Input
                  id="images"
                  value={formData.images}
                  onChange={(e) =>
                    setFormData({ ...formData, images: e.target.value })
                  }
                  placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Main Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  placeholder="https://example.com/unit.jpg"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={formData.available}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      available: checked as boolean,
                    })
                  }
                />
                <Label htmlFor="available">Available for rent</Label>
              </div>

              <Button type="submit" className="w-full">
                {editingUnit ? "Update Unit" : "Create Unit"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>All Units</CardTitle>
              <CardDescription>Manage your property units</CardDescription>
            </div>
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
                value={unitsPerPage.toString()}
                onValueChange={(value) => setUnitsPerPage(parseInt(value))}
              >
                <SelectTrigger className="w-full sm:w-32">
                  <SelectValue placeholder="Items per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4 text-sm text-muted-foreground">
            Showing {units.length} of {totalUnits} units
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('unitName')}
                >
                  <div className="flex items-center">
                    Name
                    {getSortIcon('unitName')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('type')}
                >
                  <div className="flex items-center">
                    Type
                    {getSortIcon('type')}
                  </div>
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('view')}
                >
                  <div className="flex items-center">
                    View
                    {getSortIcon('view')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('price_per_month')}
                >
                  <div className="flex items-center">
                    Price/Month
                    {getSortIcon('price_per_month')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('price_per_night')}
                >
                  <div className="flex items-center">
                    Price/Night
                    {getSortIcon('price_per_night')}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleSort('available')}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon('available')}
                  </div>
                </TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {units.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell className="font-medium">{unit.unit_name || "-"}</TableCell>
                  <TableCell>{unit.type}</TableCell>
                  <TableCell>{getLocationName(unit.location_id)}</TableCell>
                  <TableCell>{unit.view || "-"}</TableCell>
                  <TableCell>
                    {unit.price_per_month
                      ? `$${parseFloat(unit.price_per_month.toString()).toFixed(2)}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {unit.price_per_night
                      ? `$${parseFloat(unit.price_per_night.toString()).toFixed(2)}`
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        unit.available
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {unit.available ? "Available" : "Rented"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Edit Unit?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You are about to edit the unit "{unit.unit_name || unit.name}". This will open the edit form where you can make changes to the unit details.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleEdit(unit)}>Edit</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the unit "{unit.unit_name || unit.name}" and remove all its data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(unit.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
              {units.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center text-muted-foreground"
                  >
                    No units found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <div className="mt-4">
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
        </CardContent>
      </Card>
    </div>
  );
};
