import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./ThemeSwitcher";

const navigation = [
  
  
  { name: "About", href: "/pricing" },
  { name: "Features", href: "/#features" },
  { name: "Testimonials", href: "/#features" },
  { name: "FQA", href: "/#resources" },
  { name: "ASEAN Labour Resources", href: "/#resources" },
  { name: "Team", href: "/#resources"},
  { name: "Contact", href: "/#contact" },
  
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    
    // If it's a hash link to the same page or home page
    if (href.startsWith("/#")) {
      const elementId = href.substring(2);
      if (location.pathname === "/") {
        // Same page, scroll to element
        const element = document.getElementById(elementId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
      // If on different page, Link will navigate and the hash will scroll
    }
  };

  const isActiveLink = (href: string) => {
    if (href === "/pricing") {
      return location.pathname === "/pricing";
    }
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-[hsl(42_35%_96%/0.95)] backdrop-blur-md shadow-soft border-b border-[hsl(var(--navbar-border))]" 
          : "bg-[hsl(42_35%_96%/0.7)] backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/"
              className="flex items-center gap-2 sm:gap-2.5"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary flex items-center justify-center shadow-sm">
                <span className="text-primary-foreground font-bold text-base sm:text-lg font-display">L</span>
              </div>
              <span className="text-base sm:text-lg font-display font-bold text-foreground tracking-tight">
                LuminaHR
              </span>
            </Link>
          </motion.div>

          {/* Desktop navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigation.map((item, i) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              >
                {item.href.startsWith("/") && !item.href.startsWith("/#") ? (
                  <Link
                    to={item.href}
                    className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                      isActiveLink(item.href)
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {item.name}
                    {isActiveLink(item.href) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary rounded-full"
                      />
                    )}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    onClick={() => handleNavClick(item.href)}
                    className="relative px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-300"
                  >
                    {item.name}
                  </a>
                )}
              </motion.div>
            ))}
          </nav>

          {/* Desktop CTA + Theme Switcher */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="hidden lg:flex items-center gap-3"
          >
            <ThemeSwitcher />
            <a
              href="#"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-300"
            >
              Sign in
            </a>
            <Link to="/pricing">
              <Button 
                variant="default" 
                size="default" 
                className="group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
          </motion.div>

          {/* Mobile: Theme Switcher + Menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeSwitcher />
            <button
              className="p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-border/50 bg-[hsl(var(--navbar-bg))/0.98] backdrop-blur-md overflow-hidden"
          >
            <div className="container mx-auto px-4 sm:px-6 py-5">
              <nav className="flex flex-col gap-1">
                {navigation.map((item) => (
                  item.href.startsWith("/") && !item.href.startsWith("/#") ? (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`px-4 py-3 rounded-lg text-base font-medium transition-all ${
                        isActiveLink(item.href)
                          ? "text-primary bg-primary/5"
                          : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ) : (
                    <a
                      key={item.name}
                      href={item.href}
                      className="px-4 py-3 rounded-lg text-base font-medium text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all"
                      onClick={() => handleNavClick(item.href)}
                    >
                      {item.name}
                    </a>
                  )
                ))}
              </nav>
              <div className="mt-5 pt-5 border-t border-border/50 space-y-3">
                <a
                  href="#"
                  className="block px-4 py-2.5 text-center text-foreground/70 hover:text-foreground transition-colors"
                >
                  Sign In
                </a>
                <Link to="/pricing" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="w-full"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
