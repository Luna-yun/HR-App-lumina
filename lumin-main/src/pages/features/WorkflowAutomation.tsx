import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Zap, 
  ArrowLeft, 
  CheckCircle2, 
  GitBranch, 
  Bell, 
  Repeat,
  PlayCircle,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const capabilities = [
  {
    icon: GitBranch,
    title: "Approval Workflows",
    description: "Multi-level approval chains with conditional routing and escalations."
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Trigger emails, SMS, or in-app alerts based on custom conditions."
  },
  {
    icon: Repeat,
    title: "Recurring Tasks",
    description: "Schedule recurring HR processes like reviews and compliance checks."
  },
  {
    icon: PlayCircle,
    title: "Process Triggers",
    description: "Automatically initiate workflows based on events or dates."
  }
];

const workflows = [
  { name: "Onboarding", steps: 12, automated: 10, status: "active" },
  { name: "Leave Approval", steps: 4, automated: 4, status: "active" },
  { name: "Performance Review", steps: 8, automated: 6, status: "active" },
  { name: "Offboarding", steps: 15, automated: 12, status: "active" }
];

export default function WorkflowAutomationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-blue-500/5" />
        <div className="absolute top-40 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />
        
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
                <Zap className="w-6 h-6" />
              </div>
              
              <h1 className="headline-xl mb-6">
                Workflow 
                <span className="gradient-text"> Automation</span>
              </h1>
              
              <p className="body-lg mb-8">
                Automate HR processes such as approvals, notifications, and task assignments. 
                Free your team to focus on people, not paperwork.
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
                <h3 className="text-lg font-semibold mb-6">Active Workflows</h3>
                <div className="space-y-4">
                  {workflows.map((wf, i) => (
                    <motion.div
                      key={wf.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                      className="p-4 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-foreground">{wf.name}</span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600">
                          {wf.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-primary rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${(wf.automated / wf.steps) * 100}%` }}
                            transition={{ duration: 0.6, delay: 0.5 + i * 0.1 }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {wf.automated}/{wf.steps} automated
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
              Automate <span className="gradient-text">Everything</span>
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
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <cap.icon className="w-6 h-6 text-indigo-600" />
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
            className="card-float p-12 text-center bg-gradient-to-br from-indigo-500/5 to-blue-500/5"
          >
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="headline-md mb-4">Automate your HR workflows</h2>
            <p className="body-lg max-w-2xl mx-auto mb-8">
              Reduce manual work by 70% with intelligent automation.
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