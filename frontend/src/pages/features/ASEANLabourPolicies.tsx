import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Globe, 
  CheckCircle2, 
  Scale, 
  FileCheck, 
  AlertCircle,
  Building2,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ASEAN 11 countries with description
const countries = [
  { name: "Brunei", flag: "🇧🇳", description: "Brunei is a small, wealthy country in Southeast Asia with oil-rich economy and Malay culture." },
  { name: "Cambodia", flag: "🇰🇭", description: "Cambodia is known for Angkor Wat, rich culture, and historical heritage." },
  { name: "Indonesia", flag: "🇮🇩", description: "Indonesia is the largest archipelago in the world, famous for its diverse culture and islands." },
  { name: "Laos", flag: "🇱🇦", description: "Laos is a landlocked country with mountains, rivers, and rich Buddhist culture." },
  { name: "Malaysia", flag: "🇲🇾", description: "Malaysia has diverse cultures and modern cities like Kuala Lumpur, with tropical rainforests." },
  { name: "Myanmar", flag: "🇲🇲", description: "Myanmar has rich history, thousands of pagodas, and diverse ethnic groups." },
  { name: "Philippines", flag: "🇵🇭", description: "Philippines is an archipelago famous for beaches, islands, and vibrant culture." },
  { name: "Singapore", flag: "🇸🇬", description: "Singapore is a city-state known for finance, cleanliness, and modern urban planning." },
  { name: "Thailand", flag: "🇹🇭", description: "Thailand is famous for tourism, beaches, food, and historical temples." },
  { name: "Timor-Leste", flag: "🇹🇱", description: "Timor-Leste is a young country in Southeast Asia with Portuguese influence and natural beauty." },
  { name: "Vietnam", flag: "🇻🇳", description: "Vietnam is known for rich history, delicious food, and stunning landscapes like Ha Long Bay." },
];

const capabilities = [
  { icon: Scale, title: "Legal Compliance", description: "Automatically apply correct labor laws for each country's requirements." },
  { icon: FileCheck, title: "Leave Policies", description: "Country-specific leave entitlements and public holidays built-in." },
  { icon: AlertCircle, title: "Termination Rules", description: "Ensure terminations follow local legal requirements and notice periods." },
  { icon: Building2, title: "Multi-Entity Support", description: "Manage employees across different legal entities and jurisdictions." },
];

export default function ASEANLabourPoliciesPage() {
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);

  const toggleCountry = (name: string) => setExpandedCountry(expandedCountry === name ? null : name);

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 via-transparent to-pink-500/5" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="feature-icon feature-icon-rose mb-6">
                <Globe className="w-6 h-6" />
              </div>

              <h1 className="headline-xl mb-6">
                ASEAN Labour <span className="gradient-text">Policies</span>
              </h1>

              <p className="body-lg mb-8">
                Apply the correct labor laws when an employee requests leave or is terminated, 
                ensuring all actions follow legal requirements across ASEAN nations.
              </p>
            </motion.div>

{/* Right: Countries */}
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
                      className="flex flex-col gap-2 p-3 rounded-lg bg-muted/50 cursor-pointer"
                      onClick={() => toggleCountry(country.name)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{country.flag}</span>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{country.name}</p>
                        </div>
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      </div>

                      {expandedCountry === country.name && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="text-xs text-muted-foreground mt-2"
                        >
                          {country.description}
                        </motion.p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PDF Section */}
      <section className="py-24 bg-secondary/10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="headline-md gradient-text">Employee ASEAN Labour Laws</h2>
            <p className="body-lg mt-4 max-w-2xl mx-auto">
              Companies can check the official ASEAN Labour Law document below. Click the button to view or download.
            </p>
          </motion.div>

          <a
            href="https://asean.org/wp-content/uploads/images/2015/August/ASEAN-Labour-Ministerial-Meeting-document/Comparative%20Labour%20Laws%20and%20Practices%20in%20ASEAN%20Vol%20II.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Download Labour Law PDF
          </a>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-24 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
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

      {/* container-_- */}
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
          </motion.div>
        </div>
      </section>

      {/* Insights & Guides:-) */}
      <section className="py-24 bg-gradient-to-r from-rose-50 to-pink-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <h2 className="headline-md gradient-text">Insights & Guides</h2>
            <p className="body-lg mt-4 max-w-2xl mx-auto">
              Explore detailed guides, regional insights, and best practices to manage employees efficiently across ASEAN countries.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all">
              <h3 className="text-lg font-semibold mb-2">Leave Management Tips</h3>
              <p className="text-muted-foreground text-sm">
                Best practices for handling annual leave, sick leave, and public holidays across ASEAN nations.
              </p>
            </motion.div>
            <motion.div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all">
              <h3 className="text-lg font-semibold mb-2">Compliance Checklist</h3>
              <p className="text-muted-foreground text-sm">
                A practical checklist to ensure all HR processes meet local labor laws.
              </p>
            </motion.div>
            <motion.div className="p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-all">
              <h3 className="text-lg font-semibold mb-2">Company Case Studies</h3>
              <p className="text-muted-foreground text-sm">
                Learn how leading companies manage employee leave and terminations legally across multiple ASEAN countries.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/*link main*/}
      <section className="py-12 text-center">
        <Link to="/">
          <Button className="btn-primary">← Back to Main Page</Button>
        </Link>
      </section>

    </div>
  );
}