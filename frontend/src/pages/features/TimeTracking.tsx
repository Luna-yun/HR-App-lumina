import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Clock, 
  ArrowLeft, 
  CheckCircle2, 
  Timer, 
  Layers, 
  PieChart,
  Smartphone,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const capabilities = [
  {
    icon: Timer,
    title: "Precise Tracking",
    description: "Record working hours down to the minute with automated timers."
  },
  {
    icon: Layers,
    title: "Project Allocation",
    description: "Assign time to specific projects, clients, or tasks."
  },
  {
    icon: PieChart,
    title: "Utilization Reports",
    description: "Visualize time distribution across activities and teams."
  },
  {
    icon: Smartphone,
    title: "Mobile Access",
    description: "Clock in from anywhere with our mobile-friendly interface."
  }
];

export default function TimeTrackingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
        
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
              <div className="feature-icon feature-icon-amber mb-6">
                <Clock className="w-6 h-6" />
              </div>
              
              <h1 className="headline-xl mb-6">
                Time 
                <span className="gradient-text"> Tracking</span>
              </h1>
              
              <p className="body-lg mb-8">
                Record working hours, overtime, and project time accurately. 
                Make every minute count with intelligent tracking.
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
                <h3 className="text-lg font-semibold mb-6">Today's Summary</h3>
                <div className="text-center mb-6">
                  <motion.p 
                    className="text-5xl font-bold text-foreground"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    7h 42m
                  </motion.p>
                  <p className="text-muted-foreground mt-2">Hours Logged</p>
                </div>
                <div className="space-y-3">
                  {[
                    { project: "Client Project A", hours: "3h 15m", percent: 42 },
                    { project: "Internal Tasks", hours: "2h 30m", percent: 32 },
                    { project: "Meetings", hours: "1h 57m", percent: 26 }
                  ].map((item, i) => (
                    <motion.div
                      key={item.project}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground">{item.project}</span>
                          <span className="text-muted-foreground">{item.hours}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-amber-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percent}%` }}
                            transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                          />
                        </div>
                      </div>
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
              Every Second <span className="gradient-text">Accounted For</span>
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
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <cap.icon className="w-6 h-6 text-amber-600" />
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
            className="card-float p-12 text-center bg-gradient-to-br from-amber-500/5 to-orange-500/5"
          >
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="headline-md mb-4">Start tracking time smarter</h2>
            <p className="body-lg max-w-2xl mx-auto mb-8">
              Gain visibility into where time goes across your organization.
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