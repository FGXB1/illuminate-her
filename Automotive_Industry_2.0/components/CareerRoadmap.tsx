"use client";

import { useState } from "react";
import {
  X,
  GraduationCap,
  Award,
  Users,
  Star,
  DollarSign,
  ChevronRight,
  Sparkles,
  BookOpen,
  Briefcase,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface CareerPath {
  title: string;
  description: string;
  salaryRange: string;
  growth: string;
  icon: React.ReactNode;
}

const CAREER_PATHS: CareerPath[] = [
  {
    title: "Automotive Engineer",
    description:
      "Design, develop, and test vehicles and their systems — from powertrains to aerodynamics.",
    salaryRange: "$70,000 – $120,000",
    growth: "6% projected growth",
    icon: <Briefcase size={18} />,
  },
  {
    title: "Motorsport Strategist",
    description:
      "Analyze real-time race data to make split-second pit stop and tire strategy decisions.",
    salaryRange: "$60,000 – $150,000+",
    growth: "High demand in F1 & WEC",
    icon: <Sparkles size={18} />,
  },
  {
    title: "EV / Battery Systems Engineer",
    description:
      "Develop battery packs, charging infrastructure, and electric drivetrains for the next generation of vehicles.",
    salaryRange: "$85,000 – $140,000",
    growth: "25%+ projected growth",
    icon: <Briefcase size={18} />,
  },
  {
    title: "Vehicle Safety Engineer",
    description:
      "Design crash-test protocols, safety systems, and ADAS features that save lives on the road.",
    salaryRange: "$75,000 – $125,000",
    growth: "9% projected growth",
    icon: <Briefcase size={18} />,
  },
  {
    title: "Automotive UX / HMI Designer",
    description:
      "Create the in-car digital experience — infotainment, instrument clusters, and voice interfaces.",
    salaryRange: "$80,000 – $130,000",
    growth: "13% projected growth",
    icon: <Briefcase size={18} />,
  },
  {
    title: "Supply Chain & Operations Manager",
    description:
      "Coordinate global parts sourcing, just-in-time logistics, and factory operations.",
    salaryRange: "$70,000 – $115,000",
    growth: "Steady demand",
    icon: <Briefcase size={18} />,
  },
];

interface WomanLeader {
  name: string;
  role: string;
  achievement: string;
}

const WOMEN_LEADERS: WomanLeader[] = [
  {
    name: "Hannah Schmitz",
    role: "Head of Race Strategy, Oracle Red Bull Racing",
    achievement:
      "Masterminded multiple F1 World Championship-winning strategies with race-defining pit stop calls.",
  },
  {
    name: "Mary Barra",
    role: "Chair & CEO, General Motors",
    achievement:
      "First woman to lead a major automaker; driving GM's $35 billion EV transformation.",
  },
  {
    name: "Leena Gade",
    role: "Race Engineer, Audi / Bentley Motorsport",
    achievement:
      "First woman race engineer to win the 24 Hours of Le Mans — and she did it three times.",
  },
  {
    name: "Bertha Benz",
    role: "Automotive Pioneer",
    achievement:
      "Completed the first long-distance automobile trip in 1888 (66 miles), proving the car was a viable invention.",
  },
  {
    name: "Danica Patrick",
    role: "Professional Race Car Driver",
    achievement:
      "First woman to lead the Indy 500 and to win an IndyCar Series race (2008 Indy Japan 300).",
  },
  {
    name: "Helle Nice",
    role: "Grand Prix Racing Driver (1929–1936)",
    achievement:
      "One of the first women to race at Grand Prix level, reaching speeds over 120 mph in the 1930s.",
  },
  {
    name: "Linda Zhang",
    role: "Chief Engineer, Ford F-150 Lightning",
    achievement:
      "Led the engineering of Ford's first all-electric pickup truck — the best-selling EV truck in the US.",
  },
  {
    name: "Michèle Mouton",
    role: "Rally Driver & FIA Women in Motorsport Commission President",
    achievement:
      "First woman to win a round of the World Rally Championship; now champions women's participation globally.",
  },
];

interface Organization {
  name: string;
  description: string;
  url: string;
}

const ORGANIZATIONS: Organization[] = [
  {
    name: "Women in Automotive",
    description:
      "Annual conference & year-round community connecting women professionals across OEMs, dealerships, and suppliers.",
    url: "https://www.womeninautomotive.com",
  },
  {
    name: "SAE International – Women in Engineering",
    description:
      "Programs, scholarships, and networking through the world's largest automotive engineering society.",
    url: "https://www.sae.org",
  },
  {
    name: "FIA Women in Motorsport Commission",
    description:
      "Global initiative to develop and support women across all motorsport disciplines — racing, engineering, and management.",
    url: "https://www.fia.com/women-motorsport",
  },
  {
    name: "Women of Color in Automotive (WOCA)",
    description:
      "Dedicated to advancing women of color through mentorship, professional development, and community building.",
    url: "https://www.wocaonline.org",
  },
  {
    name: "Automotive Women's Alliance Foundation (AWAF)",
    description:
      "Provides scholarships to women pursuing automotive-related degrees and recognizes industry leaders.",
    url: "https://awafoundation.org",
  },
  {
    name: "Girls Auto Clinic",
    description:
      "Empowers women with automotive knowledge through workshops, a full-service repair shop, and best-selling book.",
    url: "https://www.girlsautoclinic.com",
  },
];

interface Certification {
  name: string;
  provider: string;
  description: string;
}

const CERTIFICATIONS: Certification[] = [
  {
    name: "ASE Certification",
    provider: "National Institute for Automotive Service Excellence",
    description:
      "The gold-standard credential for automotive technicians and engineers — recognized across the industry.",
  },
  {
    name: "SAE Professional Development Certificates",
    provider: "SAE International",
    description:
      "Specialized certificates in ADAS, EV systems, vehicle dynamics, and more.",
  },
  {
    name: "PMP (Project Management Professional)",
    provider: "Project Management Institute",
    description:
      "Essential for leading vehicle programs, from concept to production.",
  },
  {
    name: "Six Sigma Green / Black Belt",
    provider: "ASQ / IASSC",
    description:
      "Lean manufacturing and quality improvement — critical for automotive production roles.",
  },
  {
    name: "Certified LabVIEW / MATLAB Specialist",
    provider: "NI / MathWorks",
    description:
      "Key tools for vehicle testing, simulation, and data analysis in motorsport and OEM engineering.",
  },
];

interface EducationPath {
  level: string;
  programs: string[];
}

const EDUCATION: EducationPath[] = [
  {
    level: "Bachelor's Degree",
    programs: [
      "Mechanical Engineering",
      "Electrical Engineering",
      "Automotive Engineering Technology",
      "Industrial Design",
      "Computer Science (autonomous vehicles / HMI)",
    ],
  },
  {
    level: "Master's / Advanced",
    programs: [
      "MS in Automotive Engineering (Clemson ICAR, Kettering, etc.)",
      "MBA with Automotive Concentration",
      "MS in Motorsport Engineering (Cranfield, Oxford Brookes)",
      "MS in Electrical / EV Systems Engineering",
    ],
  },
  {
    level: "Alternative Pathways",
    programs: [
      "Community college automotive technology programs",
      "OEM apprenticeship & rotational programs (BMW, Toyota, Ford)",
      "Online courses (Coursera, Udacity Self-Driving Car Nanodegree)",
      "Motorsport engineering bootcamps (PureMTech, MIA)",
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Tab type                                                           */
/* ------------------------------------------------------------------ */

type Tab =
  | "careers"
  | "leaders"
  | "organizations"
  | "certifications"
  | "education";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "careers", label: "Career Paths", icon: <Briefcase size={16} /> },
  { id: "leaders", label: "Trailblazers", icon: <Star size={16} /> },
  { id: "organizations", label: "Organizations", icon: <Users size={16} /> },
  { id: "certifications", label: "Certifications", icon: <Award size={16} /> },
  { id: "education", label: "Education", icon: <GraduationCap size={16} /> },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface CareerRoadmapProps {
  onClose: () => void;
  onPlayAgain: () => void;
}

export default function CareerRoadmap({ onClose, onPlayAgain }: CareerRoadmapProps) {
  const [activeTab, setActiveTab] = useState<Tab>("careers");

  return (
    <div
      className="absolute inset-0 z-[60] flex items-center justify-center backdrop-blur-lg"
      style={{ backgroundColor: "rgba(36,1,21,0.95)" }}
    >
      {/* Main container */}
      <div
        className="relative w-[92vw] max-w-5xl max-h-[90vh] flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{
          backgroundColor: "rgba(36,1,21,0.98)",
          border: "1px solid rgba(209,102,102,0.3)",
        }}
      >
        {/* ---- Header ---- */}
        <div
          className="flex items-center justify-between px-8 py-5 shrink-0"
          style={{ borderBottom: "1px solid rgba(209,102,102,0.2)" }}
        >
          <div>
            <h2
              className="text-3xl font-bold tracking-tight bg-gradient-to-r bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(to right, #D16666, #C1C1C1)",
              }}
            >
              Your Future Career Roadmap
            </h2>
            <p className="text-sm mt-1" style={{ color: "rgba(193,193,193,0.7)" }}>
              You conquered the race — now explore real careers where women are
              reshaping the automotive industry.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-colors hover:bg-white/10"
          >
            <X size={22} style={{ color: "#C1C1C1" }} />
          </button>
        </div>

        {/* ---- Tabs ---- */}
        <div
          className="flex gap-1 px-8 py-3 shrink-0 overflow-x-auto"
          style={{ borderBottom: "1px solid rgba(209,102,102,0.15)" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap"
              style={{
                backgroundColor:
                  activeTab === tab.id
                    ? "rgba(209,102,102,0.25)"
                    : "transparent",
                color: activeTab === tab.id ? "#D16666" : "#C1C1C1",
                border:
                  activeTab === tab.id
                    ? "1px solid rgba(209,102,102,0.4)"
                    : "1px solid transparent",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ---- Content (scrollable) ---- */}
        <div className="flex-1 overflow-y-auto px-8 py-6 roadmap-scroll">
          {/* CAREERS */}
          {activeTab === "careers" && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed mb-2" style={{ color: "#C1C1C1" }}>
                The automotive industry spans far more than the assembly line.
                Here are some of the most exciting paths — and yes, women are
                thriving in every one of them.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CAREER_PATHS.map((career) => (
                  <div
                    key={career.title}
                    className="rounded-xl p-5 transition-all hover:scale-[1.01]"
                    style={{
                      backgroundColor: "rgba(44,66,81,0.3)",
                      border: "1px solid rgba(209,102,102,0.15)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span style={{ color: "#D16666" }}>{career.icon}</span>
                      <h3 className="font-bold text-white text-base">
                        {career.title}
                      </h3>
                    </div>
                    <p
                      className="text-sm leading-relaxed mb-3"
                      style={{ color: "rgba(193,193,193,0.8)" }}
                    >
                      {career.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "#22c55e" }}>
                        <DollarSign size={13} />
                        {career.salaryRange}
                      </span>
                      <span className="text-xs" style={{ color: "rgba(193,193,193,0.5)" }}>
                        {career.growth}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TRAILBLAZERS */}
          {activeTab === "leaders" && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed mb-2" style={{ color: "#C1C1C1" }}>
                These women didn't just enter the automotive world — they
                changed it. Their journeys prove there's no ceiling in this
                industry.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WOMEN_LEADERS.map((leader) => (
                  <div
                    key={leader.name}
                    className="rounded-xl p-5"
                    style={{
                      backgroundColor: "rgba(44,66,81,0.3)",
                      border: "1px solid rgba(209,102,102,0.15)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Star size={16} style={{ color: "#D16666" }} />
                      <h3 className="font-bold text-white">{leader.name}</h3>
                    </div>
                    <p
                      className="text-xs font-semibold mb-2"
                      style={{ color: "#D16666" }}
                    >
                      {leader.role}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(193,193,193,0.8)" }}
                    >
                      {leader.achievement}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ORGANIZATIONS */}
          {activeTab === "organizations" && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed mb-2" style={{ color: "#C1C1C1" }}>
                You don't have to do it alone. These organizations champion
                women in automotive through mentorship, scholarships, events,
                and community.
              </p>
              <div className="space-y-3">
                {ORGANIZATIONS.map((org) => (
                  <div
                    key={org.name}
                    className="rounded-xl p-5 flex items-start gap-4"
                    style={{
                      backgroundColor: "rgba(44,66,81,0.3)",
                      border: "1px solid rgba(209,102,102,0.15)",
                    }}
                  >
                    <Users
                      size={20}
                      className="shrink-0 mt-0.5"
                      style={{ color: "#D16666" }}
                    />
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">{org.name}</h3>
                      <p
                        className="text-sm leading-relaxed mb-2"
                        style={{ color: "rgba(193,193,193,0.8)" }}
                      >
                        {org.description}
                      </p>
                      <a
                        href={org.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold transition-colors hover:underline"
                        style={{ color: "#D16666" }}
                      >
                        Visit website
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATIONS */}
          {activeTab === "certifications" && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed mb-2" style={{ color: "#C1C1C1" }}>
                Certifications signal expertise and open doors. These are the
                most valued credentials across automotive engineering and
                management.
              </p>
              <div className="space-y-3">
                {CERTIFICATIONS.map((cert) => (
                  <div
                    key={cert.name}
                    className="rounded-xl p-5"
                    style={{
                      backgroundColor: "rgba(44,66,81,0.3)",
                      border: "1px solid rgba(209,102,102,0.15)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Award size={16} style={{ color: "#D16666" }} />
                      <h3 className="font-bold text-white">{cert.name}</h3>
                    </div>
                    <p
                      className="text-xs font-semibold mb-2"
                      style={{ color: "rgba(193,193,193,0.55)" }}
                    >
                      {cert.provider}
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "rgba(193,193,193,0.8)" }}
                    >
                      {cert.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EDUCATION */}
          {activeTab === "education" && (
            <div className="space-y-4">
              <p className="text-sm leading-relaxed mb-2" style={{ color: "#C1C1C1" }}>
                There's no single path into automotive. Whether you're
                university-bound or self-taught, opportunities abound.
              </p>
              <div className="space-y-5">
                {EDUCATION.map((ed) => (
                  <div
                    key={ed.level}
                    className="rounded-xl p-5"
                    style={{
                      backgroundColor: "rgba(44,66,81,0.3)",
                      border: "1px solid rgba(209,102,102,0.15)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen size={16} style={{ color: "#D16666" }} />
                      <h3 className="font-bold text-white">{ed.level}</h3>
                    </div>
                    <ul className="space-y-2">
                      {ed.programs.map((prog) => (
                        <li
                          key={prog}
                          className="flex items-start gap-2 text-sm leading-relaxed"
                          style={{ color: "rgba(193,193,193,0.8)" }}
                        >
                          <ChevronRight
                            size={14}
                            className="shrink-0 mt-0.5"
                            style={{ color: "#D16666" }}
                          />
                          {prog}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ---- Footer ---- */}
        <div
          className="flex items-center justify-between px-8 py-4 shrink-0"
          style={{ borderTop: "1px solid rgba(209,102,102,0.2)" }}
        >
          <p
            className="text-xs italic max-w-md"
            style={{ color: "rgba(193,193,193,0.45)" }}
          >
            The road ahead is wide open. Your race performance shows you have
            what it takes — strategic thinking, quick decisions, and
            determination.
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={onPlayAgain}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all hover:scale-105"
              style={{
                backgroundColor: "rgba(44,66,81,0.5)",
                color: "#C1C1C1",
                border: "1px solid rgba(209,102,102,0.2)",
              }}
            >
              Race Again
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all hover:scale-105"
              style={{
                backgroundColor: "#550C18",
                color: "#C1C1C1",
                border: "1px solid #D16666",
              }}
            >
              Back to Results
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
