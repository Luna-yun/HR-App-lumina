import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FileText, 
  ArrowLeft, 
  CheckCircle2, 
  FolderOpen, 
  Lock, 
  Search,
  FileCheck,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const capabilities = [
  {
    icon: FolderOpen,
    title: "Digital Storage",
    description: "Securely store all HR documents in organized, searchable folders."
  },
  {
    icon: Lock,
    title: "Access Control",
    description: "Role-based permissions ensure sensitive documents stay protected."
  },
  {
    icon: Search,
    title: "Smart Search",
    description: "Find any document instantly with powerful search and filters."
  },
  {
    icon: FileCheck,
    title: "Version Control",
    description: "Track changes and maintain complete document history."
  }
];

const documentTypes = [
  { name: "Contracts", count: 1247, icon: "📄" },
  { name: "Policies", count: 89, icon: "📋" },
  { name: "ID Documents", count: 2834, icon: "🪪" },
  { name: "Certificates", count: 567, icon: "📜" }
];

export default function DocumentManagementPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-green-500/5" />
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        
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
              <div className="feature-icon feature-icon-emerald mb-6">
                <FileText className="w-6 h-6" />
              </div>
              
              <h1 className="headline-xl mb-6">
                Document 
                <span className="gradient-text"> Management</span>
              </h1>
              
              <p className="body-lg mb-8">
                Store, organize, and secure all HR-related documents digitally. 
                Eliminate paper chaos and ensure compliance.
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
                <h3 className="text-lg font-semibold mb-6">Document Library</h3>
                <div className="grid grid-cols-2 gap-4">
                  {documentTypes.map((doc, i) => (
                    <motion.div
                      key={doc.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                      className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                    >
                      <span className="text-2xl mb-2 block">{doc.icon}</span>
                      <p className="font-medium text-foreground">{doc.name}</p>
                      <p className="text-sm text-muted-foreground">{doc.count.toLocaleString()} files</p>
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
              Secure <span className="gradient-text">Document Hub</span>
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
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <cap.icon className="w-6 h-6 text-emerald-600" />
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
            className="card-float p-12 text-center bg-gradient-to-br from-emerald-500/5 to-green-500/5"
          >
            <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
            <h2 className="headline-md mb-4">Go paperless today</h2>
            <p className="body-lg max-w-2xl mx-auto mb-8">
              Digitize your HR documents and never lose a file again.
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