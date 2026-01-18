import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  ArrowLeft, 
  CheckCircle2, 
  Target, 
  MessageSquare, 
  TrendingUp,
  Award,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const capabilities = [
  {
    icon: Target,
    title: "Goal Setting",
    description: "Set SMART goals aligned with organizational objectives and track progress."
  },
  {
    icon: MessageSquare,
    title: "360° Feedback",
    description: "Collect comprehensive feedback from peers, managers, and direct reports."
  },
  {
    icon: TrendingUp,
    title: "Performance Tracking",
    description: "Monitor KPIs and competencies with real-time dashboards."
  },
  {
    icon: Award,
    title: "Recognition System",
    description: "Celebrate achievements and build a culture of appreciation."
  }
];

export default function PerformanceReviewsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-emerald-500/5" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px]" />
        
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
              <div className="feature-icon feature-icon-teal mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              
              <h1 className="headline-xl mb-6">
                Performance 
                <span className="gradient-text"> Reviews</span>
              </h1>
              
              <p className="body-lg mb-8">
                Evaluate employee performance based on goals, continuous feedback, 
                and structured appraisals. Drive growth through data-driven insights.
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
                <h3 className="text-lg font-semibold mb-6">Performance Overview</h3>
                <div className="space-y-6">
                  {[
                    { label: "Goals Achieved", value: 87, color: "bg-teal-500" },
                    { label: "Skills Developed", value: 72, color: "bg-emerald-500" },
                    { label: "Peer Recognition", value: 94, color: "bg-primary" }
                  ].map((metric, i) => (
                    <motion.div
                      key={metric.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                    >
                      <div className="flex justify-between mb-2">
                        <span className="text-foreground">{metric.label}</span>
                        <span className="font-semibold">{metric.value}%</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <motion.div 
                          className={`h-full ${metric.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${metric.value}%` }}
                          transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                        />
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
              Drive <span className="gradient-text">Continuous Growth</span>
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
                <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <cap.icon className="w-6 h-6 text-teal-600" />
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
            className="card-float p-12 text-center bg-gradient-to-br from-teal-500/5 to-emerald-500/5"
          >
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="headline-md mb-4">Ready to elevate performance?</h2>
            <p className="body-lg max-w-2xl mx-auto mb-8">
              Transform your review process with data-driven insights.
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