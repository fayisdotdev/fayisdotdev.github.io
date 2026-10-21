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
  const [portfolioContent, setPortfolioContent] = useState(
    getDefaultPortfolioContent,
  );
  const activeSection = useScrollSpy(sections);
  const siteSettings = Object.fromEntries(
    portfolioContent.siteSettings.map(({ setting_key, setting_value }) => [
      setting_key,
      setting_value,
    ]),
  );

  useEffect(() => {
    let active = true;

    fetchPortfolioContent()
      .then((content) => {
        if (active) setPortfolioContent(content);
      })
      .catch((error) => {
        console.error("Portfolio content could not be loaded; showing bundled defaults.", error);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const settings = Object.fromEntries(
      portfolioContent.siteSettings.map(({ setting_key, setting_value }) => [
        setting_key,
        setting_value,
      ]),
    );
    const seo = Object.fromEntries(
      portfolioContent.seo.map(({ setting_key, setting_value }) => [
        setting_key,
        setting_value,
      ]),
    );
    document.documentElement.lang = seo.language || "en";
    document.title = seo.document_title || settings.brand_name || "Fayisdotdev";

    const setMeta = (name, content, attribute = "name") => {
      if (!content) return;
      let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };
    setMeta("description", seo.description);
    setMeta("og:title", seo.og_title, "property");
    setMeta("og:description", seo.og_description, "property");

    if (seo.canonical_url) {
      let canonical = document.head.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement("link");
        canonical.rel = "canonical";
        document.head.appendChild(canonical);
      }
      canonical.href = seo.canonical_url;
    }
    if (seo.favicon_path) {
      let icon = document.head.querySelector('link[rel="icon"]');
      if (!icon) {
        icon = document.createElement("link");
        icon.rel = "icon";
        document.head.appendChild(icon);
      }
      icon.href = seo.favicon_path;
    }
  }, [portfolioContent]);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="portfolio-page relative min-h-screen overflow-x-hidden bg-[#0a0b0e] font-sans text-slate-100 selection:bg-emerald-500 selection:text-slate-950">

      <Background />
{/* curser trail */}
      {/* <CursorTrail /> */}

      <Navbar
        active={activeSection}
        onScrollTo={scrollToSection}
        brandName={siteSettings.brand_name}
        items={portfolioContent.navigation.map((item) => ({
          id: item.section_id,
          label: item.label,
        }))}
      />

      <main className="relative z-10">
        <Hero
          scrollToSection={scrollToSection}
          content={portfolioContent.hero}
          actions={portfolioContent.heroActions}
          socialLinks={portfolioContent.socialLinks.filter((item) => item.placement.split(",").includes("hero"))}
        />
        <About
          content={portfolioContent.about}
          cards={portfolioContent.aboutCards}
          strengths={portfolioContent.aboutStrengths}
        />
        <Skills
          skills={portfolioContent.skills}
          categories={portfolioContent.skillCategories}
          heading={siteSettings.skills_heading}
        />
        <Projects
          projects={portfolioContent.projects}
          heading={siteSettings.projects_heading}
        />
        <Experience
          experience={portfolioContent.experience}
          heading={siteSettings.experience_heading}
        />
        <Contact content={portfolioContent.contact} />
      </main>
      <Footer
        links={portfolioContent.socialLinks.filter((item) => item.placement.split(",").includes("footer"))}
        content={portfolioContent.footer}
      />
      <ScrollToTop label={siteSettings.back_to_top_label} />

    </div>
  );
};

export default Portfolio;
