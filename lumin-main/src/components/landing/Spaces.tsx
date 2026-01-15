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
    title: "Stay Informed & Organized",
    description:
      "Get real-time insights into personal, team, and organization info via a dedicated self-service portal.",
    image: stayOrganizedPreview,
    stats: { value: "89%", label: "Employee Satisfaction" },
  },
  {
    id: "team-access",
    icon: Users2,
    title: "Unified Team Collaboration",
    description:
      "Strengthen team bonds with a team space that displays comprehensive info and enables messaging.",
    image: teamAccessPreview,
    stats: { value: "3x", label: "Faster Communication" },
  },
  {
    id: "administer",
    icon: ArrowRightLeft,
    title: "Seamless Administration",
    description:
      "Adopt a structured approach for managing department, designation, and location changes.",
    image: collaborationPreview,
    stats: { value: "60%", label: "Time Saved" },
  },
  {
    id: "collaboration",
    icon: MessageSquareMore,
    title: "Foster Collaboration Culture",
    description:
      "Bring all employees together for discussions and feedback, remote or in-office.",
    image: collaborationPreview,
    stats: { value: "45%", label: "More Engagement" },
  },
];

const AUTO_ROTATE_INTERVAL = 5000;

export function Spaces() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => setActiveIndex((prev) => (prev + 1) % features.length), AUTO_ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused]);

  const goNext = () => setActiveIndex((prev) => (prev + 1) % features.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + features.length) % features.length);

  const activeFeature = features[activeIndex];
  const ActiveIcon = activeFeature.icon; // Fix for JSX component usage

  return (
    <section
      ref={sectionRef}
      className="section-padding relative overflow-hidden bg-background"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <span className="badge-accent">Spaces</span>
          <h2 className="headline-xl mt-4">
            Powerful Collaboration <br />
            <span className="gradient-text">Unified Portal</span>
          </h2>
          <p className="body-lg mt-4 max-w-lg">
            Empower your teams with dedicated spaces for communication, collaboration, and self-service.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-20 items-start">
          {/* Left: Image + Stats */}
          <motion.div style={{ y: imageY }} className="relative lg:sticky lg:top-32">
            <div className="rounded-xl overflow-hidden aspect-[4/3]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeFeature.id}
                  src={activeFeature.image}
                  alt={activeFeature.title}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={goPrev}
                className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                {features.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-1.5 rounded-full ${i === activeIndex ? "bg-primary w-8" : "bg-border w-3"}`}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Stats */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute -bottom-6 right-0 bg-card p-4 rounded-xl shadow-md"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ActiveIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{activeFeature.stats.value}</div>
                    <div className="text-xs text-muted-foreground">{activeFeature.stats.label}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Right: Feature List */}
          <div className="space-y-4">
            {features.map((feature, idx) => {
              const isActive = idx === activeIndex;
              const Icon = feature.icon;
              return (
                <button
                  key={feature.id}
                  onClick={() => setActiveIndex(idx)}
                  className={`w-full text-left p-4 rounded-xl border transition ${
                    isActive ? "border-primary bg-card shadow" : "border-transparent hover:bg-card/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h4 className={`font-semibold ${isActive ? "text-primary" : "text-foreground"}`}>
                      {feature.title}
                    </h4>
                    <ArrowRight className={`w-4 h-4 transition ${isActive ? "text-primary" : "opacity-0 group-hover:opacity-50"}`} />
                  </div>
                  {isActive && <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
