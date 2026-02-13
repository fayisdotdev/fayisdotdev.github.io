import { Database, Brain, Smartphone, Code } from "lucide-react";

export const projects = [
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
    link: "https://onbook.cloud/",
    icon: Database,
  },
  {
    title: "Dementia Prediction System",
    role: "ML Developer & Data Analyst",
    period: "2024 - 2025",
    description:
      "Machine learning model predicting dementia risk using lifestyle, demographic, and health data.",
    tech: ["Python", "scikit-learn", "Pandas", "MySQL"],
    highlights: [
      "Multiple ML models with ROC-AUC evaluation",
      "Feature importance analysis",
      "Data preprocessing pipeline",
    ],
    icon: Brain,
  },
  {
    title: "AZ Education – Institutional App",
    role: "Flutter Developer",
    period: "2025 - Present",
    description:
      "Institutional app organizing YouTube video classes with real-time sync.",
    tech: ["Flutter", "Supabase", "Provider"],
    highlights: [
      "Efficient content loading",
      "Real-time synchronization",
      "Scalable architecture",
    ],
    icon: Smartphone,
  },
  {
    title: "Wheel Base – Vehicle Collection",
    role: "Flutter Developer",
    period: "2025",
    description:
      "Vehicle management app with record-keeping and cross-device syncing.",
    tech: ["Flutter", "Supabase", "Provider"],
    highlights: [
      "Secure authentication",
      "Service tracking system",
      "Data sharing",
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
