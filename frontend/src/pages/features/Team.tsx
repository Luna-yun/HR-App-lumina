import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, Users } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Footer } from "@/components/landing/Footer";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  phone: string;
  email: string;
  initials: string;
};

const TEAM: TeamMember[] = [
  {
    id: 1,
    name: "Thet Mon Hnin",
    role: "Team Leader",
    bio: "Leads the team and coordinates overall project activities. Actively participated in collecting and reviewing ASEAN labour law data to ensure accuracy and relevance for the system.",
    phone: "+95 9 123 456 789",
    email: "thetmonhnin@uit.edu.mm",
    initials: "TM",
  },
  {
    name: "Htet Wunna",
    id: 2,
    role: "Team Member",
    bio: "Assisted in gathering and comparing project data including labour regulations, HR procedures, and leave management information across ASEAN contexts.",
    phone: "+95 9 987 654 321",
    email: "htetwunna@uit.edu.mm",
    initials: "HW",
  },
  {
    id: 3,
    name: "Thet Htet Hnin",
    role: "Team Member",
    bio: "Contributed to collecting and organizing project-related data such as ASEAN labour guidelines, HR workflows, and system documentation needs.",
    phone: "+95 9 456 789 123",
    email: "thethtethnin@uit.edu.mm",
    initials: "TH",
  },
  {
    id: 4,
    name: "Hsu Myat Htet",
    role: "Team Member",
    bio: "Assisted in gathering and comparing project data including labour regulations, HR procedures, and leave management information across ASEAN contexts.",
    phone: "+95 9 321 654 987",
    email: "hsumyathtet@uit.edu.mm",
    initials: "HM",
  },
  {
    id: 5,
    name: "Nann Eaindray Khin",
    role: "Team Member",
    bio: "Participated in data collection and review covering ASEAN labour information, HR policies, and functional requirements to support the project.",
    phone: "+95 9 555 666 777",
    email: "nanneaindraykhin@gmail.com",
    initials: "NE",
  },
];

export default function TeamPage() {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-20 flex flex-col justify-center items-center bg-primary/5 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight"
        >
          <span className="gradient-text">LuminaHR</span>: Empowering Teams
          <br />
          <span className="text-foreground">ASEAN-Compliant Leave Management</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 max-w-3xl text-lg text-muted-foreground"
        >
          Streamline employee leave workflows, ensure compliance with ASEAN labour regulations, 
          and make HR management effortless for your company.
        </motion.p>
      </section>

      {/* Team Members Section */}
      <section
        id="team-section"
        className="max-w-4xl mx-auto py-16 px-4 flex flex-col gap-8"
      >
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-semibold text-center text-foreground mb-8"
        >
          Our Leadership & <span className="gradient-text">Visionaries</span>
        </motion.h2>

        {TEAM.map((member, index) => (
          <TeamCard
            key={member.id}
            member={member}
            index={index}
            activeId={activeId}
            setActiveId={setActiveId}
          />
        ))}
      </section>

      {/* Contact CTA Section */}
      <section className="w-full bg-secondary/50 py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-4 text-foreground"
          >
            Want to Know More <span className="gradient-text">Information</span>!
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground mb-8 text-lg"
          >
            Whether you're interested in partnerships, joining us, or learning more — reach out anytime.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            onClick={() => {
              const section = document.getElementById("team-section");
              section?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-medium shadow-md hover:shadow-lg hover:bg-primary/90 transition-all"
          >
            Contact Our Team
          </motion.button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function TeamCard({
  member,
  index,
  activeId,
  setActiveId,
}: {
  member: TeamMember;
  index: number;
  activeId: number | null;
  setActiveId: (id: number | null) => void;
}) {
  const isOpen = activeId === member.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col sm:flex-row gap-6 p-6 rounded-2xl shadow-lg border bg-card border-border hover:shadow-xl transition-all"
    >
      {/* Avatar */}
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
        <span className="text-2xl sm:text-3xl font-bold text-primary">{member.initials}</span>
      </div>

      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-xl sm:text-2xl font-semibold text-foreground">{member.name}</h3>
        <p className="text-primary font-medium">{member.role}</p>

        <p className="mt-2 text-muted-foreground text-sm sm:text-base">{member.bio}</p>

        <button
          onClick={() => setActiveId(isOpen ? null : member.id)}
          className="mt-4 text-primary text-sm font-medium hover:underline"
        >
          {isOpen ? "Hide Contact" : "View Contact Info"}
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-3 text-sm space-y-2 overflow-hidden"
            >
              <p className="flex items-center gap-2 justify-center sm:justify-start text-muted-foreground">
                <Phone className="w-4 h-4" /> {member.phone}
              </p>
              <p className="flex items-center gap-2 justify-center sm:justify-start text-muted-foreground">
                <Mail className="w-4 h-4" /> {member.email}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
