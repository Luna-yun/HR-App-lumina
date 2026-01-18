import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  UserPlus, 
  FolderOpen, 
  Shield, 
  Database,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const capabilities = [
  {
    icon: UserPlus,
    title: "Employee Onboarding",
    description: "Streamlined onboarding workflows with digital document collection and automated task assignments."
  },
  {
    icon: FolderOpen,
    title: "Centralized Records",
    description: "Single source of truth for all employee data, accessible securely from anywhere."
  },
  {
    icon: Shield,
    title: "Role-Based Access",
    description: "Granular permissions ensure employees see only what they need."
  },
  {
    icon: Database,
    title: "Data Integrity",
    description: "Audit trails and version history for compliance and accountability."
  }
];

const benefits = [
  "Reduce administrative overhead by 60%",
  "Eliminate paper-based processes",
  "Ensure data accuracy across systems",
  "Enable employee self-service updates",
  "Maintain compliance with data regulations"
];

export default function EmployeeManagementPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/10 rounded-full blur-[120px]" />
        
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
              <div className="feature-icon feature-icon-indigo mb-6">
                <Users className="w-6 h-6" />
              </div>
              
              <h1 className="headline-xl mb-6">
                Employee 
                <span className="gradient-text"> Management</span>
              </h1>
              
              <p className="body-lg mb-8">
                Handle employee records, roles, personal details, and employment status 
                in one unified system. Built for enterprises that value precision and security.
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
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Active Employees", value: "2,847" },
                    { label: "Departments", value: "24" },
                    { label: "This Month", value: "+156" },
                    { label: "Retention Rate", value: "94.2%" }
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                      className="p-4 rounded-xl bg-muted/50"
                    >
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
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
              Everything You Need to <span className="gradient-text">Manage People</span>
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
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <cap.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{cap.title}</h3>
                <p className="text-muted-foreground text-sm">{cap.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="badge-accent">Benefits</span>
              <h2 className="headline-md mt-4 mb-8">
                Why Organizations <span className="gradient-text">Choose Us</span>
              </h2>
              
              <div className="space-y-4">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card-float p-8 bg-gradient-to-br from-primary/5 to-accent/5"
            >
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-semibold">Ready to transform your HR?</h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Join thousands of organizations that have modernized their employee management.
              </p>
              <Button className="btn-primary w-full">
                Start Free Trial
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}