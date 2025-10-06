import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AdminLocations } from "@/components/admin/AdminLocations";
import { AdminUnits } from "@/components/admin/AdminUnits";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const navigate = useNavigate();
  const { isAuthenticated, checkAuth, user, logout } = useAuthStore();

  useEffect(() => {
    checkAuth().then(() => {
      if (!isAuthenticated) {
        navigate("/auth");
      }
    });
  }, [checkAuth, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8 mt-16">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your locations and units</p>
            <p className="text-sm text-muted-foreground mt-1">Logged in as: {user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
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
