import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("EN");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">
              HelloHome
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/locations" className="text-foreground hover:text-primary transition-colors">
              Locations
            </Link>
            <Link to="/about" className="text-foreground hover:text-primary transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="text-foreground hover:text-primary transition-colors">
              Contact
            </Link>
          </div>

          {/* Language & Book Now */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => setLanguage(language === "EN" ? "ID" : "EN")}
              className="px-3 py-1 rounded-md border hover:bg-muted transition-colors"
            >
              {language}
            </button>
            <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              Book Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link to="/" className="block text-foreground hover:text-primary">
              Home
            </Link>
            <Link to="/locations" className="block text-foreground hover:text-primary">
              Locations
            </Link>
            <Link to="/about" className="block text-foreground hover:text-primary">
              About Us
            </Link>
            <Link to="/contact" className="block text-foreground hover:text-primary">
              Contact
            </Link>
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setLanguage(language === "EN" ? "ID" : "EN")}
                className="px-3 py-1 rounded-md border hover:bg-muted transition-colors"
              >
                {language}
              </button>
              <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1">
                Book Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
