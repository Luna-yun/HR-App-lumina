import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Check } from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview.jpg";
import peacefulLandscape from "@/assets/peaceful-landscape.webp";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Background parallax - moves slower than scroll for depth effect
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.12]);
  
  // Dashboard stays visible much longer - graceful exit
  const dashboardOpacity = useTransform(scrollYProgress, [0, 0.6, 0.85], [1, 1, 0]);
  const dashboardY = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 30 : 60]);
  const dashboardScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.96]);

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-[140vh] overflow-hidden"
    >
      {/* Background */}
      <motion.div 
        className="absolute inset-0 w-full h-[120%] -top-[5%]"
        style={{ 
          y: backgroundY,
          scale: backgroundScale 
        }}
      >
        <img
          src={peacefulLandscape}
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/0 via-background/0 to-background/0" />
      </motion.div>
    
      {/* Content */}
      <div className="relative z-10">
        {/* Top Content Area */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-32 lg:pt-40">
          <div className="max-w-4xl mx-auto text-center">
            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="badge-primary">
                Policies are followed by ASEAN Laour Laws
              </span>
            </motion.div>

            {/* Headline - Confident & Mature */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="headline-hero mt-6 sm:mt-8 mb-4 sm:mb-6"
            >
              The Modern Way to
              <br />
              <span className="gradient-text">Manage People & Organizations</span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="body-xl max-w-2xl mx-auto mb-8 sm:mb-10 px-4"
            >
              Streamline your entire HR workflow—from onboarding to performance—with 
              an intuitive platform your team will actually love using.
            </motion.p>
            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4"
            >
              <Link to="/login">
                <Button variant="hero" size="xl" className="group w-full sm:w-auto min-w-[200px]">
                  Login
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="heroOutline" size="xl" className="group w-full sm:w-auto min-w-[180px]">
                  Sign up
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-3 text-sm text-muted-foreground"
            >
              {["Employers", "Organizations", "HR Admin"].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span>{item}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Dashboard - Responsive width */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 sm:mt-16 lg:mt-24 px-4 sm:px-6 lg:px-8"
          style={{ 
            opacity: dashboardOpacity,
            y: dashboardY,
            scale: dashboardScale
          }}
        >
          <div className="flex justify-center">
            {/* Responsive width: 95% on mobile, 85% on tablet, 70% on desktop */}
            <div className="relative w-[95%] sm:w-[85%] lg:w-[70%] max-w-6xl">
              <div className="rounded-lg sm:rounded-xl overflow-hidden bg-black/40 backdrop-blur-md shadow-lg border-t-2 sm:border-t-4 border-l-2 sm:border-l-4 border-r-2 sm:border-r-4 border-black">
                <img 
                  src={dashboardPreview} 
                  className="w-full h-auto block" 
                  alt="Dashboard Preview"
                />
              </div>
            </div>
          </div>
        </motion.div>
    
        <div className="h-[5vh] sm:h-[5vh] lg:h-[5vh]" />
      </div>
    </section>
  );
}