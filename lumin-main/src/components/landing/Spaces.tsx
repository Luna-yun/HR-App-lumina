import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Star, Users2, ArrowRightLeft, MessageSquareMore, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import collaborationPreview from "@/assets/collaboration-preview.jpg";
import teamAccessPreview from "@/assets/team-access.jpg";
import stayOrganizedPreview from "@/assets/stay-organized.jpg";

const features = [
  {
    id: "stay-informed",
    icon: Star,
    iconClass: "feature-icon-indigo",
    title: "Stay Informed & Organized",
    description:
      "Get real-time insights into your personal, team, and organization information using Spaces — a dedicated self-service portal that empowers employees.",
    image: stayOrganizedPreview,
    stats: { value: "89%", label: "Employee Satisfaction" },
  },
  {
    id: "team-access",
    icon: Users2,
    iconClass: "feature-icon-purple",
    title: "Unified Team Collaboration",
    description:
      "Strengthen team bonds with the all-new team space that displays comprehensive team information and enables department messaging.",
    image: teamAccessPreview,
    stats: { value: "3x", label: "Faster Communication" },
  },
  {
    id: "administer",
    icon: ArrowRightLeft,
    iconClass: "feature-icon-teal",
    title: "Seamless Administration",
    description:
      "Adopt a structured approach to managing transitions. Seamlessly facilitate department, designation, and location changes.",
    image: collaborationPreview,
    stats: { value: "60%", label: "Time Saved" },
  },
  {
    id: "collaboration",
    icon: MessageSquareMore,
    iconClass: "feature-icon-rose",
    title: "Foster Collaboration Culture",
    description:
      "Strengthen team bonds — whether your team works remotely or in-office. Bring all your employees together for discussions and feedback.",
    image: collaborationPreview,
    stats: { value: "45%", label: "More Engagement" },
  },
];

const AUTO_ROTATE_INTERVAL = 5000; // 5 seconds

export function Spaces() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const activeItem = features[activeIndex];

  // Auto-rotate functionality
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % features.length);
    }, AUTO_ROTATE_INTERVAL);

    return () => clearInterval(interval);
  }, [isPaused]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  const goToNext = () => {
    setActiveIndex((prev) => (prev + 1) % features.length);
  };

  const goToPrev = () => {
    setActiveIndex((prev) => (prev - 1 + features.length) % features.length);
  };

  return (
    <section 
      ref={sectionRef} 
      className="section-padding relative overflow-hidden bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle ambient glow */}
      <div className="absolute bottom-0 left-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section header */}
        <div className="max-w-2xl mb-12 sm:mb-16 lg:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="badge-accent"
          >
            Spaces
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="headline-xl mt-4 sm:mt-6"
          >
            Powerful Collaboration
            <br />
            <span className="gradient-text">Unified Portal</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="body-lg mt-4 sm:mt-6 max-w-lg"
          >
            Empower your teams with dedicated spaces for communication, collaboration, and self-service.
          </motion.p>
        </div>

        {/* Two-column layout: Image left, Features right */}
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-start">
          {/* Left: Visual preview with parallax */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative lg:sticky lg:top-32"
            style={{ y: imageY }}
          >
            <div className="card-float p-2 sm:p-3">
              <div className="rounded-xl overflow-hidden relative aspect-[4/3]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeItem.id}
                    src={activeItem.image}
                    alt={activeItem.title}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Navigation arrows */}
            <div className="flex items-center justify-between mt-4 px-2">
              <button
                onClick={goToPrev}
                className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Progress indicators */}
              <div className="flex items-center gap-2">
                {features.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className="relative h-1.5 rounded-full overflow-hidden transition-all duration-300"
                    style={{ width: i === activeIndex ? 32 : 12 }}
                  >
                    <div className="absolute inset-0 bg-border" />
                    {i === activeIndex && (
                      <motion.div
                        className="absolute inset-0 bg-primary"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: AUTO_ROTATE_INTERVAL / 1000, ease: "linear" }}
                        style={{ transformOrigin: "left" }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={goToNext}
                className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Floating stat card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-4 lg:-bottom-8 lg:-right-6"
              >
                <div className="card-elevated p-4 sm:p-5 rounded-xl">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <activeItem.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-display font-bold text-foreground">
                        {activeItem.stats.value}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">{activeItem.stats.label}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Decorative blur */}
            <div className="absolute -z-10 -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          </motion.div>

          {/* Right: Feature list */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-2 sm:space-y-3"
          >
            {features.map((feature, index) => {
              const isActive = index === activeIndex;
              const Icon = feature.icon;

              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveIndex(index)}
                  className="w-full text-left transition-all duration-300 group"
                >
                  <div
                    className={`p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-300 relative ${
                      isActive
                        ? "bg-card shadow-elevated border border-primary/20"
                        : "bg-transparent hover:bg-card/50 border border-transparent"
                    }`}
                  >
                    {/* Active indicator */}
                    <motion.div
                      initial={false}
                      animate={{ scaleY: isActive ? 1 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 top-3 sm:top-4 bottom-3 sm:bottom-4 w-1 bg-primary rounded-full origin-top"
                    />

                    <div className="flex items-start gap-4 sm:gap-5 pl-3 sm:pl-4">
                      <div className={`feature-icon shrink-0 ${feature.iconClass}`}>
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-base sm:text-lg font-display font-semibold transition-colors ${
                              isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                            }`}
                          >
                            {feature.title}
                          </h4>
                          <ArrowRight
                            className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 shrink-0 ${
                              isActive
                                ? "text-primary opacity-100"
                                : "opacity-0 group-hover:opacity-50"
                            }`}
                          />
                        </div>
                        <AnimatePresence>
                          {isActive && (
                            <motion.p
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="mt-2 sm:mt-3 text-muted-foreground leading-relaxed text-sm sm:text-base"
                            >
                              {feature.description}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
