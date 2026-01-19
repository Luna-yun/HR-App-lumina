import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { animate } from "animejs";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./ThemeSwitcher";

const navigation = [
  { name: "About", href: "/pricing" },
  { name: "Features", href: "/#features" },
  { name: "Testimonials", href: "/#testimonials" },
  { name: "FAQ", href: "/#faq" },
  { name: "ASEAN Labour Resources", href: "/features/asean-labour-policies" },
  { name: "Team", href: "/features/team" },
  { name: "Contact", href: "/#contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Smooth scroll with offset
  const scrollToSection = useCallback((elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      const headerHeight = headerRef.current?.offsetHeight || 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerHeight - 20;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }, []);

  // Handle navigation click with proper routing
  const handleNavClick = useCallback((e: React.MouseEvent, href: string) => {
    setMobileMenuOpen(false);
    
    if (href.startsWith("/#")) {
      e.preventDefault();
      const elementId = href.substring(2);
      
      if (location.pathname === "/") {
        // Same page, scroll directly
        scrollToSection(elementId);
      } else {
        // Navigate to home first, then scroll
        navigate("/");
        setTimeout(() => scrollToSection(elementId), 100);
      }
    }
  }, [location.pathname, navigate, scrollToSection]);

  // Scroll detection with performance optimization
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section detection
  useEffect(() => {
    if (location.pathname !== "/") return;

    const sections = ["features", "testimonials", "faq", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  // Initial anime.js entrance animation
  useEffect(() => {
    if (logoRef.current) {
      animate(logoRef.current, {
        opacity: [0, 1],
        translateX: [-30, 0],
        duration: 800,
        easing: 'outExpo',
      });
    }

    if (navItemsRef.current) {
      const items = navItemsRef.current.querySelectorAll('.nav-item');
      animate(items, {
        opacity: [0, 1],
        translateY: [-15, 0],
        duration: 600,
        delay: (_, i) => 150 + i * 50,
        easing: 'outQuart',
      });
    }

    if (ctaRef.current) {
      animate(ctaRef.current, {
        opacity: [0, 1],
        translateX: [30, 0],
        duration: 800,
        delay: 400,
        easing: 'outExpo',
      });
    }
  }, []);

  // Nav item hover animation
  const handleNavHover = (element: HTMLElement, entering: boolean) => {
    const indicator = element.querySelector('.nav-indicator');
    const text = element.querySelector('.nav-text');
    
    if (entering) {
      animate(element, {
        scale: 1.02,
        duration: 200,
        easing: 'outQuad',
      });
      
      if (indicator) {
        animate(indicator, {
          scaleX: [0, 1],
          opacity: [0, 1],
          duration: 300,
          easing: 'outQuart',
        });
      }
      
      if (text) {
        animate(text, {
          color: 'hsl(220, 65%, 40%)',
          duration: 200,
          easing: 'linear',
        });
      }
    } else {
      animate(element, {
        scale: 1,
        duration: 200,
        easing: 'outQuad',
      });
      
      if (indicator) {
        animate(indicator, {
          scaleX: [1, 0],
          opacity: [1, 0],
          duration: 200,
          easing: 'inQuart',
        });
      }
    }
  };

  // Logo hover animation
  const handleLogoHover = (entering: boolean) => {
    if (!logoRef.current) return;
    const icon = logoRef.current.querySelector('.logo-icon');
    const text = logoRef.current.querySelector('.logo-text');

    if (entering) {
      if (icon) {
        animate(icon, {
          scale: [1, 1.1],
          rotate: ['0deg', '5deg'],
          duration: 400,
          easing: 'outBack',
        });
      }
      if (text) {
        animate(text, {
          letterSpacing: ['-0.02em', '0.02em'],
          duration: 300,
          easing: 'outQuad',
        });
      }
    } else {
      if (icon) {
        animate(icon, {
          scale: 1,
          rotate: '0deg',
          duration: 300,
          easing: 'outQuad',
        });
      }
      if (text) {
        animate(text, {
          letterSpacing: '-0.02em',
          duration: 300,
          easing: 'outQuad',
        });
      }
    }
  };

  // CTA button hover
  const handleCTAHover = (element: HTMLElement, entering: boolean) => {
    const arrow = element.querySelector('.cta-arrow');
    
    if (entering) {
      animate(element, {
        scale: 1.03,
        duration: 200,
        easing: 'outQuad',
      });
      if (arrow) {
        animate(arrow, {
          translateX: [0, 4],
          duration: 300,
          easing: 'outBack',
        });
      }
    } else {
      animate(element, {
        scale: 1,
        duration: 200,
        easing: 'outQuad',
      });
      if (arrow) {
        animate(arrow, {
          translateX: 0,
          duration: 200,
          easing: 'outQuad',
        });
      }
    }
  };

  const isActiveLink = (href: string) => {
    if (href === "/pricing") {
      return location.pathname === "/pricing";
    }
    if (href.startsWith("/#") && location.pathname === "/") {
      return activeSection === href.substring(2);
    }
    return location.pathname === href;
  };

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        isScrolled 
          ? "bg-[hsl(42_35%_96%/0.97)] backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_4px_20px_rgba(0,0,0,0.03)] border-b border-[hsl(var(--border)/0.5)]" 
          : "bg-[hsl(42_35%_96%/0.6)] backdrop-blur-sm"
      }`}
    >
      {/* Premium top accent line */}
      <div 
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent transition-opacity duration-500 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`} 
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-[72px]">
          {/* Logo */}
          <div
            ref={logoRef}
            onMouseEnter={() => handleLogoHover(true)}
            onMouseLeave={() => handleLogoHover(false)}
            className="opacity-0"
          >
            <Link
              to="/"
              className="flex items-center gap-2.5 group"
            >
              <div className="logo-icon w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-[0_2px_8px_hsl(var(--primary)/0.25)] transition-shadow duration-300 group-hover:shadow-[0_4px_16px_hsl(var(--primary)/0.35)]">
                <span className="text-primary-foreground font-bold text-lg font-display">L</span>
              </div>
              <span className="logo-text text-lg font-display font-bold text-foreground tracking-tight">
                LuminaHR
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav ref={navItemsRef} className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <div key={item.name} className="nav-item opacity-0">
                {item.href.startsWith("/") && !item.href.startsWith("/#") ? (
                  <Link
                    to={item.href}
                    className={`relative px-4 py-2.5 text-sm font-medium transition-colors duration-200 rounded-lg group ${
                      isActiveLink(item.href)
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                    onMouseEnter={(e) => handleNavHover(e.currentTarget, true)}
                    onMouseLeave={(e) => handleNavHover(e.currentTarget, false)}
                  >
                    <span className="nav-text relative z-10">{item.name}</span>
                    <span className="nav-indicator absolute bottom-1 left-3 right-3 h-0.5 bg-primary rounded-full opacity-0 scale-x-0 origin-left" />
                    {isActiveLink(item.href) && (
                      <motion.span
                        layoutId="activeNavDesktop"
                        className="absolute bottom-1 left-3 right-3 h-0.5 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </Link>
                ) : (
                  <a
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`relative px-4 py-2.5 text-sm font-medium transition-colors duration-200 rounded-lg group ${
                      isActiveLink(item.href)
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                    onMouseEnter={(e) => handleNavHover(e.currentTarget, true)}
                    onMouseLeave={(e) => handleNavHover(e.currentTarget, false)}
                  >
                    <span className="nav-text relative z-10">{item.name}</span>
                    <span className="nav-indicator absolute bottom-1 left-3 right-3 h-0.5 bg-primary rounded-full opacity-0 scale-x-0 origin-left" />
                    {isActiveLink(item.href) && (
                      <motion.span
                        layoutId="activeNavDesktop"
                        className="absolute bottom-1 left-3 right-3 h-0.5 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      />
                    )}
                  </a>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTA + Theme Switcher */}
          <div
            ref={ctaRef}
            className="hidden lg:flex items-center gap-4 opacity-0"
          >
            <ThemeSwitcher />
            <Link
              to="/login"
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200 px-4 py-2"
            >
              Sign in
            </Link>
            <Link to="/signup">
              <Button 
                variant="default" 
                size="default" 
                className="group relative overflow-hidden"
                onMouseEnter={(e) => handleCTAHover(e.currentTarget, true)}
                onMouseLeave={(e) => handleCTAHover(e.currentTarget, false)}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight className="cta-arrow w-4 h-4" />
                </span>
                {/* Shimmer effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Button>
            </Link>
          </div>

          {/* Mobile: Theme Switcher + Menu button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeSwitcher />
            <motion.button
              className="p-2.5 rounded-xl text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all duration-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.95 }}
            >
              <AnimatePresence mode="wait">
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
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
            transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
            className="lg:hidden border-t border-border/40 bg-[hsl(42_35%_96%/0.98)] backdrop-blur-xl overflow-hidden"
          >
            <div className="container mx-auto px-4 sm:px-6 py-6">
              <nav className="flex flex-col gap-1">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                  >
                    {item.href.startsWith("/") && !item.href.startsWith("/#") ? (
                      <Link
                        to={item.href}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                          isActiveLink(item.href)
                            ? "text-primary bg-primary/5"
                            : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                        {isActiveLink(item.href) && (
                          <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                        )}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-base font-medium transition-all ${
                          isActiveLink(item.href)
                            ? "text-primary bg-primary/5"
                            : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                        }`}
                        onClick={(e) => handleNavClick(e, item.href)}
                      >
                        {item.name}
                      </a>
                    )}
                  </motion.div>
                ))}
              </nav>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 pt-6 border-t border-border/40 space-y-3"
              >
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-center rounded-xl text-foreground/70 hover:text-foreground hover:bg-foreground/5 transition-all font-medium"
                >
                  Sign In
                </Link>
                <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button 
                    variant="default" 
                    size="lg" 
                    className="w-full group"
                  >
                    Get Started
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
