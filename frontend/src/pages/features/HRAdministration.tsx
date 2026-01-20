import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Shield, 
  ArrowLeft, 
  CheckCircle2, 
  Users, 
  Settings, 
  Database,
  Lock,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const capabilities = [
  {
    icon: Users,
    title: "User Management",
    description: "Create, modify, and deactivate user accounts with granular permissions."
  },
  {
    icon: Settings,
    title: "System Configuration",
    description: "Customize workflows, approval chains, and organizational hierarchy."
  },
  {
    icon: Database,
    title: "Data Management",
    description: "Import, export, and maintain data integrity across the system."
  },
  {
    icon: Lock,
    title: "Security Controls",
    description: "Audit logs, session management, and access monitoring."
  }
];

const adminTasks = [
  { task: "User provisioning", status: "automated", time: "< 1 min" },
  { task: "Role assignments", status: "automated", time: "Instant" },
  { task: "Compliance reports", status: "scheduled", time: "Daily" },
  { task: "System backups", status: "automated", time: "Hourly" }
];

export default function HRAdministrationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-violet-500/5" />
        <div className="absolute bottom-0 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        
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
              <div className="feature-icon feature-icon-purple mb-6">
                <Shield className="w-6 h-6" />
              </div>
              
              <h1 className="headline-xl mb-6">
                HR 
                <span className="gradient-text"> Administration</span>
              </h1>
              
              <p className="body-lg mb-8">
                The HR Admin manages and maintains all employee data through the system. 
                Complete control with enterprise-grade security.
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
                <h3 className="text-lg font-semibold mb-6">Admin Tasks</h3>
                <div className="space-y-3">
                  {adminTasks.map((item, i) => (
                    <motion.div
                      key={item.task}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium text-foreground">{item.task}</p>
                        <p className="text-sm text-muted-foreground">{item.time}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'automated' 
                          ? 'bg-emerald-500/10 text-emerald-600' 
                          : 'bg-primary/10 text-primary'
                      }`}>
                        {item.status}
                      </span>
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
              Complete <span className="gradient-text">Administrative Control</span>
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
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <cap.icon className="w-6 h-6 text-purple-600" />
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
            className="card-float p-12 text-center bg-gradient-to-br from-purple-500/5 to-violet-500/5"
          >
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="headline-md mb-4">Take control of HR administration</h2>
            <p className="body-lg max-w-2xl mx-auto mb-8">
              Streamline administrative tasks with automation and intelligence.
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