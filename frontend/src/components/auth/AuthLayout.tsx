import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Check } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const benefits = [
  "Enterprise-grade security",
  "ASEAN compliance ready",
  "Real-time collaboration",
  "Automated workflows",
];

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left side - Form */}
      <div className="w-full lg:w-[55%] flex flex-col">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="p-6 sm:p-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            <span className="text-sm font-medium">Back to home</span>
          </Link>
        </motion.header>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-8 lg:px-12 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="w-full max-w-[420px]"
          >
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 mb-10 group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 transition-shadow duration-300 group-hover:shadow-xl group-hover:shadow-primary/25"
              >
                <span className="text-primary-foreground font-bold text-xl">
                  L
                </span>
              </motion.div>
              <span className="text-xl font-display font-bold text-foreground tracking-tight">
                LuminaHR
              </span>
            </Link>

            {/* Title */}
            <div className="mb-8">
              <motion.h1 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
                className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight"
              >
                {title}
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                className="mt-2.5 text-muted-foreground text-base"
              >
                {subtitle}
              </motion.p>
            </div>

            {/* Form content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              {children}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Premium visual (hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gradient-to-br from-primary via-primary/95 to-primary/85"
      >
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '32px 32px',
          }} />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-16 w-full">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="mb-8"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="text-3xl xl:text-4xl font-bold text-white leading-tight mb-4"
          >
            Transform your
            <br />
            HR operations
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55, ease: [0.23, 1, 0.32, 1] }}
            className="text-white/70 text-lg mb-10 max-w-sm leading-relaxed"
          >
            Join forward-thinking companies across ASEAN managing their workforce with confidence.
          </motion.p>

          {/* Benefits list */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.6 + index * 0.08, 
                  ease: [0.23, 1, 0.32, 1] 
                }}
                className="flex items-center gap-3"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-white/90 font-medium">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* Bottom testimonial card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.23, 1, 0.32, 1] }}
            className="mt-12 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10"
          >
            <p className="text-white/90 font-medium leading-relaxed mb-4">
              "LuminaHR has streamlined our entire HR process. The platform is intuitive and our team adopted it within days."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white font-semibold text-sm">SM</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Sarah Mitchell</p>
                <p className="text-white/60 text-sm">HR Director, TechCorp Asia</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Decorative gradient orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      </motion.div>
    </div>
  );
}
