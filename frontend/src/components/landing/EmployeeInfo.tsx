import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { UserPlus, Building2, Settings2, FolderTree, Check, ArrowRight } from "lucide-react";
import employeeManagement from "@/assets/customize.jpg";

const features = [
  {
    id: "add-employees",
    icon: UserPlus,
    iconClass: "feature-icon-indigo",
    title: "Add Employees Quickly",
    description: "Import, add, and invite users directly or sync through popular workspace integrations.",
    highlights: ["Can add new employees quickly with a simple, streamlined form"],
  },
  {
    id: "automate-ids",
    icon: UserPlus,
    iconClass: "feature-icon-indigo",
    title: "Add Organizations Quickly",
    description: "Import, add, and invite users directly or sync through popular workspace integrations.",
    highlights: ["Can add new organization quickly with a simple, streamlined form"],
  },{
    id: "organize-entities",
    icon: Building2,
    iconClass: "feature-icon-blue",
    title: "Organize Business Entities",
    description: "Manage multiple entities, divisions, and organizational structures effortlessly.",
    highlights: [""],
  },
  
  {
    id: "classify-workforce",
    icon: FolderTree,
    iconClass: "feature-icon-amber",
    title: "Classify Your Workforce",
    description: "Divide your workforce into departments and companies.",
    highlights: [""],
  },
];

export function EmployeeInfo() {
  const [activeFeature, setActiveFeature] = useState(features[0].id);
  const sectionRef = useRef<HTMLDivElement>(null);
  const activeItem = features.find((f) => f.id === activeFeature) || features[0];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98]);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden bg-background">
      {/* Subtle ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary/3 rounded-full blur-[180px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[300px] sm:w-[400px] h-[300px] sm:h-[400px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Two-column layout - Image LEFT, content RIGHT */}
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-12 lg:gap-20 items-start">
          {/* Left: Image preview with glass effect and parallax */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            className="relative lg:sticky lg:top-32 order-2 lg:order-1"
          >
            <motion.div
              style={{ y: imageY, scale: imageScale }}
              className="relative"
            >
              {/* Glass frame with premium padding */}
              <div className="bg-white/60 backdrop-blur-xl rounded-2xl sm:rounded-[2rem] p-3 sm:p-5 shadow-2xl border border-white/40">
                <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                  <img
                    src={employeeManagement}
                    alt="Employee Management Interface"
                    className="w-full object-cover"
                  />
                </div>
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute -z-10 -bottom-6 sm:-bottom-8 -left-6 sm:-left-8 w-32 sm:w-48 h-32 sm:h-48 bg-primary/8 rounded-full blur-3xl" />
              <div className="absolute -z-10 -top-6 sm:-top-8 -right-6 sm:-right-8 w-24 sm:w-32 h-24 sm:h-32 bg-accent/10 rounded-full blur-2xl" />
            </motion.div>
          </motion.div>{/* Right: Content */}
          <div className="order-1 lg:order-2">
            {/* Section header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10 sm:mb-12 lg:mb-16"
            >
              <span className="badge-primary">Information</span>
              
              <h2 className="headline-xl mt-6 sm:mt-8">
                Create & Customize
                <br />
                <span className="gradient-text">Profile Information</span>
              </h2>
              
              <p className="body-lg mt-6 sm:mt-8 max-w-lg">
                Build your organizational structure account from the ground up with intuitive tools designed for scale.
              </p>
            </motion.div>

            {/* Feature selector */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-3 sm:space-y-4"
            >
              {features.map((feature, index) => {
                const isActive = feature.id === activeFeature;
                const Icon = feature.icon;

                return (
                  <motion.button
                    key={feature.id}
                    onClick={() => setActiveFeature(feature.id)}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + index * 0.08 }}
                    whileHover={{ x: isActive ? 0 : 4 }}
                    className={`w-full text-left p-4 sm:p-6 rounded-xl sm:rounded-2xl transition-all duration-500 group ${
                      isActive
                        ? "bg-card shadow-xl border border-primary/15"
                        : "bg-transparent hover:bg-card/60 border border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-4 sm:gap-5">
                      <motion.div 
                        className={`feature-icon shrink-0 ${feature.iconClass}`}
                        animate={isActive ? { scale: 1.05 } : { scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-4">
                          <h4
                            className={`text-base sm:text-lg font-display font-semibold transition-colors duration-300 ${
                              isActive ? "text-primary" : "text-foreground group-hover:text-primary"
                            }`}
                          >
                            {feature.title}
                          </h4>
                          <motion.div
                            animate={isActive ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" />
                          </motion.div>
                        </div>
                        
                        <motion.div
                          initial={false}
                          animate={{
                            height: isActive ? "auto" : 0,
                            opacity: isActive ? 1 : 0,
                          }}
                          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="mt-2 sm:mt-3 text-muted-foreground leading-relaxed text-sm sm:text-base">
                            {feature.description}</p>
                          <ul className="mt-4 sm:mt-5 space-y-2 sm:space-y-3">
                            {feature.highlights.map((h, i) => (
                              <motion.li 
                                key={h} 
                                className="flex items-center gap-2 sm:gap-3 text-sm"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                              >
                                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                  <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                                </div>
                                <span className="text-foreground font-medium">{h}</span>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}