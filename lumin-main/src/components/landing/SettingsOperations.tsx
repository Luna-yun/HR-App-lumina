import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Shield, Settings, Lock, Users, Zap, Database, ArrowRight } from "lucide-react";
import settingsPanel from "@/assets/settings-panel-new.png";
import operationsGrid from "@/assets/operations-grid-new.png";

const scrollContent = [
  {
    id: "settings",
    icon: Settings,
    title: "Settings",
    subtitle: "Configure with Confidence",
    description: "Perform HR service configurations with stringent role assignments that allow access only to authorized persons.",
    image: settingsPanel,
    features: ["Granular permissions", "Approval workflows", "Complete audit trails"],
  },
  {
    id: "operations",
    icon: Shield,
    title: "Operations",
    subtitle: "Manage with Precision",
    description: "Easily alter and efficiently manage all data integral to an HR admin's day-to-day processes.",
    image: operationsGrid,
    features: ["Bulk data updates", "Record management", "Enterprise reliability"],
  },
];

const securityFeatures = [
  { icon: Lock, label: "Role-based access control" },
  { icon: Users, label: "Multi-level permissions" },
  { icon: Shield, label: "Audit logging & compliance" },
  { icon: Zap, label: "Real-time monitoring" },
  { icon: Database, label: "Encrypted data storage" },
];

export function SettingsOperations() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 30,
    damping: 40,
    restDelta: 0.001
  });

  // Mobile: Premium stacked layout
  if (isMobile) {
    return (
      <section className="relative bg-[hsl(var(--dark-bg))] py-16 sm:py-20 overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_hsl(var(--primary)/0.15)_0%,_transparent_50%)]" />
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_hsl(var(--accent)/0.1)_0%,_transparent_50%)]" />
        </div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/10 backdrop-blur-sm">
              <Shield className="w-3.5 h-3.5 mr-2" />
              Enterprise Security
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold mt-6 text-white leading-tight">
              Secure Access to
              <span className="block mt-1 bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                Sensitive Data
              </span>
            </h2>

            <p className="mt-4 text-white/50 text-base max-w-md mx-auto leading-relaxed">
              Enterprise-grade security with granular role assignments and complete audit trails.
            </p>
          </motion.div>

          {/* Security features pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 mb-10"
          >
            {securityFeatures.slice(0, 3).map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-xs"
              >
                <feature.icon className="w-3 h-3" />
                <span>{feature.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Tab selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex justify-center gap-2 mb-8"
          >
            {scrollContent.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === index
                      ? "bg-white/10 text-white border border-white/20"
                      : "bg-white/5 text-white/50 border border-transparent hover:bg-white/[0.07]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{item.title}</span>
                </button>
              );
            })}
          </motion.div>

          {/* Content cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden mb-6">
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--dark-bg))] via-transparent to-transparent z-10" />
                <img
                  src={scrollContent[activeTab].image}
                  alt={scrollContent[activeTab].title}
                  className="w-full object-cover"
                />
              </div>

              {/* Info card */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl" />
                <div className="relative p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center">
                      {(() => {
                        const Icon = scrollContent[activeTab].icon;
                        return <Icon className="w-5 h-5 text-cyan-400" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {scrollContent[activeTab].title}
                      </h3>
                      <p className="text-sm text-white/50">
                        {scrollContent[activeTab].subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="text-white/60 text-sm leading-relaxed mb-5">
                    {scrollContent[activeTab].description}
                  </p>

                  <div className="space-y-2">
                    {scrollContent[activeTab].features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-white/50">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>
    );
  }

  // Desktop: Smooth sticky scroll experience
  return (
    <section 
      ref={sectionRef} 
      className="relative bg-[hsl(var(--dark-bg))]"
      style={{ minHeight: '280vh' }}
    >
      {/* Gradient mesh background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_hsl(var(--primary)/0.12)_0%,_transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_hsl(var(--accent)/0.08)_0%,_transparent_50%)]" />
      </div>

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/6 w-[500px] h-[500px] rounded-full blur-[180px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary)/0.15) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Sticky container */}
      <div className="sticky top-0 min-h-screen flex items-center overflow-hidden">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-center">
            {/* Left: Headline content */}
            <div className="max-w-xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold bg-white/10 text-white/80 border border-white/10 backdrop-blur-sm">
                  <Shield className="w-3.5 h-3.5 mr-2" />
                  Enterprise Security
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mt-8 text-white leading-[0.95]"
                style={{ letterSpacing: "-0.03em" }}
              >
                Secure Access
                <br />
                to Sensitive
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
                  Data
                </span>
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl mt-8 text-white/50 max-w-md leading-relaxed"
              >
                Configure HR services with granular role assignments and manage critical data with enterprise-grade security.
              </motion.p>

              {/* Security features */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-10 grid grid-cols-2 gap-3"
              >
                {securityFeatures.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="flex items-center gap-3 text-white/60 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">{item.label}</span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Scroll progress indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-12"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                      style={{ scaleX: smoothProgress, transformOrigin: "left" }}
                    />
                  </div>
                  <span className="text-xs text-white/40 uppercase tracking-wider">Scroll to explore</span>
                </div>
              </motion.div>
            </div>

            {/* Right: Smooth scrolling visuals */}
            <div className="relative min-h-[70vh] flex items-center">
              {scrollContent.map((item, index) => (
                <DesktopScrollItem 
                  key={item.id}
                  item={item}
                  index={index}
                  total={scrollContent.length}
                  smoothProgress={smoothProgress}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface DesktopScrollItemProps {
  item: typeof scrollContent[0];
  index: number;
  total: number;
  smoothProgress: any;
}

function DesktopScrollItem({ item, index, total, smoothProgress }: DesktopScrollItemProps) {
  const Icon = item.icon;
  
  const segmentSize = 1 / total;
  const startPoint = index * segmentSize;
  const fadeInEnd = startPoint + segmentSize * 0.2;
  const stableStart = startPoint + segmentSize * 0.25;
  const stableEnd = startPoint + segmentSize * 0.75;
  const fadeOutStart = startPoint + segmentSize * 0.8;
  const endPoint = (index + 1) * segmentSize;
  
  const opacity = useTransform(
    smoothProgress, 
    [startPoint, fadeInEnd, stableStart, stableEnd, fadeOutStart, endPoint],
    [0, 0.8, 1, 1, index === total - 1 ? 1 : 0.8, index === total - 1 ? 1 : 0]
  );
  
  const y = useTransform(
    smoothProgress,
    [startPoint, fadeInEnd, stableStart, stableEnd, fadeOutStart, endPoint],
    [100, 40, 0, 0, index === total - 1 ? 0 : -40, index === total - 1 ? 0 : -80]
  );
  
  const scale = useTransform(
    smoothProgress,
    [startPoint, stableStart, stableEnd, endPoint],
    [0.95, 1, 1, index === total - 1 ? 1 : 0.97]
  );

  const blur = useTransform(
    smoothProgress,
    [startPoint, fadeInEnd, stableStart, stableEnd, fadeOutStart, endPoint],
    [8, 2, 0, 0, index === total - 1 ? 0 : 2, index === total - 1 ? 0 : 8]
  );

  return (
    <motion.div
      style={{ opacity, y, scale, filter: useTransform(blur, v => `blur(${v}px)`) }}
      className="absolute inset-0 flex items-center"
    >
      <div className="w-full">
        {/* Image with gradient overlay */}
        <div className="relative rounded-2xl overflow-hidden mb-6 group">
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--dark-bg))] via-transparent to-transparent z-10 opacity-60" />
          <img
            src={item.image}
            alt={item.title}
            className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Floating badge */}
          <div className="absolute top-4 right-4 z-20">
            <div className="px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-white">
              {item.subtitle}
            </div>
          </div>
        </div>
        
        {/* Info panel */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl" />
          <div className="relative p-6 rounded-2xl border border-white/10 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-display font-semibold text-white">
                    {item.title}
                  </h3>
                  <ArrowRight className="w-5 h-5 text-white/30" />
                </div>
                <p className="text-white/50 text-base mt-2 leading-relaxed">
                  {item.description}
                </p>
                
                {/* Feature tags */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {item.features.map((feature, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-white/5 text-white/60 border border-white/10"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
