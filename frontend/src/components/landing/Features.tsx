import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Users, Calendar, BarChart3, FileText,
  Clock, Globe, Shield, Zap, ArrowRight
} from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Employee Records & Compliance",
    description: "Handles employee records, roles, personal details, and employment status in one system.",
    color: "feature-icon-indigo",
    gradient: "from-indigo-500/20 to-purple-500/20",
    href: "/features/employee-management",
  },
  {
    icon: Calendar,
    title: "Leave & Attendance",
    description: "Manages leave requests, approvals, attendance, and absence tracking.",
    color: "feature-icon-blue",
    gradient: "from-blue-500/20 to-cyan-500/20",
    href: "/features/leave-attendance",
  },
  {
    icon: BarChart3,
    title: "Performance Reviews",
    description: "Evaluates employee performance based on goals, feedback, and appraisals.",
    color: "feature-icon-teal",
    gradient: "from-teal-500/20 to-emerald-500/20",
    href: "/features/performance-reviews",
  },
  {
    icon: FileText,
    title: "Document Management",
    description: "Stores, organizes, and secures HR-related documents digitally.",
    color: "feature-icon-emerald",
    gradient: "from-emerald-500/20 to-green-500/20",
    href: "/features/document-management",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    description: "Records working hours, overtime, and project time accurately.",
    color: "feature-icon-amber",
    gradient: "from-amber-500/20 to-orange-500/20",
    href: "/features/time-tracking",
  },
  {
    icon: Globe,
    title: "ASEAN Labour Policies",
    description: "Apply correct labor laws for leave and termination across ASEAN nations.",
    color: "feature-icon-rose",
    gradient: "from-rose-500/20 to-pink-500/20",
    href: "/features/asean-labour-policies",
  },
  {
    icon: Shield,
    title: "HR Administration",
    description: "The HR Admin manages and maintains all employee data through system.",
    color: "feature-icon-purple",
    gradient: "from-purple-500/20 to-violet-500/20",
    href: "/features/hr-administration",
  },
  {
    icon: Zap,
    title: "Workflow Automation",
    description: "Automates HR processes such as approvals, notifications, and task assignments.",
    color: "feature-icon-indigo",
    gradient: "from-indigo-500/20 to-blue-500/20",
    href: "/features/workflow-automation",
  },
];

export function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-24 sm:py-32 md:py-40 lg:py-48 bg-secondary/30 overflow-hidden"
    >
      {/* Premium background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px divider" />
        <div className="absolute bottom-0 left-0 right-0 h-px divider" />

        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px]"
          animate={{
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-[120px]"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Grid pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 sm:mb-20 lg:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="badge-primary"
          >
            Features
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="headline-lg mt-6 sm:mt-8 mb-5 sm:mb-6"
          >
            Everything You Need to
            <br />
            <span className="gradient-text">Manage Every Organizations</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="body-lg"
          >
            A comprehensive suite of tools designed for modern HR teams.
            Powerful yet intuitive.
          </motion.p>
        </div>

        {/* Feature Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-7 max-w-7xl mx-auto"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Link
                key={feature.title}
                to={feature.href}
                className="group relative block"
              >
                <motion.div
                  initial={{ opacity: 0, y: 60, scale: 0.9 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -8 }}
                  className="relative bg-card rounded-2xl p-6 sm:p-7 h-full border border-border/60 overflow-hidden transition-colors duration-300 group-hover:border-primary/30"
                >
                  {/* Gradient glow on hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                  />

                  {/* Icon */}
                  <motion.div 
                    className={`feature-icon ${feature.color} mb-5 sm:mb-6 relative z-10`}
                    whileHover={{ scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-display font-semibold text-foreground mb-2 sm:mb-3 relative z-10">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed relative z-10 mb-4">
                    {feature.description}
                  </p>

                  {/* Learn more */}
                  <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity relative z-10">
                    Learn more <ArrowRight className="w-4 h-4" />
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </motion.div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA hint */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 sm:mt-20"
        >
         
        </motion.div>
      </div>
    </section>
  );
}
