import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

type Language = "EN" | "ID";

interface NavItem {
  label: string;
  href: string;
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<Language>("EN");

  const navItems: NavItem[] = [
    { label: "Home", href: "/" },
    { label: "Locations", href: "/locations" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const toggleLanguage = (): void => {
    setCurrentLanguage(prev => prev === "EN" ? "ID" : "EN");
  };

  const toggleMobileMenu = (): void => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const renderNavLinks = (isMobile = false): JSX.Element[] => {
    return navItems.map((item) => (
      <Link
        key={item.href}
        to={item.href}
        className={`${
          isMobile ? "block" : ""
        } text-foreground hover:text-primary transition-colors`}
      >
        {item.label}
      </Link>
    ));
  };

  const renderLanguageToggle = (): JSX.Element => (
    <button
      onClick={toggleLanguage}
      className="px-3 py-1 rounded-md border hover:bg-muted transition-colors"
      aria-label={`Switch to ${currentLanguage === "EN" ? "Indonesian" : "English"}`}
    >
      {currentLanguage}
    </button>
  );

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
            {renderNavLinks()}
          </div>

          {/* Language & Book Now */}
          <div className="hidden md:flex items-center space-x-4">
            {renderLanguageToggle()}
            <Button
              variant="default"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
              asChild
            >
              <a href="https://wa.me/628116918078" target="_blank" rel="noopener noreferrer">
                Book Now
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            {renderNavLinks(true)}
            <div className="flex items-center space-x-2 pt-2">
              {renderLanguageToggle()}
              <Button
                variant="default"
                className="bg-accent hover:bg-accent/90 text-accent-foreground flex-1"
                asChild
              >
                <a href="https://wa.me/628116918078" target="_blank" rel="noopener noreferrer">
                  Book Now
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
