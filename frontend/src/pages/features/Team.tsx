import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

type TeamMember = {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
  spotlight?: boolean;
};

const TEAM: TeamMember[] = [
  {
    id: 1,
    name: "Avery Chen",
    role: "Chief Executive Officer",
    bio: "Architect of culture and long-term vision. Believes great teams are designed, not managed.",
    image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e",
    spotlight: true,
  },
  {
    id: 2,
    name: "Lucas Moreno",
    role: "Chief People Officer",
    bio: "Builds systems where humans do their best work — at scale.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
    spotlight: true,
  },
  {
    id: 3,
    name: "Sofia Patel",
    role: "Design Lead",
    bio: "Designs clarity. Obsessed with emotional resonance and invisible UX.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2",
  },
  {
    id: 4,
    name: "Ethan Brooks",
    role: "Engineering Lead",
    bio: "Turns complexity into calm, scalable systems.",
    image: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
  },
  {
    id: 5,
    name: "Mina Aung",
    role: "AI Research",
    bio: "Human-centered intelligence. Ethics before efficiency.",
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
  },
];

export default function Team() {
  const [active, setActive] = useState<TeamMember | null>(null);

  return (
    <div className="bg-white text-neutral-900">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-28 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-semibold tracking-tight"
          >
            Built by humans,<br className="hidden md:block" /> designed for humans
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-neutral-600"
          >
            We are a multidisciplinary team shaping how organizations grow,
            connect, and thrive — thoughtfully.
          </motion.p>
        </div>
      </section>

      {/* EXECUTIVE SPOTLIGHT */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="mb-12 text-2xl font-medium tracking-tight">
          Executive Spotlight
        </h2>

        <div className="grid gap-12 md:grid-cols-2">
          {TEAM.filter((m) => m.spotlight).map((member) => (
            <motion.div
              key={member.id}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="group flex flex-col gap-6 rounded-2xl border border-neutral-200 p-6 md:flex-row"
            >
              <img
                src={member.image}
                alt={member.name}
                className="h-28 w-28 rounded-xl object-cover"
              />

              <div>
                <h3 className="text-xl font-medium">{member.name}</h3>
                <p className="text-sm text-neutral-500">{member.role}</p>

                <p className="mt-3 text-neutral-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TEAM GRID */}
      <section className="bg-neutral-50">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <h2 className="mb-16 text-center text-3xl font-medium tracking-tight">
            The Team
          </h2>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
            {TEAM.filter((m) => !m.spotlight).map((member) => (
              <motion.button
                key={member.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setActive(member)}
                className="group text-left"
              >
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Hover micro-bio */}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <div className="p-4 text-white">
                      <p className="text-sm leading-snug">{member.bio}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-neutral-500">{member.role}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* MODAL STORYTELLING */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-3xl bg-white p-8"
            >
              <img
                src={active.image}
                alt={active.name}
                className="mb-6 h-64 w-full rounded-2xl object-cover"
              />

              <h3 className="text-2xl font-medium">{active.name}</h3>
              <p className="text-neutral-500">{active.role}</p>

              <p className="mt-4 text-neutral-700 leading-relaxed">
                {active.bio}
              </p>

              <button
                onClick={() => setActive(null)}
                className="mt-6 text-sm font-medium text-neutral-500 hover:text-neutral-800"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
