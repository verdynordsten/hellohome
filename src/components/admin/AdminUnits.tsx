import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

type Unit = {
  id: string;
  location_id: string;
  type: string;
  unit_name: string | null;
  floor: string | null;
  building: string | null;
  tower: string | null;
  view: string | null;
  description: string | null;
  features: string[] | null;
  images: string[] | null;
  image_url: string | null;
  price_per_month: number | null;
  price_per_night: number | null;
  available: boolean;
};

type Location = {
  id: string;
  name: string;
};

export const AdminUnits = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [formData, setFormData] = useState({
    location_id: "",
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
    fetchUnits();
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from("locations")
        .select("id, name")
        .order("name");

      if (error) throw error;
      setLocations(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchUnits = async () => {
    try {
      const { data, error } = await supabase
        .from("units")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUnits(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const featuresArray = formData.features
        ? formData.features.split(",").map((f) => f.trim())
        : [];
      
      const imagesArray = formData.images
        ? formData.images.split(",").map((img) => img.trim())
        : [];

      const unitData = {
        location_id: formData.location_id,
        type: formData.type,
        unit_name: formData.unit_name || null,
        floor: formData.floor || null,
        building: formData.building || null,
        tower: formData.tower || null,
        view: formData.view || null,
        description: formData.description || null,
        features: featuresArray,
        images: imagesArray,
        image_url: formData.image_url || null,
        price_per_month: formData.price_per_month
          ? parseFloat(formData.price_per_month)
          : null,
        price_per_night: formData.price_per_night
          ? parseFloat(formData.price_per_night)
          : null,
        available: formData.available,
      };

      if (editingUnit) {
        const { error } = await supabase
          .from("units")
          .update(unitData)
          .eq("id", editingUnit.id);

        if (error) throw error;

        toast({
          title: "Unit updated",
          description: "The unit has been successfully updated.",
        });
      } else {
        const { error } = await supabase.from("units").insert([unitData]);

        if (error) throw error;

        toast({
          title: "Unit created",
          description: "The unit has been successfully created.",
        });
      }

      setDialogOpen(false);
      setFormData({
        location_id: "",
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
      fetchUnits();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (unit: Unit) => {
    setEditingUnit(unit);
    setFormData({
      location_id: unit.location_id,
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
    if (!confirm("Are you sure you want to delete this unit?")) return;

    try {
      const { error } = await supabase.from("units").delete().eq("id", id);

      if (error) throw error;

      toast({
        title: "Unit deleted",
        description: "The unit has been successfully deleted.",
      });

      fetchUnits();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      location_id: "",
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

  if (loading) {
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
                  <Label htmlFor="unit_name">Unit Name</Label>
                  <Input
                    id="unit_name"
                    value={formData.unit_name}
                    onChange={(e) =>
                      setFormData({ ...formData, unit_name: e.target.value })
                    }
                    placeholder="e.g. Deluxe Suite"
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
          <CardTitle>All Units</CardTitle>
          <CardDescription>Manage your property units</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>View</TableHead>
                <TableHead>Price/Month</TableHead>
                <TableHead>Price/Night</TableHead>
                <TableHead>Status</TableHead>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(unit)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(unit.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
        </CardContent>
      </Card>
    </div>
  );
};
