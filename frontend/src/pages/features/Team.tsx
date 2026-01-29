import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThhImage from "C:/Users/LENOVO/HR-App-lumina/frontend/src/pages/features/Thh.jpg";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  phone: string;
  email: string;
  image: string;
};

// Team Members 
const TEAM: TeamMember[] = [
  {
    id: 1,
    name: "Thet Mon Hnin",
    role: "Team Leader",
    bio: "Leads the team and coordinates overall project activities. Actively participated in collecting and reviewing ASEAN labour law data to ensure accuracy and relevance for the system.",
    phone: "+95 9 123 456 789",
    email: "thetmonhnin@uit.edu.mm",
    image: "",
  },
  {
    id: 2,
    name: "Htet Wunna",
    role: "Team Member",
    bio: "Assisted in gathering and comparing project data including labour regulations, HR procedures, and leave management information across ASEAN contexts.",
    phone: "+95 9 987 654 321",
    email: "htetwunna@uit.edu.mm",
    image: "",
  },
  {
    id: 3,
    name: "Thet Htet Hnin",
    role: "Team member",
    bio: "Contributed to collecting and organizing project-related data such as ASEAN labour guidelines, HR workflows, and system documentation needs.",
    phone: "+95 9 456 789 123",
    email: "thethtethnin@uit.edu.mm",
    image: ThhImage,
  },
  {
    id: 4,
    name: "Hsu Myat Htet",
    role: "Team member",
    bio: "Assisted in gathering and comparing project data including labour regulations, HR procedures, and leave management information across ASEAN contexts.",
    phone: "+95 9 321 654 987",
    email: "hsumyathtet@uit.edu.mm",
    image: "",
  },
  {
    id: 5,
    name: "Nann Eaindray Khin",
    role: "Team member",
    bio: "Participated in data collection and review covering ASEAN labour information, HR policies, and functional requirements to support the project.",
    phone: "+95 9 555 666 777",
    email: "nanneaindraykhin@gmail.com",
    image: "",
  },
];

export default function TeamPage() {
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <div className="bg-background text-foreground dark:bg-[#0f0f0f] duration-300">

      {/* HERO SECTION */}
      <section className="relative w-full min-h-screen flex flex-col justify-center items-center bg-primary/5 dark:bg-white/5 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-[#3B82F6] via-[#6366F1] to-[#B45309] bg-clip-text text-transparent"
        >
          LuminaHR: Empowering Teams <br />
          ASEAN-Compliant Leave Management
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 max-w-3xl text-lg text-gray-700 dark:text-gray-300"
        >
          Streamline employee leave workflows, ensure compliance with ASEAN labour regulations, and make HR management effortless for your company.
        </motion.p>
      </section>

      {/* TEAM MEMBERS */}
      <section
        id="team-section"
        className="max-w-4xl mx-auto mt-16 px-4 flex flex-col gap-10 pb-24"
      >
        <h2 className="text-3xl font-semibold text-center text-primary mb-8 dark:text-purple-300">
          Our Leadership & Visionaries
        </h2>

        {TEAM.map((member) => (
          <FadeInCard
            key={member.id}
            member={member}
            activeId={activeId}
            setActiveId={setActiveId}
          />
        ))}
      </section>

{/*main button*/}
<section className="w-full bg-primary/10 dark:bg-white/10 py-20 px-6 mt-10">
  <div className="max-w-3xl mx-auto text-center">
    <h3 className="text-4xl font-bold mb-4 text-primary dark:text-purple-300">
      Want to Know More Information!
    </h3>
    <p className="text-muted-foreground dark:text-gray-300 mb-8 text-lg">
      Whether you're interested in partnerships, joining us, or learning more — reach out anytime.
    </p>

    <button
      onClick={() => (window.location.href = "/")}
      className="px-8 py-3 rounded-xl bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 transition dark:bg-purple-600 dark:hover:bg-purple-700"
    >
      Back to Main Page
    </button>
  </div>
</section>
    </div>
  );
}

// TEAM CARD 
function FadeInCard({
  member,
  activeId,
  setActiveId,
}: {
  member: TeamMember;
  activeId: number | null;
  setActiveId: (id: number | null) => void;
}) {
  const isOpen = activeId === member.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col gap-6 p-6 rounded-2xl shadow-xl border bg-white/40 border-black/10 backdrop-blur-md hover:shadow-2xl transition dark:bg-white/10 dark:border-white/10"
    >
      <div className="flex items-start gap-6">
        <img
          src={member.image}
          alt={member.name}
          className="w-32 h-32 object-cover rounded-xl shadow-md"
        />

        <div className="flex-1">
          <h3 className="text-2xl font-semibold dark:text-white">{member.name}</h3>
          <p className="text-primary font-medium dark:text-purple-300">{member.role}</p>

          <p className="mt-2 text-muted-foreground dark:text-gray-300">{member.bio}</p>

          <button
            onClick={() => setActiveId(isOpen ? null : member.id)}
            className="mt-4 text-primary text-sm dark:text-purple-300"
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
                className="mt-3 text-sm space-y-1 dark:text-gray-200"
              >
                <p>📞 {member.phone}</p>
                <p>📧 {member.email}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}