import React, { useState, useEffect } from "react";
import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Skills from "../components/sections/Skills";
import Projects from "../components/sections/Projects";
import Experience from "../components/sections/Experience";
import Contact from "../components/sections/Contact";

import {
  Mail,
  Github,
  Linkedin,
  MapPin,
  Phone,
  Download,
  Send,
  Code,
  Database,
  BarChart3,
  Smartphone,
  Brain,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "skills",
        "projects",
        "experience",
        "contact",
      ];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const skills = {
    languages: [
      { name: "Dart", level: 90 },
      { name: "Python", level: 95 },
      { name: "SQL", level: 80 },
    ],
    frameworks: [
      { name: "Flutter", level: 92 },
      { name: "Firebase", level: 88 },
      { name: "Supabase", level: 80 },
      { name: "FastAPI", level: 75 },
    ],
    stateManagement: [
      { name: "BLoC", level: 85 },
      { name: "GetX", level: 88 },
      { name: "Provider", level: 90 },
    ],
    dataAnalysis: [
      { name: "Power BI", level: 80 },
      { name: "Pandas", level: 82 },
      { name: "Excel", level: 85 },
      { name: "scikit-learn", level: 75 },
    ],
  };

  const projects = [
    {
      title: "OnBook Solutions – CRM Platform",
      role: "Full-Stack Flutter & React Developer",
      period: "June 2025 – Aug 2025",
      description:
        "Enterprise CRM with web and mobile interfaces, real-time dashboards, role-based access, and comprehensive lead management system.",
      tech: ["Flutter", "Firebase", "FastAPI", "Node.js", "AWS", "BLoC"],
      highlights: [
        "Real-time dashboards with Firebase Streams",
        "Clean Architecture for scalability",
        "Role-based access control",
        "Multi-layer structure (data, domain, presentation)",
      ],
      // link: "https://onbook.web.app/",
      link: "https://onbook.cloud/",
      icon: Database,
    },
    {
      title: "Dementia Prediction System",
      role: "ML Developer & Data Analyst",
      period: "2024 - 2025",
      description:
        "Machine learning model predicting dementia risk using lifestyle, demographic, and health data with comprehensive data preprocessing and feature engineering.",
      tech: [
        "Python",
        "scikit-learn",
        "Pandas",
        "MySQL",
        "Matplotlib",
        "Seaborn",
      ],
      highlights: [
        "Multiple ML models with ROC-AUC evaluation",
        "Feature selection & importance analysis",
        "Data preprocessing pipeline",
        "Interactive visualizations",
      ],
      icon: Brain,
    },
    {
      title: "AZ Education – Institutional App",
      role: "Flutter Developer",
      period: "2025 - Present",
      description:
        "Comprehensive institutional app organizing YouTube video classes by courses and subjects with real-time synchronization.",
      tech: ["Flutter", "Supabase", "Provider", "YouTube API"],
      highlights: [
        "Efficient content loading",
        "Real-time synchronization",
        "Scalable architecture",
        "Seamless video learning experience",
      ],
      icon: Smartphone,
    },
    {
      title: "Wheel Base – Vehicle Collection",
      role: "Flutter Developer",
      period: "2025",
      description:
        "Vehicle management app with detailed record-keeping, cross-device syncing, and secure data sharing capabilities.",
      tech: ["Flutter", "Supabase", "Provider"],
      highlights: [
        "Real-time data syncing",
        "Secure authentication",
        "Data sharing features",
        "Service tracking system",
      ],
      icon: Code,
    },
    {
      title: "Broomie – Service Booking",
      role: "Flutter Developer",
      period: "2025",
      description:
        "Cleaning services management app with booking system, recurring services, and feedback mechanisms.",
      tech: ["Flutter", "Firebase", "GetX"],
      highlights: [
        "Recurring service scheduling",
        "User feedback system",
        "Service management",
        "Optimized booking flow",
      ],
      icon: Smartphone,
    },
  ];

  const experience = [
    {
      title: "Software Developer (Freelance)",
      company: "Multiple Clients",
      location: "U A E and India",
      period: "April 2024 - Present",
      responsibilities: [
        "Built production-grade mobile apps end-to-end",
        "Integrated Firebase and Supabase backends",
        "Provided QA, debugging, and performance optimization",
        "Delivered apps for automotive, education, and service sectors",
      ],
    },
    {
      title: "Software Developer",
      company: "Popular Auto",
      location: "Ontario, Canada (Remote)",
      period: "June 2025 – Aug 2025",
      responsibilities: [
        "Spearheaded full-stack Flutter development for enterprise CRM",
        "Built real-time backend APIs using FastAPI",
        "Implemented role-based access control and secure authentication",
        "Delivered features in Agile sprints",
        "Enhanced app stability through optimized state management",
      ],
    },
    {
      title: "Data Analyst & ML Developer",
      company: "Cybacor Technologies",
      location: "Kerala, India",
      period: "April 2024 - March 2025",
      responsibilities: [
        "Performed data preprocessing and statistical analysis",
        "Built logistic regression ML models using Python",
        "Created data visualizations with Matplotlib, Seaborn, Power BI",
        "Developed interactive ML applications with Tkinter",
        "Applied EDA on Uber datasets to extract trends",
      ],
    },
    
    {
      title: "Flutter Intern",
      company: "GrapesGenix PVT LTD",
      location: "Kerala, India",
      period: "Aug 2023 – Feb 2024",
      responsibilities: [
        "Developed PetCare Android app using Flutter",
        "Integrated Firebase Authentication and Cloud Firestore",
        "Implemented stateful widgets and asynchronous programming",
        "Focused on intuitive UI and smooth navigation",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <button
              className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent focus:outline-none"
              onClick={() => scrollToSection("home")}
              aria-label="Go to Home"
              style={{ cursor: "pointer" }}
            >
              Fayisdotdev
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8">
              {[
                "Home",
                "About",
                "Skills",
                "Projects",
                "Experience",
                "Contact",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`transition-all duration-300 hover:text-cyan-400 ${
                    activeSection === item.toLowerCase()
                      ? "text-cyan-400 font-semibold"
                      : "text-slate-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-slate-300 hover:text-cyan-400 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pt-4 pb-2 flex flex-col gap-4">
              {[
                "Home",
                "About",
                "Skills",
                "Projects",
                "Experience",
                "Contact",
              ].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className={`text-left transition-all duration-300 hover:text-cyan-400 ${
                    activeSection === item.toLowerCase()
                      ? "text-cyan-400 font-semibold"
                      : "text-slate-300"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <Hero scrollToSection={scrollToSection} />
      {/* About */}
      <About />
      {/* Skills */}
      <Skills skills={skills} />

      {/* Projects*/}
      <Projects projects={projects} />

      {/* Experience Section */}
      <Experience experience={experience} />

      {/* Contact Section */}
      <Contact />

      {/* Footer */}
      <footer className="relative py-12 px-6 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto text-center space-y-6">
          <div className="flex justify-center gap-6">
            <a
              href="https://github.com/fayisdotdev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
            >
              <Github size={24} />
            </a>
            <a
              href="https://linkedin.com/in/fayisdotdev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
            >
              <Linkedin size={24} />
            </a>
            <a
              href="mailto:muhammadfayiskmofficial@gmail.com"
              className="text-slate-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
            >
              <Mail size={24} />
            </a>
          </div>

          <p className="text-slate-500 text-sm">
            © 2025 Muhammad Fayis K M.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
