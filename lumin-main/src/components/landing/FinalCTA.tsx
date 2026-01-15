import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import peacefulLandscape from "@/assets/peaceful-landscape.webp";

export function FinalCTA() {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.05, 1.1]);

  return (
    <section 
      ref={sectionRef} 
      className="relative overflow-hidden py-20 sm:py-28 lg:py-36"
    >
      {/* Parallax background - Peaceful landscape */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ y: backgroundY, scale: backgroundScale }}
      >
        <img
          src={peacefulLandscape}
          alt=""
          className="w-full h-full object-cover object-center"
        />
        {/* Warm, optimistic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/40 to-foreground/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/40 via-transparent to-foreground/40" />
      </motion.div>

      {/* Subtle ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-white/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center px-4 sm:px-5 py-2 rounded-full text-sm font-medium bg-white/15 text-white border border-white/20 backdrop-blur-sm"
          >
            Ready to Transform Your HR?
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mt-6 sm:mt-8 text-white leading-[0.95]"
            style={{ letterSpacing: "-0.03em" }}
          >
            Join 10,000+ Companies
            <br />
            <span className="text-white/85">Using LuminaHR</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl mt-4 sm:mt-6 text-white/70 max-w-2xl mx-auto leading-relaxed"
          >
            Start your 14-day free trial today. No credit card required.
            Experience the future of HR management.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 lg:mt-12"
          >
            <Button 
              variant="heroDark" 
              size="xl" 
              className="group w-full sm:w-auto min-w-[200px] bg-white text-foreground hover:bg-white/95 shadow-xl"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button 
              variant="heroDarkOutline" 
              size="xl" 
              className="w-full sm:w-auto min-w-[160px] border-white/30 text-white hover:bg-white/10"
            >
              Request Demo
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-8 sm:mt-10 lg:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-white/55 text-sm"
          >
            {["No credit card required", "14-day free trial", "Cancel anytime"].map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <Check className="w-4 h-4" />
                {item}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
