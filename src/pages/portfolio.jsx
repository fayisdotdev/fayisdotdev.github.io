import { useState } from "react";
import { useScrollSpy } from "../hooks/useScrollSpy";

import Background from "../components/layout/Background";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";

import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Skills from "../components/sections/Skills";
import Projects from "../components/sections/Projects";
import Experience from "../components/sections/Experience";
import Contact from "../components/sections/Contact";

import { skills, projects, experience } from "../data";

const sections = [
  "home",
  "about",
  "skills",
  "projects",
  "experience",
  "contact",
];

const Portfolio = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeSection = useScrollSpy(sections);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">

      <Background />

      <Navbar
        active={activeSection}
        onScrollTo={scrollToSection}
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
      />

      <Hero scrollToSection={scrollToSection} />
      <About />
      <Skills skills={skills} />
      <Projects projects={projects} />
      <Experience experience={experience} />
      <Contact />
      <Footer />

    </div>
  );
};

export default Portfolio;
