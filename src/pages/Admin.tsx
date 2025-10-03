import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AdminLocations } from "@/components/admin/AdminLocations";
import { AdminUnits } from "@/components/admin/AdminUnits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <div className="mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your locations and units</p>
          </div>
        </div>

        <Tabs defaultValue="locations" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="units">Units</TabsTrigger>
          </TabsList>
          
          <TabsContent value="locations" className="mt-6">
            <AdminLocations />
          </TabsContent>
          
          <TabsContent value="units" className="mt-6">
            <AdminUnits />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;
