import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    quote: "LuminaHR transformed how we manage our global workforce. The intuitive interface and powerful automation saved us countless hours every week.",
    author: "Sarah",
    role: "VP of People Operations",
    company: "TechFlow Inc.",
    avatar: "/placeholder.svg",
    rating: 5,
  },
  {
    id: 2,
    quote: "The best HR platform we've ever used. Implementation was seamless, and our team adopted it within days. The support team is outstanding.",
    author: "Michael",
    role: "Chief Human Resources Officer",
    company: "Global Dynamics",
    avatar: "/placeholder.svg",
    rating: 5,
  },
  {
    id: 3,
    quote: "Finally, an HR system that scales with our growth. From 50 to 500 employees, LuminaHR handled everything effortlessly.",
    author: "Emily Watson",
    role: "Director of HR",
    company: "Innovate Labs",
    avatar: "/placeholder.svg",
    rating: 5,
  },
  {
    id: 4,
    quote: "The analytics and reporting features alone are worth it. We make better decisions with real-time workforce insights.",
    author: "David",
    role: "Head of Talent",
    company: "Nexus Solutions",
    avatar: "/placeholder.svg",
    rating: 5,
  },
];

const AUTO_ROTATE_INTERVAL = 6000;

export function Testimonials() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, AUTO_ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused]);

  const goNext = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const goPrev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 sm:py-28 md:py-36 lg:py-44 bg-secondary/30 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle dividers */}
      <div className="absolute top-0 left-0 right-0 h-px divider" />
      <div className="absolute bottom-0 left-0 right-0 h-px divider" />
      
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16 lg:mb-20">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="badge-primary"
          >
            Testimonials
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="headline-lg mt-4 sm:mt-6 mb-4 sm:mb-5"
          >
            Trusted by Industry Leaders
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="body-lg"
          >
            See why thousands of companies choose LuminaHR for their workforce management needs.
          </motion.p>
        </div>

        {/* Main Testimonial Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative">
            {/* Large quote card */}
            <div className="card-float p-6 sm:p-8 lg:p-12 relative overflow-hidden">
              {/* Decorative quote */}
              <Quote className="absolute top-4 sm:top-6 right-4 sm:right-6 w-16 sm:w-20 lg:w-24 h-16 sm:h-20 lg:h-24 text-primary/5" />

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  {/* Stars */}
                  <div className="flex gap-1 mb-4 sm:mb-6">
                    {Array.from({ length: testimonials[activeIndex].rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg sm:text-xl lg:text-2xl font-display text-foreground leading-relaxed mb-6 sm:mb-8">
                    "{testimonials[activeIndex].quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
                      <span className="text-base sm:text-lg font-bold text-primary">
                        {testimonials[activeIndex].author.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-base sm:text-lg">
                        {testimonials[activeIndex].author}
                      </p>
                      <p className="text-muted-foreground text-sm sm:text-base">
                        {testimonials[activeIndex].role} · {testimonials[activeIndex].company}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

             {/* Navigation */}
            <div className="flex items-center justify-between mt-6 sm:mt-8">
              <button
                onClick={goPrev}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-card transition-all duration-300"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Dots */}
              <div className="flex items-center gap-2 sm:gap-3">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === activeIndex 
                        ? "w-8 bg-primary" 
                        : "w-2 bg-border hover:bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={goNext}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-card transition-all duration-300"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Testimonial thumbnails for desktop */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="hidden lg:grid grid-cols-4 gap-4 mt-12 max-w-5xl mx-auto"
        >
          {testimonials.map((testimonial, i) => (
            <button
              key={testimonial.id}
              onClick={() => setActiveIndex(i)}
              className={`p-4 rounded-xl text-left transition-all duration-300 ${
                i === activeIndex
                  ? "bg-card border border-primary/20 shadow-lg"
                  : "bg-card/50 border border-transparent hover:bg-card hover:border-border"
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xs font-semibold text-primary">
                    {testimonial.author.split(" ").map(n => n[0]).join("")}
                  </span>
                </div>
                <div>
                  <p className="font-medium text-foreground text-sm truncate">
                    {testimonial.author}
                  </p>
                  <p className="text-muted-foreground text-xs truncate">
                    {testimonial.company}
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground text-xs line-clamp-2">
                "{testimonial.quote.slice(0, 60)}..."
              </p>
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

