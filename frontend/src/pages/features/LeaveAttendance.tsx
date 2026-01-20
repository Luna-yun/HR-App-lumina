import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Calendar, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Bell, 
  BarChart3,
  CalendarCheck,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const capabilities = [
  {
    icon: CalendarCheck,
    title: "Leave Requests",
    description: "Employees submit leave requests digitally with automatic manager notifications."
  },
  {
    icon: Clock,
    title: "Real-time Attendance",
    description: "Track clock-in/out times with geolocation and biometric options."
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Automated alerts for pending approvals, conflicts, and balance updates."
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Visual insights into attendance patterns and leave utilization."
  }
];

const leaveTypes = [
  { type: "Annual Leave", days: 15, color: "primary" },
  { type: "Sick Leave", days: 10, color: "amber" },
  { type: "Personal Leave", days: 3, color: "accent" },
  { type: "Parental Leave", days: 90, color: "emerald" }
];

export default function LeaveAttendancePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5" />
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
        
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
              <div className="feature-icon feature-icon-blue mb-6">
                <Calendar className="w-6 h-6" />
              </div>
              
              <h1 className="headline-xl mb-6">
                Leave & 
                <span className="gradient-text"> Attendance</span>
              </h1>
              
              <p className="body-lg mb-8">
                Manage leave requests, approvals, attendance tracking, and absence management 
                with precision. Compliant with ASEAN labor regulations.
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
                <h3 className="text-lg font-semibold mb-6">Leave Entitlements</h3>
                <div className="space-y-4">
                  {leaveTypes.map((leave, i) => (
                    <motion.div
                      key={leave.type}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                      className="flex items-center justify-between"
                    >
                      <span className="text-foreground">{leave.type}</span>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div 
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((leave.days / 90) * 100, 100)}%` }}
                            transition={{ duration: 0.8, delay: 0.6 + i * 0.1 }}
                          />
                        </div>
                        <span className="text-sm font-medium text-muted-foreground w-12">
                          {leave.days} days
                        </span>
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
              Complete <span className="gradient-text">Time Management</span>
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
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <cap.icon className="w-6 h-6 text-blue-600" />
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
            className="card-float p-12 text-center bg-gradient-to-br from-blue-500/5 to-cyan-500/5"
          >
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="headline-md mb-4">Ready to streamline attendance?</h2>
            <p className="body-lg max-w-2xl mx-auto mb-8">
              Join organizations that have eliminated manual attendance tracking.
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