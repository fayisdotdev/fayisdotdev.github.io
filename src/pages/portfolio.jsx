import { useEffect, useState } from "react";
import { useScrollSpy } from "../hooks/useScrollSpy";

import Background from "../components/layout/Background";
// import CursorTrail from "../components/layout/CursorTrail";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ScrollToTop from "../components/layout/ScrollToTop";

import Hero from "../components/sections/Hero";
import About from "../components/sections/About";
import Skills from "../components/sections/Skills";
import Projects from "../components/sections/Projects";
import Experience from "../components/sections/Experience";
import Contact from "../components/sections/Contact";

import {
  fetchPortfolioContent,
  getDefaultPortfolioContent,
} from "../services/portfolioContentService";

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
  const [portfolioContent, setPortfolioContent] = useState(
    getDefaultPortfolioContent,
  );
  const activeSection = useScrollSpy(sections);

  useEffect(() => {
    let active = true;

    fetchPortfolioContent()
      .then((content) => {
        if (active) setPortfolioContent(content);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMenuOpen(false);
  };

  return (
    <div className="portfolio-page min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">

      <Background />
{/* curser trail */}
      {/* <CursorTrail /> */}

      <Navbar
        active={activeSection}
        onScrollTo={scrollToSection}
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
      />

      <Hero scrollToSection={scrollToSection} />
      <About />
      <Skills skills={portfolioContent.skills} />
      <Projects projects={portfolioContent.projects} />
      <Experience experience={portfolioContent.experience} />
      <Contact />
      <Footer />
      <ScrollToTop />

    </div>
  );
};

export default Portfolio;
