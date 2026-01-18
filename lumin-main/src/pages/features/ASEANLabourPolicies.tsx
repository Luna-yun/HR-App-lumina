import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Globe, 
  ArrowLeft, 
  CheckCircle2, 
  Scale, 
  FileCheck, 
  AlertCircle,
  Building2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const countries = [
  { name: "Singapore", flag: "🇸🇬", compliant: true },
  { name: "Malaysia", flag: "🇲🇾", compliant: true },
  { name: "Indonesia", flag: "🇮🇩", compliant: true },
  { name: "Thailand", flag: "🇹🇭", compliant: true },
  { name: "Philippines", flag: "🇵🇭", compliant: true },
  { name: "Vietnam", flag: "🇻🇳", compliant: true },
  { name: "Myanmar", flag: "🇲🇲", compliant: true },
  { name: "Cambodia", flag: "🇰🇭", compliant: true }
];

const capabilities = [
  {
    icon: Scale,
    title: "Legal Compliance",
    description: "Automatically apply correct labor laws for each country's requirements."
  },
  {
    icon: FileCheck,
    title: "Leave Policies",
    description: "Country-specific leave entitlements and public holidays built-in."
  },
  {
    icon: AlertCircle,
    title: "Termination Rules",
    description: "Ensure terminations follow local legal requirements and notice periods."
  },
  {
    icon: Building2,
    title: "Multi-Entity Support",
    description: "Manage employees across different legal entities and jurisdictions."
  }
];

export default function ASEANLabourPoliciesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-pink-500/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <Link 
            to="/#features" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Features
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="feature-icon feature-icon-rose mb-6">
                <Globe className="w-6 h-6" />
              </div>
              
              <h1 className="headline-xl mb-6">
                ASEAN Labour 
                <span className="gradient-text"> Policies</span>
              </h1>
              
              <p className="body-lg mb-8">
                Apply the correct labor laws when an employee requests leave or is terminated, 
                ensuring all actions follow legal requirements across ASEAN nations.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button className="btn-primary">
                  Get Started
                </Button>
                <Button variant="outline" className="btn-secondary">
                  View Demo
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="card-float p-8">
                <h3 className="text-lg font-semibold mb-6">Supported Countries</h3>
                <div className="grid grid-cols-2 gap-3">
                  {countries.map((country, i) => (
                    <motion.div
                      key={country.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <span className="text-2xl">{country.flag}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{country.name}</p>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Capabilities Section */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge-primary">Capabilities</span>
            <h2 className="headline-md mt-4">
              Regional <span className="gradient-text">Compliance Built-In</span>
            </h2>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="card-elevated p-6 group hover:shadow-xl transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <cap.icon className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{cap.title}</h3>
                <p className="text-muted-foreground text-sm">{cap.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-float p-12 text-center bg-gradient-to-br from-rose-500/5 to-pink-500/5"
          >
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="headline-md mb-4">Stay compliant across ASEAN</h2>
            <p className="body-lg max-w-2xl mx-auto mb-8">
              Never worry about labor law compliance across Southeast Asia again.
            </p>
            <Button className="btn-primary">
              Start Free Trial
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}