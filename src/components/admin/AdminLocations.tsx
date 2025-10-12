import { useState, useEffect, useRef } from "react";
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
import { FileUpload } from "@/components/ui/file-upload";
import { uploadFiles, UploadProgress } from "@/services/upload";
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
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    existingImages: [] as string[],
    imageFile: null as File | null,
    uploadedImageUrl: "",
    imagesToDelete: [] as string[],
  });
  const { toast } = useToast();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current && locations.length === 0 && !isLoading) {
      hasFetched.current = true;
      fetchLocations();
    }
  }, [fetchLocations, locations.length, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsUploading(true);
      setUploadStatus('uploading');
      setUploadProgress(0);

      if (editingLocation) {
        // Combine existing images with newly uploaded image
        const allImages = [...formData.existingImages];
        if (formData.uploadedImageUrl) {
          allImages.push(formData.uploadedImageUrl);
        }
        
        const updateData: UpdateLocationInput = {
          name: formData.name,
          description: formData.description || undefined,
          image_url: allImages.length > 0 ? allImages[0] : undefined,
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
        
        // Set progress to 100% and status to success
        setUploadProgress(100);
        setUploadStatus('success');
      } else {
        // Use the uploaded image URL if available
        const imageUrl = formData.uploadedImageUrl;
        const createData: CreateLocationInput = {
          name: formData.name,
          description: formData.description || undefined,
          image_url: imageUrl || undefined,
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
        
        // Set progress to 100% and status to success
        setUploadProgress(100);
        setUploadStatus('success');
      }

      // Reset upload state after a short delay to show success status
      setTimeout(() => {
        setIsUploading(false);
        setUploadStatus('idle');
        setUploadProgress(0);
      }, 1500);

      setDialogOpen(false);
      setFormData({
        name: "",
        slug: "",
        description: "",
        existingImages: [],
        imageFile: null,
        uploadedImageUrl: "",
        imagesToDelete: []
      });
      setEditingLocation(null);
    } catch (error: unknown) {
      // Set upload status to error
      setUploadStatus('error');
      setIsUploading(false);
      
      toast({
        title: "Error",
        description: (error as Error).message,
        variant: "destructive",
      });
      
      // Reset upload state after error
      setTimeout(() => {
        setUploadStatus('idle');
        setUploadProgress(0);
      }, 3000);
    }
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      slug: location.slug || "",
      description: location.description || "",
      existingImages: location.image_url ? [location.image_url] : [],
      imageFile: null,
      uploadedImageUrl: "",
      imagesToDelete: [],
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
    setFormData({
      name: "",
      slug: "",
      description: "",
      existingImages: [],
      imageFile: null,
      uploadedImageUrl: "",
      imagesToDelete: []
    });
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
                <Label htmlFor="slug">Slug (URL-friendly name)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  placeholder="senayan-city"
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
              
              {editingLocation && formData.existingImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Existing Image</Label>
                  <div className="relative group">
                    <img
                      src={formData.existingImages[0]}
                      alt="Existing location image"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newImagesToDelete = [...formData.imagesToDelete, formData.existingImages[0]];
                        const newExistingImages = formData.existingImages.filter(img => img !== formData.existingImages[0]);
                        setFormData({
                          ...formData,
                          imagesToDelete: newImagesToDelete,
                          existingImages: newExistingImages
                        });
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
              
              <FileUpload
                accept="image/*"
                multiple={false}
                maxFiles={1}
                onFilesSelected={(files) => setFormData({ ...formData, imageFile: files[0] || null })}
                onUpload={async (files) => {
                  const formDataToSend = new FormData();
                  formDataToSend.append('image', files[0]);
                  
                  try {
                    setUploadStatus('uploading');
                    const response = await uploadFiles('/locations/upload-image', formDataToSend, {
                      onProgress: (progress: UploadProgress) => {
                        setUploadProgress(progress.percentage);
                      }
                    });
                    
                    // Update form data with uploaded URL
                    const url = Array.isArray(response) ? response[0] : response;
                    setFormData(prev => ({
                      ...prev,
                      uploadedImageUrl: url
                    }));
                    
                    setTimeout(() => {
                      setUploadStatus('idle');
                      setUploadProgress(0);
                    }, 2000);
                    
                    return [url];
                  } catch (error) {
                    setUploadStatus('error');
                    setTimeout(() => {
                      setUploadStatus('idle');
                      setUploadProgress(0);
                    }, 3000);
                    throw new Error((error as Error).message);
                  }
                }}
                disabled={isUploading}
                showProgress={isUploading}
                progress={uploadProgress}
                uploadStatus={uploadStatus}
                label="Upload Image"
                description="Upload an image for the location"
                showUploadButton={true}
              />
              
              {formData.uploadedImageUrl && (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Uploaded Image:</div>
                  <div className="relative group">
                    <img
                      src={formData.uploadedImageUrl}
                      alt="Uploaded location image"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          uploadedImageUrl: ""
                        });
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isUploading}>
                {isUploading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent"></div>
                    {editingLocation ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {editingLocation ? "Update Location" : "Create Location"}
                  </>
                )}
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
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Units</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {locations.map((location) => (
                <TableRow key={location.id}>
                  <TableCell>
                    {location.image_url ? (
                      <img
                        src={location.image_url}
                        alt={location.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded flex items-center justify-center text-muted-foreground text-xs">
                        No image
                      </div>
                    )}
                  </TableCell>
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
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
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
