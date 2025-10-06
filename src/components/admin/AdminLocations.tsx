import { useState, useEffect } from "react";
import { useLocationStore } from "@/stores";
import { Location, CreateLocationInput, UpdateLocationInput } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
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

export const AdminLocations = () => {
  const { locations, isLoading, fetchLocations, createLocation, updateLocation, deleteLocation } = useLocationStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image_url: "",
    slug: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (locations.length === 0) {
      fetchLocations();
    }
  }, [fetchLocations, locations.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingLocation) {
        const updateData: UpdateLocationInput = {
          name: formData.name,
          description: formData.description || undefined,
          image_url: formData.image_url || undefined,
          slug: formData.slug || undefined,
        };
        
        const result = await updateLocation(editingLocation.id, updateData);
        
        if (result) {
          toast({
            title: "Location updated",
            description: "The location has been successfully updated.",
          });
        } else {
          throw new Error("Failed to update location");
        }
      } else {
        const createData: CreateLocationInput = {
          name: formData.name,
          description: formData.description || undefined,
          image_url: formData.image_url || undefined,
          slug: formData.slug || undefined,
        };
        
        const result = await createLocation(createData);
        
        if (result) {
          toast({
            title: "Location created",
            description: "The location has been successfully created.",
          });
        } else {
          throw new Error("Failed to create location");
        }
      }

      setDialogOpen(false);
      setFormData({ name: "", description: "", image_url: "", slug: "" });
      setEditingLocation(null);
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      description: location.description || "",
      image_url: location.image_url || "",
      slug: location.slug || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteLocation(id);
      
      if (result) {
        toast({
          title: "Location deleted",
          description: "The location has been successfully deleted.",
        });
      } else {
        throw new Error("Failed to delete location");
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
    setFormData({ name: "", description: "", image_url: "", slug: "" });
    setEditingLocation(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Locations Management</h2>
        <Dialog open={dialogOpen} onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingLocation ? "Edit Location" : "Add New Location"}
              </DialogTitle>
              <DialogDescription>
                {editingLocation
                  ? "Make changes to the location details below. Click save when you're done."
                  : "Fill in the details for the new location below. Click create when you're done."
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug (URL-friendly name)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  placeholder="senayan-city"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingLocation ? "Update Location" : "Create Location"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Locations</CardTitle>
          <CardDescription>Manage your property locations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Units</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell className="font-medium">{location.name}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {location.description || "No description"}
                  </TableCell>
                  <TableCell>{location.units_count}</TableCell>
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
                          <AlertDialogTitle>Edit Location?</AlertDialogTitle>
                          <AlertDialogDescription>
                            You are about to edit the location "{location.name}". This will open the edit form where you can make changes to the location details.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleEdit(location)}>Edit</AlertDialogAction>
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
                            This action cannot be undone. This will permanently delete the location "{location.name}" and remove all its data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(location.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
              {locations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No locations found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
