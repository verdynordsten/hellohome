import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Home, Shield, Users } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">About HAI Home</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Your trusted partner for premium apartment rentals in Batam
            </p>
          </div>

          <div className="max-w-4xl mx-auto mb-16">
            <div className="relative h-96 rounded-xl overflow-hidden mb-8">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80"
                alt="About Us"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-foreground mb-6">
                HAI Home is dedicated to providing the best apartment rental experience in Batam. 
                We specialize in premium, fully-furnished apartments that combine comfort, style, 
                and strategic locations perfect for both short and long-term stays.
              </p>
              <p className="text-lg text-foreground">
                Our carefully selected properties offer modern amenities, stunning views, and 
                exceptional service to ensure your stay in Batam is memorable and comfortable.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <Home className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Premium Units</h3>
                <p className="text-sm text-muted-foreground">
                  Carefully selected apartments with top-quality furnishings
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Trusted Service</h3>
                <p className="text-sm text-muted-foreground">
                  Professional management and 24/7 customer support
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Best Locations</h3>
                <p className="text-sm text-muted-foreground">
                  Strategic locations near business and entertainment centers
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Happy Guests</h3>
                <p className="text-sm text-muted-foreground">
                  Thousands of satisfied customers and positive reviews
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
