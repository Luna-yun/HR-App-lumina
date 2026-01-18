import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageCircle, 
  Clock, 
  Globe,
  ArrowRight,
  Sparkles,
  Check
} from "lucide-react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us an email anytime",
    value: "hello@luminahr.com",
    href: "mailto:hello@luminahr.com",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Mon-Fri from 8am to 6pm",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Our headquarters",
    value: "San Francisco, CA",
    href: "#",
    gradient: "from-amber-500/20 to-orange-500/20",
  },
];

const features = [
  { icon: Clock, label: "24-hour response time" },
  { icon: MessageCircle, label: "Dedicated support team" },
  { icon: Globe, label: "Global coverage" },
];

export function Contact() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative py-20 sm:py-28 lg:py-36 bg-background overflow-hidden"
    >
      {/* Gradient mesh background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_top_right,_hsl(var(--primary)/0.15)_0%,_transparent_60%)]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(var(--accent)/0.1)_0%,_transparent_60%)]" />
      </div>

      {/* Floating orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-[150px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(var(--primary)/0.1) 0%, transparent 70%)" }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-20">
          {/*<motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
              <Sparkles className="w-4 h-4 mr-2" />
              Get in Touch
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="headline-xl mt-6"
          >
            Let's Start a
            <span className="gradient-text block sm:inline"> Conversation</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="body-lg mt-6 max-w-2xl mx-auto"
          >
            Have questions about LuminaHR? Want to see a demo? Our team is here to help you transform your HR operations.
          </motion.p>*/}

          {/* Feature pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap justify-center gap-3 mt-8"
          >
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border text-muted-foreground text-sm"
              >
                <feature.icon className="w-4 h-4 text-primary" />
                <span>{feature.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">
          {/* Contact methods */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2 space-y-4"
          >
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.a
                  key={index}
                  href={method.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -2 }}
                  className="block group"
                >
                  <div className="relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 overflow-hidden">
                    {/* Gradient background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                    
                    <div className="relative flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {method.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {method.description}
                        </p>
                        <p className="text-sm font-medium text-foreground mt-2 flex items-center gap-2">
                          {method.value}
                          <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.a>
              );
            })}

            {/* Trust badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Enterprise Ready</p>
                  <p className="text-sm text-muted-foreground">SOC 2 & GDPR compliant</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-3"
          >
            <div className="relative">
              {/* Card glow effect */}
              <div className="absolute -inset-px bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-sm opacity-50" />
              
              <div className="relative bg-card rounded-3xl border border-border p-6 sm:p-8 lg:p-10">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
                      <Check className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">Thank You!</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Your message has been received. Our team will get back to you within 24 hours.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-6"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          First Name
                        </label>
                        <Input
                          placeholder="John"
                          required
                          className="h-12 bg-background/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          Last Name
                        </label>
                        <Input
                          placeholder="Doe"
                          required
                          className="h-12 bg-background/50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Work Email
                      </label>
                      <Input
                        type="email"
                        placeholder="john@company.com"
                        required
                        className="h-12 bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        Company
                      </label>
                      <Input
                        placeholder="Your company name"
                        required
                        className="h-12 bg-background/50"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        How can we help?
                      </label>
                      <Textarea
                        placeholder="Tell us about your needs..."
                        required
                        className="min-h-[120px] bg-background/50 resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full h-12 group"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <>
                          Send Message
                          <Send className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                      By submitting, you agree to our{" "}
                      <a href="#" className="text-primary hover:underline">
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-primary hover:underline">
                        Terms of Service
                      </a>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
